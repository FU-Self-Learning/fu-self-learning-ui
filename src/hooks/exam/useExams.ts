import { useQuery } from '@tanstack/react-query';
import { getExamsByCourseId } from '@/shared/api/exam.api';
import { ExamFilter } from '@/types/examType';

export const useExams = (courseId: number, filter?: ExamFilter) => {
  return useQuery({
    queryKey: ['exams', courseId, filter],
    queryFn: () => getExamsByCourseId(courseId, filter),
    enabled: !!courseId,
  });
};
