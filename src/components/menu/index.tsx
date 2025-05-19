"use client";

import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import {
    HomeOutlined,
    BellOutlined,
    FolderOpenOutlined,
    SearchOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useRouter } from "next/navigation";
import CreatePostModal from "@/components/menu/postSocial";
import SearchSocialPage from "./searchSocial";

type MenuItem = Required<MenuProps>["items"][number];

const menuItems: MenuItem[] = [
    {
        key: "home",
        icon: <HomeOutlined style={{ fontSize: 20 }} />,
        label: "Home",
    },
    {
        key: "library",
        icon: <FolderOpenOutlined style={{ fontSize: 20 }} />,
        label: "Your library",
    },
    {
        key: "search",
        icon: <SearchOutlined style={{ fontSize: 20, }} />,
        label: "Search",
    },
    {
        key: "notification",
        icon: <BellOutlined style={{ fontSize: 20 }} />,
        label: "Notification",
    },
    {
        key: "new-post",
        icon: <PlusOutlined style={{ fontSize: 20 }} />,
        label: "Post Something",
    },
];

const MenuPage = () => {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
        switch (key) {
            case "new-post":
                setIsModalOpen(true);
                setShowSearch(false);
                setIsCollapsed(false);
                break;
            case "search":
                setShowSearch((prev) => {
                    setIsCollapsed(!prev);
                    return !prev;
                });
                break;
            default:
                router.push(`/${key}`);
                setShowSearch(false);
                setIsCollapsed(false);
        }
    };

    const handleCloseSearch = () => {
        setShowSearch(false);
        setIsCollapsed(false);
    };

    return (
        <div className="relative h-screen flex">
            <div
                className={`hover:text-white z-20 text-white transition-all duration-300 ${isCollapsed ? "w-[80px]" : "w-[350px]"}`}
            >
                <Menu
                    onClick={handleMenuClick}
                    mode="inline"
                    defaultSelectedKeys={["home"]}
                    items={menuItems}
                    style={{ backgroundColor: "transparent", color: "white" }}
                    className={`flex flex-col items-center justify-center text-center custom-menu border-none bg-transparent cursor-pointer border-l border-white border-opacity-40 ${!showSearch ? "!flex !text-amber-300" : "!flex !text-amber-300"}`}
                    inlineCollapsed={isCollapsed}
                />
                <CreatePostModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </div>
            {showSearch && <SearchSocialPage handleCloseSearch={handleCloseSearch} />}
        </div >
    );
};

export default MenuPage;
