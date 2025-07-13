'use client';

import React, { useState } from 'react';
import { Card, Avatar, Button, Dropdown, Modal, message, Image } from 'antd';
import {
  UserOutlined,
  MessageOutlined,
  LikeOutlined,
  HeartFilled,
  MoreOutlined,
} from '@ant-design/icons';
import { PostResponse } from '@/types/postType';
import TimeAgoText from './TimeAgoText';
import PostCommentModal from './PostCommentModal';
import { useDeletePost } from '@/hooks/posts/usePosts';
import { isValidWebUrl } from '@/utils/urlValidation';

interface PostListProps {
  posts: PostResponse[];
}

const PostList = ({ posts }: PostListProps) => {
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostResponse | null>(null);

  const { mutate: deletePostMutation } = useDeletePost();

  const handleCommentClick = (post: PostResponse) => {
    setSelectedPost(post);
    setIsCommentModalVisible(true);
  };

  const handleCloseCommentModal = () => {
    setIsCommentModalVisible(false);
    setSelectedPost(null);
  };

  const handleDeletePost = (postId: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this post?',
      content: 'This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        console.log('Delete confirmed for post', postId);
        deletePostMutation(postId, {
          onSuccess: () => {
            message.success('Post deleted successfully!');
          },
          onError: (error) => {
            message.error(`Failed to delete post: ${error.message}`);
          },
        });
      },
      onCancel() {
        console.log('Delete cancelled');
      },
    });
  };

  return (
    <div className='space-y-4'>
      {posts.map((post, index) => (
        <Card key={`${post?.id}-${index}`} className='w-full !mb-4'>
          <div className='flex items-center justify-between mb-4 gap-2'>
            <div className='flex items-center gap-2'>
              <Avatar
                icon={<UserOutlined />}
                src={isValidWebUrl(post.user?.avatarUrl) ? post.user?.avatarUrl : undefined}
                className='mr-2'
              />
              <div>
                <div className='font-bold text-[14px]'>{post.user?.username || 'Unknown User'}</div>
                <div className='text-gray-500 text-sm'>
                  <TimeAgoText date={post?.createdAt} />
                </div>
              </div>
            </div>
            <Dropdown
              placement='bottomRight'
              menu={{
                items: [
                  {
                    key: 'delete',
                    label: 'Delete',
                    danger: true,
                    onClick: () => handleDeletePost(post.id),
                  },
                ],
              }}
              trigger={['click']}
            >
              <Button type='text' icon={<MoreOutlined />} />
            </Dropdown>
          </div>

          <h3 className='text-lg font-semibold mb-2'>{post?.title}</h3>
          <p className='text-gray-700 mb-4'>{post?.body}</p>

          {post?.images && post.images.length > 0 && (
            <div
              className={`grid gap-2 mb-4 ${
                post.images.length === 1
                  ? 'grid-cols-1'
                  : post.images.length === 2
                    ? 'grid-cols-2'
                    : 'grid-cols-2 sm:grid-cols-3'
              }`}
            >
              {post.images.map((imgUrl: string, imgIndex: number) => (
                <Image
                  key={imgIndex}
                  src={imgUrl}
                  alt={`Post image ${imgIndex + 1}`}
                  preview={false}
                  className='w-full h-64 object-cover rounded'
                />
              ))}
            </div>
          )}
          <div className='flex justify-around items-center border-t border-gray-200 pt-4 mt-4'>
            <Button
              type='text'
              icon={
                post.isLikedByCurrentUser ? (
                  <HeartFilled style={{ color: 'red' }} />
                ) : (
                  <LikeOutlined />
                )
              }
            >
              {post.likesCount > 0 && <span className='mr-1'>{post.likesCount}</span>}
              {post.isLikedByCurrentUser ? 'Unlike' : 'Like'}
            </Button>
            <Button type='text' icon={<MessageOutlined />} onClick={() => handleCommentClick(post)}>
              Comment
            </Button>
          </div>
        </Card>
      ))}
      {selectedPost && (
        <PostCommentModal
          visible={isCommentModalVisible}
          onClose={handleCloseCommentModal}
          post={selectedPost}
        />
      )}
    </div>
  );
};

export default PostList;
