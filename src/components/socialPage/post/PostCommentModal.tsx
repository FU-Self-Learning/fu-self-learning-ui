import React from "react";
import { Modal, Avatar, Typography, Input, Button } from "antd";
import { UserOutlined, SendOutlined } from "@ant-design/icons";
import { PostResponse } from "@/types/postType";
import TimeAgoText from "./TimeAgoText";

interface PostCommentModalProps {
    visible: boolean;
    onClose: () => void;
    post: PostResponse;
}

const PostCommentModal: React.FC<PostCommentModalProps> = ({ visible, onClose, post }) => {
    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            width={700}
            centered
            className="!rounded-lg"
        >
            <div className="flex flex-col h-full">
                <div className="border-b pb-4 mb-4">
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
                    <Typography.Title level={4} className="!mb-2 !text-lg !font-semibold">{post?.title}</Typography.Title>
                    <Typography.Paragraph className="!mb-4">{post?.body}</Typography.Paragraph>

                    {post?.images && post.images.length > 0 && (
                        <div
                            className={`grid gap-2 ${post.images.length === 1
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
                </div>
                <div className="flex-1 overflow-y-auto mb-4">
                    <Typography.Text strong>Comments</Typography.Text>
                    <div className="mt-2 text-gray-500">No comments yet.</div>
                </div>

                <div className="flex items-center gap-2 border-t pt-4">
                    <Avatar icon={<UserOutlined />} className="mr-2" />
                    <Input
                        placeholder="Write a comment..."
                        className="!rounded-full !flex-1"
                        suffix={<Button type="text" icon={<SendOutlined />} />}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default PostCommentModal; 