import { useQuery } from '@tanstack/react-query';
import { getExamsByCourseId, getInstructorExamsByCourseId } from '@/shared/api/exam.api';
import { ExamFilter } from '@/types/examType';

export const useExams = (courseId: number, filter?: ExamFilter) => {
  return useQuery({
    queryKey: ['exams', courseId, filter],
    queryFn: () => getExamsByCourseId(courseId, filter),
    enabled: !!courseId,
  });
};

export const useInstructorExams = (courseId: number) => {
  return useQuery({
    queryKey: ['instructor-exams', courseId],
    queryFn: () => getInstructorExamsByCourseId(courseId),
    enabled: !!courseId,
  });
};
