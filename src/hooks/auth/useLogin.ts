import { setUser } from "@/providers/auth/reducer/authSlice";
import { AppDispatch } from "@/providers/store";
import { login } from "@/shared/api/auth.api";
import { setStorageData } from "@/shared/store";
import { extractErrorMessage } from "@/utils/ErrorHandle";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { useDispatch } from "react-redux";

export const useLogin = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      data.userInfo ? setStorageData("user", data.userInfo) : null;
      setStorageData("accessToken", data.accessToken);
      setStorageData("refreshToken", data.refreshToken);
      dispatch(setUser(data.userInfo));
      message.success("Login Successfully");
    },
    onError: (error) => {
      const msg = extractErrorMessage(error);
      message.error(msg);
    },
  });
};
