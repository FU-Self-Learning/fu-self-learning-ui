"use client"

import React from "react";
import { Avatar, Button, Card, Typography, Spin, message } from "antd";
import { motion } from "framer-motion";
import { useUsers } from "@/hooks/useUsers";

const ListFollowingPage = () => {
    const { data: users, isLoading, isError, error } = useUsers();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Spin size="large" />
            </div>
        );
    }

    if (isError) {
        message.error("Failed to load users: " + error?.message);
        return <div className="text-red-500">Error loading users.</div>;
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
                {users?.map((item) => (
                    <Card
                        key={item.id}
                        className="!rounded-xl hover:!shadow-md transition-all hover:scale-[1.02] !cursor-pointer !mb-2"
                        styles={{ body: { padding: 10 } }}
                    >
                        <div className="flex items-center gap-4">
                            <Avatar
                                size={48}
                                src={item.avatarUrl}
                                className="!flex !items-center !justify-center"
                            />
                            <div className="flex-1 min-w-0">
                                <Typography.Text strong className="block text-gray-800 text-lg truncate">
                                    {item.username}
                                </Typography.Text>
                                <Typography.Text className="text-sm text-gray-500 block">
                                    {item.email}
                                </Typography.Text>
                            </div>
                            <Button
                                type="link"
                                className="!text-blue-500 hover:!text-blue-600 !p-0 !h-auto !cursor-pointer"
                            >
                                Follow
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </motion.div>
    );
};

export default ListFollowingPage;
