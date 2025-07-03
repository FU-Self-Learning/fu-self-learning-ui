import { UserInfo } from '@/providers/auth/types/authType';

export interface FollowRelationship {
  id: number;
  followingUser: UserInfo;
  followedUser: UserInfo;
  createdAt: string;
  updatedAt: string;
}

export type FollowResponse = FollowRelationship[];

export interface UnfollowerResponse {
  followingId: string;
}
