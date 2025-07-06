import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { extractErrorMessage } from '@/utils/ErrorHandle';
import { createCourse } from '@/shared/api/course.api';
import { createTopicInstructor } from '@/shared/api/topic.api';
import { createManyLessons } from '@/shared/api/lesson.api';
import { GeneratedCourseData } from '@/shared/api/course.api';

interface CreateCourseWithStructureRequest {
  courseData: FormData;
  generatedData: GeneratedCourseData;
}

export const useCreateCourseWithStructure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseData, generatedData }: CreateCourseWithStructureRequest) => {
      // Step 1: Create the course
      const courseResponse = await createCourse(courseData);
      const courseId = courseResponse.id;

      // Step 2: Create topics for the course
      const topicPromises = generatedData.topics.map(async (topic) => {
        const topicResponse = await createTopicInstructor(courseId, {
          title: topic.title,
          description: topic.description,
        });
        return topicResponse;
      });

      const createdTopics = await Promise.all(topicPromises);

      // Step 3: Create lessons for each topic
      const lessonPromises = createdTopics.map(async (topic, index) => {
        const lessons = generatedData.topics[index].lessons;
        const lessonData = lessons.map((lesson) => ({
          title: lesson.title,
          description: lesson.description,
        }));

        // Create FormData for lessons
        const lessonFormData = new FormData();
        lessonFormData.append('createLessonsData', JSON.stringify(lessonData));

        return createManyLessons(topic.id.toString(), lessonFormData);
      });

      await Promise.all(lessonPromises);

      return courseResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['myCourses'] });
      message.success('Course created successfully with generated structure!');
    },
    onError: (error) => {
      message.error(extractErrorMessage(error) || 'Failed to create course with structure');
    },
  });
};
