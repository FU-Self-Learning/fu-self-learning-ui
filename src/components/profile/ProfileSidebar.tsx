"use client";

import { Menu } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

interface ProfileSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ProfileSidebar = ({ activeTab, setActiveTab }: ProfileSidebarProps) => {
  const router = useRouter();

  const menuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile Information",
      onClick: () => setActiveTab("profile"),
    },
    {
      key: "password",
      icon: <LockOutlined />,
      label: "Change Password",
      onClick: () => setActiveTab("password"),
    },
    {
      key: "instructorRequest",
      icon: <UserOutlined />,
      label: "Become an Instructor",
      onClick: () => setActiveTab("instructorRequest"),
    },
  ];

  return (
    <div className="w-64 bg-white rounded-2xl shadow-md p-4">
      <Menu
        mode="inline"
        items={menuItems}
        className="border-none"
        defaultSelectedKeys={["profile"]}
      />
    </div>
  );
};

export default ProfileSidebar; 