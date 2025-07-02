import api from "./index";
import { APP_URL } from "../constants/apiConstants";

export const createInstructorRequest = async (pdf: File, token: string) => {
  const formData = new FormData();
  formData.append("pdf", pdf);

  const response = await api.post(`${APP_URL}/instructor-requests`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
