import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { generateCertificate, hasCertificate } from '@/shared/api/certificate.api';

export const useHasCertificate = (courseId: number) => {
  return useQuery<{ hasCertificate: boolean }>({
    queryKey: ['has-certificate', courseId],
    queryFn: () => hasCertificate(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGenerateCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateCertificate,
    onSuccess: (data, courseId) => {
      // Invalidate and refetch certificates
      queryClient.invalidateQueries({ queryKey: ['certificates', 'user'] });
      queryClient.invalidateQueries({ queryKey: ['certificate', 'by-course', courseId] });
      queryClient.invalidateQueries({ queryKey: ['has-certificate', courseId] });
    },
  });
};
