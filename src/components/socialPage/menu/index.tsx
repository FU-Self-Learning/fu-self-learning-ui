'use client';

import React, { useState, useEffect } from 'react';
import { Menu, Button, Avatar } from 'antd';
import {
  HomeOutlined,
  BellOutlined,
  FolderOpenOutlined,
  SearchOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useRouter } from 'next/navigation';
import CreatePostModal from '@/components/socialPage/menu/postSocial';
import SearchSocialPage from './searchSocial';
import { useProfile } from '@/hooks/auth/useProfile';
import './menu-social.css';

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  {
    key: 'home',
    icon: <HomeOutlined style={{ fontSize: 20, color: '#1890ff' }} />,
    label: 'Home',
  },
  {
    key: 'library',
    icon: <FolderOpenOutlined style={{ fontSize: 20, color: '#1890ff' }} />,
    label: 'Your library',
  },
  {
    key: 'search',
    icon: <SearchOutlined style={{ fontSize: 20, color: '#1890ff' }} />,
    label: 'Search',
  },
  {
    key: 'notification',
    icon: <BellOutlined style={{ fontSize: 20, color: '#1890ff' }} />,
    label: 'Notification',
  },
];

const MenuPage = () => {
  const { data } = useProfile();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'new-post':
        setIsModalOpen(true);
        setShowSearch(false);
        setIsCollapsed(false);
        break;
      case 'search':
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
    <div className='relative social_page'>
      <div
        className={`bg-white rounded-2xl shadow-lg transition-all duration-300 ${
          isCollapsed ? 'w-[80px]' : 'w-[280px]'
        }`}
      >
        <div className='p-4 border-b border-gray-100'>
          <div className='flex items-center gap-3'>
            <Avatar
              size={48}
              src={data?.avatarUrl}
              icon={<UserOutlined />}
              className='!bg-blue-100 !text-blue-600 cursor-pointer hover:!bg-blue-200 transition-colors'
            />
            {!isCollapsed && (
              <div className='flex-1'>
                <div className='text-gray-800 font-medium hover:text-blue-600 transition-colors cursor-pointer'>
                  {data?.username}
                </div>
              </div>
            )}
          </div>
        </div>
        <Menu
          onClick={handleMenuClick}
          mode='inline'
          defaultSelectedKeys={['home']}
          items={menuItems}
          className='custom-menu'
          inlineCollapsed={isCollapsed}
        />
        {!isCollapsed && (
          <div className='p-4 border-t border-gray-100'>
            <Button
              type='primary'
              icon={<PlusOutlined />}
              block
              onClick={() => setIsModalOpen(true)}
              className='!bg-blue-500 hover:!bg-blue-600 !text-white !font-medium !rounded-xl !h-10 !shadow-md hover:!shadow-lg !transition-all'
            >
              Create Post
            </Button>
          </div>
        )}

        <CreatePostModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
      {showSearch && (
        <>
          <div className='fixed inset-0 bg-black/50 z-40' onClick={handleCloseSearch} />
          <div className='absolute top-0 left-full ml-4 z-50'>
            <SearchSocialPage handleCloseSearch={handleCloseSearch} />
          </div>
        </>
      )}
    </div>
  );
};

export default MenuPage;
