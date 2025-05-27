import { fetchUserProfile, updateUserProfile, uploadAvatar } from "@/shared/api/user.api";
import { getStorageData } from "@/shared/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
