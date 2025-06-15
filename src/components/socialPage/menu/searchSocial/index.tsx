import React from "react";
import { Input, Avatar, Button, Card, Typography } from "antd";
import { CloseCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useUsers } from "@/hooks/useUsers";




interface SearchSocialPageProps {
    handleCloseSearch: () => void
}

const SearchSocialPage = ({ handleCloseSearch }: SearchSocialPageProps) => {
    const { data: users } = useUsers();

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-96 bg-white rounded-2xl shadow-lg p-6 h-[calc(100vh-2rem)] overflow-y-auto"
        >
            <div className="mb-6">
                <div className="flex flex-row justify-between items-center  !h-full ">
                    <Typography.Title level={4} className=" !text-center !text-gray-800 !text-2xl !font-bold">
                        Search
                    </Typography.Title>
                    <CloseCircleOutlined className="text-3xl !text-black" onClick={handleCloseSearch} />
                </div>
                <Input
                    size="large"
                    placeholder="Search users..."
                    prefix={<SearchOutlined className="text-gray-400" />}
                    className="!rounded-xl !border-gray-200 hover:!border-blue-400 focus:!border-blue-400 !shadow-sm"
                />
            </div>

            <div className="space-y-4">
                {users?.map((item, index) => (
                    <Card
                        styles={{ body: { padding: 10 } }}
                        key={index}
                        className="!rounded-xl hover:!shadow-md transition-all hover:scale-[1.02] cursor-pointer"
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
                                type="primary"
                                className="!bg-blue-500 hover:!bg-blue-600 !rounded-full !px-4"
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

export default SearchSocialPage;