import { useQuery } from '@tanstack/react-query';
import { getInstructorExamsByCourseId } from '@/shared/api/exam.api';

export const useInstructorExams = (courseId: number) => {
  return useQuery({
    queryKey: ['instructor-exams', courseId],
    queryFn: () => getInstructorExamsByCourseId(courseId),
    enabled: !!courseId,
  });
};
