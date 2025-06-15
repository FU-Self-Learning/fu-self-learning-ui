"use client";

import React, { useState } from "react";
import { Spin, message } from "antd";
import CreatePostModal from "./menu/postSocial";
import PostList from "./post/PostList";
import { usePosts } from "@/hooks/posts/usePosts";
import { useQueryClient } from "@tanstack/react-query";

const SocialFeed = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const { data, isLoading, isError, error } = usePosts();

    const posts = data?.pages?.flatMap(page => page) || [];

    const handlePostCreated = () => {
        console.log("handlePostCreated called, invalidating posts query.");
        setIsModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ["posts"] });
    };

    if (isError) {
        message.error("Failed to load posts: " + error?.message);
    }

    if (isLoading && !posts.length) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <>
            <PostList posts={posts} />

            <CreatePostModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onPostCreated={handlePostCreated}
            />
        </>
    );
};

export default SocialFeed; 