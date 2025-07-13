import React, { useEffect, useState } from 'react';
import { Avatar, List, Spin, Button, Alert } from 'antd';
import { UserOutlined, ReloadOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/shared/api';
import { APP_URL } from '@/shared/constants/apiConstants';
import { useHasMounted } from '@/hooks/useHasMounted';
import { isValidWebUrl } from '@/utils/urlValidation';

interface User {
  id: number;
  username: string;
  email: string;
  avatarUrl: string | null;
}

interface FollowRelationship {
  id: number;
  createdAt: string;
  updatedAt: string;
  followingUser: User;
}

interface UserListProps {
  currentUserId: number;
}

const UserList: React.FC<UserListProps> = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasMounted = useHasMounted();
  const receiverUserIdFromParams = searchParams.get('user');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(
    receiverUserIdFromParams ? parseInt(receiverUserIdFromParams, 10) : null,
  );

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<FollowRelationship[]>(`${APP_URL}/follow/followers`);
      const followerUsers = response.data.map((item) => item.followingUser);
      setUsers(followerUsers);
      console.log('Fetched users data:', response.data);
      console.log('Mapped users:', followerUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error instanceof Error ? error.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasMounted) {
      fetchUsers();
    }
  }, [hasMounted]);

  useEffect(() => {
    if (hasMounted) {
      const userIdFromParams = searchParams.get('user');
      setSelectedUserId(userIdFromParams ? parseInt(userIdFromParams, 10) : null);
    }
  }, [searchParams, hasMounted]);

  const handleUserClick = (userId: number) => {
    setSelectedUserId(userId);
    router.push(`/chat?user=${userId}`);
  };

  const handleRetry = () => {
    fetchUsers();
  };

  if (!hasMounted) {
    return (
      <div className='w-64 bg-white/90 backdrop-blur-sm border-r border-gray-200 h-full shadow-lg'>
        <div className='flex items-center justify-center h-full'>
          <Spin size='large' />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='w-64 bg-white/90 backdrop-blur-sm border-r border-gray-200 h-full shadow-lg'>
        <div className='flex items-center justify-center h-full'>
          <Spin size='large' />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='w-64 bg-white/90 backdrop-blur-sm border-r border-gray-200 h-full shadow-lg p-4'>
        <Alert
          message='Error'
          description={error}
          type='error'
          showIcon
          className='rounded-lg shadow-sm'
          action={
            <Button size='small' type='primary' icon={<ReloadOutlined />} onClick={handleRetry} className='rounded-lg'>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className='w-64 bg-white/90 backdrop-blur-sm border-r border-gray-200 h-full overflow-y-auto shadow-lg'>
      <div className='p-4 border-b border-gray-200/70 flex justify-between items-center bg-gradient-to-r from-white to-slate-50'>
        <h2 className='text-lg font-semibold text-gray-800'>Chats</h2>
        <Button 
          type='text' 
          icon={<ReloadOutlined />} 
          onClick={handleRetry} 
          title='Refresh list'
          className='hover:bg-gray-100 rounded-full'
        />
      </div>
      {users.length === 0 ? (
        <div className='p-6 text-center text-gray-500'>
          <div className='w-12 h-12 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center'>
            <UserOutlined className='text-gray-400' />
          </div>
          <p className='font-medium'>No users found</p>
        </div>
      ) : (
        <List
          dataSource={users}
          renderItem={(user) => (
            <List.Item
              className={`px-4 py-3 hover:bg-blue-50/70 cursor-pointer transition-all duration-200 border-none ${
                user.id === selectedUserId ? 'bg-blue-100/80 border-r-4 border-blue-500' : ''
              }`}
              onClick={() => handleUserClick(user.id)}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={isValidWebUrl(user.avatarUrl) ? user.avatarUrl : undefined}
                    icon={<UserOutlined />}
                    className='bg-gradient-to-r from-blue-500 to-blue-600 shadow-md'
                    size={40}
                  />
                }
                title={
                  <span
                    className={`font-medium transition-colors ${
                      user.id === selectedUserId ? 'text-blue-700' : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    {user.username}
                  </span>
                }
                description={
                  <span className='text-sm text-gray-500 truncate'>
                    {user.email}
                  </span>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default UserList;
