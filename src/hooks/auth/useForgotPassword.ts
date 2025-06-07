import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/shared/api/auth.api";
import { message } from "antd";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      message.success("Password reset link has been sent to your email");
    },
    onError: () => {
      message.error("Failed to send reset link");
    },
  });
};
