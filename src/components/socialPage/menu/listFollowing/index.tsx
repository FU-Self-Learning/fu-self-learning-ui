"use client"

import React from "react";
import { Avatar, Button, Card, Typography } from "antd";
import { motion } from "framer-motion";

type Suggestion = {
    username: string;
    email: string;
    avatarUrl: string;
};

const suggestions: Suggestion[] = [
    {
        username: "kuyn.anh_",
        email: "le@gmai.com",
        avatarUrl: "https://i.pravatar.cc/150?img=1",
    },
    {
        username: "joy_tt5",
        email: "nguyen@gmail.com",
        avatarUrl: "https://i.pravatar.cc/150?img=2",
    },
    {
        username: "wizhazhs.23",
        email: "mc@gmail.com",
        avatarUrl: "https://i.pravatar.cc/150?img=3",
    },
    {
        username: "hpuccc",
        email: "nguyen@gmail.com",
        avatarUrl: "https://i.pravatar.cc/150?img=4",
    },
    {
        username: "dangghungg_19",
        email: "nguyen@gmail.com",
        avatarUrl: "https://i.pravatar.cc/150?img=5",
    },
];

const ListFollowingPage = () => {
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
                {suggestions.map((item, index) => (
                    <Card
                        key={index}
                        className="!rounded-xl hover:!shadow-md transition-all hover:scale-[1.02] cursor-pointer"
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
                                className="!text-blue-500 hover:!text-blue-600 !p-0 !h-auto"
                            >
                                View
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </motion.div>
    );
};

export default ListFollowingPage;
