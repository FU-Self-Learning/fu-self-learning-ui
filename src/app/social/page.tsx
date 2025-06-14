'use client';

import React from "react";
import { Card, Avatar, Typography, Space, Button } from "antd";
import { HeartOutlined, MessageOutlined, BookOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

export default function SocialPage() {
    return (
        <div className="flex justify-between mt-4">
            <div className="flex-1 max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="!rounded-2xl !shadow-lg hover:!shadow-xl transition-all">
                        <div className="flex items-center gap-4 mb-4">
                            <Avatar
                                size={48}
                                src="https://i.pravatar.cc/150?img=1"
                                className="!flex !items-center !justify-center"
                            />
                            <div className="flex-1">
                                <Typography.Text strong className="block text-gray-800 text-lg">
                                    John Doe
                                </Typography.Text>
                            </div>
                            <Button type="text" className="!text-gray-500 hover:!text-blue-500">
                                <BookOutlined />
                            </Button>
                        </div>
                        <div className="mb-4">
                            <Typography.Paragraph className="text-gray-700 mb-4">
                                Just finished building a new React application using Next.js and Tailwind CSS!
                                The combination of these technologies makes development so much faster and more enjoyable.
                                Here's a quick overview of what I learned:
                            </Typography.Paragraph>
                            <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                <Typography.Text className="text-gray-600">
                                    1. Server-side rendering with Next.js
                                    2. Styling with Tailwind CSS
                                    3. Type safety with TypeScript
                                    4. State management with Redux
                                </Typography.Text>
                            </div>
                        </div>

                        <div className="mb-4">
                            <img
                                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c"
                                alt="Code on screen"
                                className="w-full h-64 object-cover rounded-xl"
                            />
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                            <Button
                                type="text"
                                icon={<HeartOutlined />}
                                className="!text-gray-500 hover:!text-red-500 !flex !items-center"
                            >
                                Like
                            </Button>
                            <Button
                                type="text"
                                icon={<MessageOutlined />}
                                className="!text-gray-500 hover:!text-blue-500 !flex !items-center"
                            >
                                Comment
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
