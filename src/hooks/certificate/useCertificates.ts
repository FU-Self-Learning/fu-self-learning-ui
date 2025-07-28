import { useQuery } from '@tanstack/react-query';
import { getUserCertificates } from '@/shared/api/certificate.api';
import { CourseCertificate } from '@/types/testType';

export const useUserCertificates = () => {
  return useQuery<CourseCertificate[]>({
    queryKey: ['certificates', 'user'],
    queryFn: getUserCertificates,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
