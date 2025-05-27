import { fetchUserProfile, updateUserProfile } from "@/shared/api/user.api";
import { getStorageData } from "@/shared/store";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchUserProfile,
    enabled: !!getStorageData("accessToken"),
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: updateUserProfile,
  });
};
