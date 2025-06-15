"use client";

import React from "react";
import { Card, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Post } from "@/types/postType";
import TimeAgoText from "./TimeAgoText";

interface PostListProps {
    posts: Post[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
    return (
        <div className="space-y-4">
            {posts.map((post, index) => (
                <Card key={`${post?.id}-${index}`} className="w-full !mb-4">
                    <div className="flex items-center mb-4 gap-2">
                        <Avatar
                            icon={<UserOutlined />}
                            src={post.user?.avatarUrl || undefined}
                            className="mr-2"
                        />
                        <div>
                            <div className="font-bold text-[14px]">
                                {post.user?.username || "Unknown User"}
                            </div>
                            <div className="text-gray-500 text-sm">
                                <TimeAgoText date={post?.createdAt} />
                            </div>
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-2">{post?.title}</h3>
                    <p className="text-gray-700 mb-4">{post?.body}</p>

                    {post?.images && post.images.length > 0 && (
                        <div
                            className={`grid gap-2 mb-4 ${post.images.length === 1
                                ? "grid-cols-1"
                                : post.images.length === 2
                                    ? "grid-cols-2"
                                    : "grid-cols-2 sm:grid-cols-3"
                                }`}
                        >
                            {post.images.map((imgUrl, imgIndex) => (
                                <img
                                    key={imgIndex}
                                    src={imgUrl}
                                    alt={`Post image ${imgIndex + 1}`}
                                    className="w-full h-64 object-cover rounded"
                                />
                            ))}
                        </div>
                    )}
                </Card>
            ))}
        </div>
    );
};

export default PostList; 