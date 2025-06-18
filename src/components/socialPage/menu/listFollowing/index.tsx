"use client"

import React, { useEffect } from "react";
import { Avatar, Button, Card, Typography, Spin, message } from "antd";
import { motion } from "framer-motion";
import { useFollowers } from "@/hooks/follow/useFollowers";
import { useUnfollow } from "@/hooks/follow/useUnfollow";

const ListFollowingPage = () => {
    const { data: followers, isLoading, isError, error } = useFollowers();
    const { mutate: unfollow, isPending: isUnfollowing } = useUnfollow();

    useEffect(() => {
        if (isError) {
            message.error("Failed to load followers: " + error?.message);
        }
    }, [isError, error]);

    const handleUnfollow = (id: number) => {
        unfollow(id);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Spin size="large" />
            </div>
        );
    }

    if (isError) {
        return <div className="text-red-500">Error loading followers.</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-80 bg-white rounded-2xl shadow-lg p-6 h-[calc(100vh-2rem)] sticky top-4 overflow-y-auto"
        >
            <div className="flex justify-between items-center mb-6">
                <Typography.Title level={4} className="!mb-0 !text-gray-800">
                    Followers
                </Typography.Title>
                <Button
                    type="link"
                    className="!text-blue-500 hover:!text-blue-600 !p-0 !h-auto"
                >
                    View all
                </Button>
            </div>

            <div className="space-y-4">
                {followers?.map((item) => (
                    <Card
                        key={item.id}
                        className="!rounded-xl hover:!shadow-md transition-all hover:scale-[1.02] !cursor-pointer !mb-2"
                        styles={{ body: { padding: 10 } }}
                    >
                        <div className="flex items-center gap-4">
                            <Avatar
                                size={48}
                                src={item.followingUser.avatarUrl}
                                className="!flex !items-center !justify-center"
                            />
                            <div className="flex-1 min-w-0">
                                <Typography.Text strong className="block text-gray-800 text-lg truncate">
                                    {item.followingUser.username}
                                </Typography.Text>
                                <Typography.Text className="text-sm text-gray-500 block">
                                    {item.followingUser.email}
                                </Typography.Text>
                            </div>
                            <Button
                                type="default"
                                danger
                                className="!rounded-full !px-4"
                                onClick={() => handleUnfollow(Number(item.followingUser.id))}
                                loading={isUnfollowing}
                            >
                                UnFollow
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </motion.div>
    );
};

export default ListFollowingPage;
