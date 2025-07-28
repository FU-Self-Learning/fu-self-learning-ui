'use client';

import { Menu } from 'antd';
import { UserOutlined, LockOutlined, TrophyOutlined } from '@ant-design/icons';

interface ProfileSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ProfileSidebar = ({ activeTab, setActiveTab }: ProfileSidebarProps) => {
  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile Information',
      onClick: () => setActiveTab('profile'),
    },
    {
      key: 'certificates',
      icon: <TrophyOutlined />,
      label: 'My Certificates',
      onClick: () => setActiveTab('certificates'),
    },
    {
      key: 'password',
      icon: <LockOutlined />,
      label: 'Change Password',
      onClick: () => setActiveTab('password'),
    },
    {
      key: 'instructorRequest',
      icon: <UserOutlined />,
      label: 'Become an Instructor',
      onClick: () => setActiveTab('instructorRequest'),
    },
  ];

  return (
    <div className='w-64 bg-white rounded-2xl shadow-md p-4'>
      <Menu
        mode='inline'
        items={menuItems}
        className='border-none'
        defaultSelectedKeys={[activeTab]}
      />
    </div>
  );
};

export default ProfileSidebar;
