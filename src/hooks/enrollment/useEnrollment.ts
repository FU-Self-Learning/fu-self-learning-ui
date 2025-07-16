import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentApi } from '@/shared/api/enrollment.api';
import { EnrolledCourse, CourseStats, EnrollmentCheck } from '@/types/enrollmentType';

export const useMyEnrolledCourses = () => {
  return useQuery<EnrolledCourse[]>({
    queryKey: ['enrollments', 'my-courses'],
    queryFn: async () => {
      const response = await enrollmentApi.getMyEnrolledCourses();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCheckEnrollment = (courseId: string) => {
  return useQuery<EnrollmentCheck>({
    queryKey: ['enrollments', 'check', courseId],
    queryFn: async () => {
      const response = await enrollmentApi.checkEnrollment(courseId);
      return response.data;
    },
    enabled: !!courseId,
  });
};

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseId, progress }: { courseId: string; progress: number }) => {
      const response = await enrollmentApi.updateProgress(courseId, progress);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['enrollments', 'my-courses'] });
      queryClient.invalidateQueries({ queryKey: ['enrollments', 'stats', variables.courseId] });
    },
  });
};

export const useCourseStats = (courseId: string) => {
  return useQuery<CourseStats>({
    queryKey: ['enrollments', 'stats', courseId],
    queryFn: async () => {
      const response = await enrollmentApi.getCourseStats(courseId);
      return response.data;
    },
    enabled: !!courseId,
  });
};
