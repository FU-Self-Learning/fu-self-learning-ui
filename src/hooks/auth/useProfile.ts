import { UserInfo } from "@/providers/auth/types/authType";
import api from "@/shared/api";
import { APP_URL } from "@/shared/constants/apiConstants";
import { getStorageData } from "@/shared/store";
import { useQuery } from "@tanstack/react-query";

const fetchUserProfile = async (): Promise<UserInfo> => {
  const response = await api.get(`${APP_URL}/users/me`);
  return response.data;
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchUserProfile,
    enabled: !!getStorageData("accessToken"),
  });
};

export const useProfileLocal = () => {
  const user: UserInfo = getStorageData("user");
  return { user };
};
