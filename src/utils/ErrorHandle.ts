import { AxiosError } from "axios";

/**
 * Trích xuất thông báo lỗi từ các phản hồi khác nhau
 */
export const extractErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const res = error.response?.data;

    if (typeof res?.data === "string") return res.data;

    // Trường hợp: { errors: ["..."] }
    if (Array.isArray(res?.errors) && res.errors.length > 0)
      return res.errors[0];

    // Trường hợp: data: [null] hoặc data: [undefined]
    if (Array.isArray(res?.data) && res.data.length > 0) {
      const firstError = res.data[0];
      if (firstError === null || firstError === undefined) {
        return res.errorMessage;
      }
      return firstError;
    }

    // fallback nếu response có status
    return `Request failed with status ${error.response?.status}`;
  }

  return "An unknown error has occurred.";
};
