import { changePassword } from "@/shared/api/auth.api";
import { extractErrorMessage } from "@/utils/ErrorHandle";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";

export const useChangePass = () => {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      message.success("Password changed successfully");
    },
    onError: (error) => {
      const msg = extractErrorMessage(error);
      message.error(msg);
    },
  });
};  
