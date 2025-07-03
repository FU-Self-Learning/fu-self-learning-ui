'use client';

import React, { useState, useEffect } from 'react';
import { Spin, message } from 'antd';
import CreatePostModal from './menu/postSocial';
import PostList from './post/PostList';
import { usePosts } from '@/hooks/posts/usePosts';

const SocialFeed = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, isError, error } = usePosts();

  const posts = data || [];

  useEffect(() => {
    if (isError) {
      message.error('Failed to load posts: ' + error?.message);
    }
  }, [isError, error]);

  if (isLoading && !posts.length) {
    return (
      <div className='flex justify-center items-center h-64'>
        <Spin size='large' />
      </div>
    );
  }

  return (
    <>
      <PostList posts={posts} />
      <CreatePostModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default SocialFeed;
