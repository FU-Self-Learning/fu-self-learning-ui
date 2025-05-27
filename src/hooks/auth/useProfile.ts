import { setUser } from "@/providers/auth/reducer/authSlice";
import { fetchUserProfile, updateUserProfile, uploadAvatar } from "@/shared/api/user.api";
import { getStorageData } from "@/shared/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/providers/store";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchUserProfile,
    enabled: !!getStorageData("accessToken"),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      dispatch(setUser(data));
    },
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
