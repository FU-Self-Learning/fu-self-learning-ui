import { FollowResponse, UnfollowerResponse } from "@/types/followType";
import { APP_URL } from "../constants/apiConstants";
import api from "./index";

export const getFollowers = async (): Promise<FollowResponse> => {
  const response = await api.get(`${APP_URL}/follow/followers`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return response.data;
};

export const unfollowUser = async (
  followingId: number
): Promise<UnfollowerResponse> => {
  const response = await api.post(
    `${APP_URL}/follow/unfollow`,
    {
      followingId,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
  return response.data;
};

export const followUser = async (
  followingId: number
): Promise<FollowResponse> => {
  const response = await api.post(
    `${APP_URL}/follow`,
    {
      followingId,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
  return response.data;
};
