'use client';

import { useParams } from 'next/navigation';
import {
  CourseDetailHeader,
  CourseDetailTabs,
  CourseDetailContent,
} from '@/components/course/courseDetail';
import { useCourseDetail } from '@/hooks/course/useCourseDetail';
import { Spin } from 'antd';
import { useTopics } from '@/hooks/topic/useTopics';
import { useState } from 'react';
import { LessonInTopic } from '@/types/topicType';

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedLesson, setSelectedLesson] = useState<LessonInTopic | null>(null);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number | undefined>(undefined);

  const { data: courseDetail, isLoading } = useCourseDetail(id);
  const { data: topics, isLoading: isLoadingTopics } = useTopics(id);

  if (isLoading || !courseDetail || isLoadingTopics)
    return <Spin className='flex justify-center items-center h-screen' />;

  const stats = {
    totalLessons: courseDetail.totalLessons,
    totalDuration: courseDetail.totalDuration,
    rating: 0,
    reviewCount: 0,
  };

  const handleLessonSelect = (lesson: LessonInTopic) => {
    setSelectedLesson(lesson);
    
    let lessonIndex = 0;
    for (const topic of topics || []) {
      for (const topicLesson of topic.lessons || []) {
        if (topicLesson.id === lesson.id) {
          setSelectedLessonIndex(lessonIndex);
          return;
        }
        lessonIndex++;
      }
    }
  };

  return (
    <div className='max-w-screen-xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6'>
      <div className='lg:col-span-2'>
        <CourseDetailHeader
          videoIntroUrl={selectedLesson ? selectedLesson.videoUrl : courseDetail.videoIntroUrl}
          title={courseDetail.title}
          category={courseDetail.categories[0].name}
          stats={stats}
          isThumbnail={selectedLesson ? false : true}
          courseId={id}
          selectedLessonIndex={selectedLessonIndex}
        />
        <CourseDetailTabs
          description={courseDetail.description}
          learningPoints={courseDetail.topics.map((topic) => topic.title)}
          author={courseDetail.instructor}
          reviews={[]}
        />
      </div>
      <CourseDetailContent
        sections={topics || []}
        onLessonSelect={handleLessonSelect}
        courseId={id}
      />
    </div>
  );
};

export default CourseDetail;
