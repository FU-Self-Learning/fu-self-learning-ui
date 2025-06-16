import React, { useState } from "react";
import { Modal, Avatar, Typography, Input, Button, Spin, Dropdown, Menu } from "antd";
import { UserOutlined, SendOutlined, MoreOutlined } from "@ant-design/icons";
import { PostResponse } from "@/types/postType";
import TimeAgoText from "./TimeAgoText";
import { useCommentsByPostId } from "@/hooks/comments/useCommentsByPostId";
import { useCreateComment } from "@/hooks/comments/useCreateComment";
import { CommentResponse } from "@/types/commentType";
import { useProfile } from "@/hooks/auth/useProfile";

interface PostCommentModalProps {
    visible: boolean;
    onClose: () => void;
    post: PostResponse;
}

const PostCommentModal: React.FC<PostCommentModalProps> = ({ visible, onClose, post }) => {
    const { data: currentUserProfile } = useProfile();
    const { data: comments, isLoading, isError, error } = useCommentsByPostId(post.id);
    const { mutate: createComment, isPending: isCreatingComment } = useCreateComment();

    const [commentContent, setCommentContent] = useState("");
    const [replyingToCommentId, setReplyingToCommentId] = useState<number | null>(null);
    const [replyingToUsername, setReplyingToUsername] = useState<string | null>(null);

    const handlePostComment = () => {
        if (commentContent.trim()) {
            createComment({ postId: post.id, content: commentContent, parentId: replyingToCommentId || undefined });
            setCommentContent("");
            setReplyingToCommentId(null);
            setReplyingToUsername(null);
        }
    };

    const handleReplyClick = (commentId: number, username: string) => {
        setReplyingToCommentId(commentId);
        setReplyingToUsername(username);
        setCommentContent(`@${username} `);
    };

    const renderComments = (commentList: CommentResponse[], level = 0) => {
        const indentationUnit = 6;

        return commentList.map((comment) => {
            const indentationClass = level > 0
                ? `ml-${level * indentationUnit} border-l pl-2 border-gray-200`
                : '';

            return (
                <div key={comment.id} className={`mb-4 ${indentationClass}`}>
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <Avatar icon={<UserOutlined />} src={comment.user?.avatarUrl || undefined} size="small" />
                            <Typography.Text strong>{comment.user?.username || "Unknown User"}</Typography.Text>
                            <Typography.Text className="text-gray-500 text-xs">
                                <TimeAgoText date={comment.createdAt} />
                            </Typography.Text>
                        </div>
                        <Dropdown placement="bottomRight" overlay={(
                            <Menu className="rounded-lg shadow-md min-w-[120px]">
                                <Menu.Item key="update" className="px-3 py-2 text-sm hover:bg-gray-100 hover:text-blue-500" onClick={() => console.log("Update clicked for comment", comment.id)}>
                                    Update
                                </Menu.Item>
                                <Menu.Item key="delete" className="px-3 py-2 text-sm hover:bg-gray-100 hover:text-blue-500" onClick={() => console.log("Delete clicked for comment", comment.id)}>
                                    Delete
                                </Menu.Item>
                            </Menu>
                        )} trigger={['click']}>
                            <MoreOutlined />
                        </Dropdown>
                    </div>
                    <Typography.Paragraph className="mb-2 text-sm">{comment.content}</Typography.Paragraph>
                    <div className="flex gap-4 mt-1">
                        <Button type="link" className="!p-0 !h-auto !text-blue-500" onClick={() => handleReplyClick(comment.id, comment.user?.username || "Unknown User")}>Reply</Button>
                    </div>
                    {comment.replies && comment.replies.length > 0 && (
                        // Recursively render replies with an incremented level
                        renderComments(comment.replies, level + 1)
                    )}
                </div>
            );
        });
    };

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
                            {post.images.map((imgUrl: string, imgIndex: number) => (
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
                    {isLoading ? (
                        <div className="flex justify-center items-center h-24">
                            <Spin size="large" />
                        </div>
                    ) : isError ? (
                        <div className="text-red-500 mt-2">Error loading comments: {error?.message}</div>
                    ) : comments && comments.length > 0 ? (
                        <div className="mt-2">
                            {renderComments(comments)}
                        </div>
                    ) : (
                        <div className="mt-2 text-gray-500">No comments yet.</div>
                    )}
                </div>

                <div className="flex items-center gap-2 border-t pt-4">
                    <Avatar icon={<UserOutlined />} src={currentUserProfile?.avatarUrl} className="mr-2" />
                    <Input
                        placeholder={replyingToUsername ? `Replying to @${replyingToUsername}...` : "Write a comment..."}
                        className="!rounded-full !flex-1"
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        onPressEnter={handlePostComment}
                        suffix={
                            <Button
                                type="text"
                                icon={<SendOutlined />}
                                onClick={handlePostComment}
                                loading={isCreatingComment}
                                disabled={!commentContent.trim()}
                            />
                        }
                    />
                </div>
            </div>
        </Modal>
    );
};

export default PostCommentModal; 