import { useQuery } from '@tanstack/react-query';
import { getCertificateById, getCourseCertificate } from '@/shared/api/certificate.api';
import { CourseCertificate } from '@/types/testType';

export const useCertificateById = (certificateId: number) => {
  return useQuery<CourseCertificate>({
    queryKey: ['certificate', 'by-id', certificateId],
    queryFn: () => getCertificateById(certificateId),
    enabled: !!certificateId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCertificateByCourseId = (courseId: number) => {
  return useQuery<CourseCertificate>({
    queryKey: ['certificate', 'by-course', courseId],
    queryFn: () => getCourseCertificate(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
