"use client"

import React from "react";
import { Avatar, Button } from "antd";

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
        <div className="bg-black text-white p-4 max-w-sm w-full z-40">
            <div className="flex justify-between mb-4 cursor-pointer">
                <h2 className="font-semibold text-lg">Followers</h2>
                <button className="text-blue-400 text-sm cursor-pointer">View all</button>
            </div>
            {suggestions.map((item, index) => (
                <div key={index} className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3 ">
                        <Avatar src={item.avatarUrl} size={40} className="cursor-pointer" />
                        <div className="text-sm">
                            <div className="font-semibold cursor-pointer">{item.username}</div>
                            <div className="text-gray-400 cursor-pointer">{item.email}</div>
                        </div>
                    </div>
                    <Button type="link" className="text-blue-400 p-0 h-auto cursor-pointer">
                        View more
                    </Button>
                </div>
            ))}
        </div>
    );
};

export default ListFollowingPage;
