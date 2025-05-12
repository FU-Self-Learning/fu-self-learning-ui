import { register } from "@/shared/api/auth.api";
import { extractErrorMessage } from "@/utils/ErrorHandle";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      message.success("Login Successfully");
    },
    onError: (error) => {
      console.log(error);

      const msg = extractErrorMessage(error);
      message.error(msg);
    },
  });
};
