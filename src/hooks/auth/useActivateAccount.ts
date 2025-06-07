import { getActivateAccount } from "@/shared/api/auth.api";
import { extractErrorMessage } from "@/utils/ErrorHandle";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";

export const useActivateAccount = () => {
  return useMutation({
    mutationFn: getActivateAccount,
    onSuccess: () => {
      message.success("Account activated successfully");
    },
    onError: (error) => {
      const msg = extractErrorMessage(error);
      message.error(msg);
    },
  });
};
