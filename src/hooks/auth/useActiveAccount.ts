import { getActivateAccount } from "@/shared/api/auth.api";
import { useMutation } from "@tanstack/react-query";

export const useActivateAccount = () => {
  return useMutation({ mutationFn: getActivateAccount });
};
