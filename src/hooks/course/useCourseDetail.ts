import { useQuery } from "@tanstack/react-query";
import { getCourseById } from "@/shared/api/course.api";

export const useCourseDetail = (id: string) => {
  return useQuery({
    queryKey: ["courseDetail", id],
    queryFn: () => getCourseById(id),
    enabled: !!id,
  });
};