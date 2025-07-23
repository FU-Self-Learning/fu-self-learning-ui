import React, { useEffect, useState } from 'react';
import { Avatar, List, Spin, Button, Alert } from 'antd';
import { UserOutlined, ReloadOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/shared/api';
import { APP_URL } from '@/shared/constants/apiConstants';
import { useHasMounted } from '@/hooks/useHasMounted';
import { isValidWebUrl } from '@/utils/urlValidation';
import { useProfile } from '@/hooks/auth/useProfile';

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
  onUserSelect?: (user: User) => void;
  selectedUserId?: number | null;
  onUserList?: (users: User[]) => void;
}

const UserList: React.FC<UserListProps> = ({ currentUserId, onUserSelect, selectedUserId, onUserList }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasMounted = useHasMounted();
  const receiverUserIdFromParams = searchParams.get('user');
  const [selectedUserIdState, setSelectedUserIdState] = useState<number | null>(
    receiverUserIdFromParams ? parseInt(receiverUserIdFromParams, 10) : null,
  );
  const { data } = useProfile();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<FollowRelationship[]>(`${APP_URL}/follow/followers`);
      const followerUsers = response.data.map((item) => item.followingUser);
      setUsers(followerUsers);
      if (onUserList) onUserList(followerUsers);
    } catch (error) {
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
      setSelectedUserIdState(userIdFromParams ? parseInt(userIdFromParams, 10) : null);
    }
  }, [searchParams, hasMounted]);

  const handleUserClick = (userId: number) => {
    setSelectedUserIdState(userId);
    router.push(`/chat?user=${userId}`);
    const user = users.find(u => u.id === userId);
    if (onUserSelect && user) onUserSelect(user);
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
            <Button
              size='small'
              type='primary'
              icon={<ReloadOutlined />}
              onClick={handleRetry}
              className='rounded-lg'
            >
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className='w-90 bg-[#E5E7EB] border-r border-blue-200 h-full overflow-y-auto shadow-sm'>
      <div className='flex items-center justify-between bg-white rounded-xl shadow p-4 m-4 mb-2'>
        <div className='flex items-center gap-3'>
          <img
            src={data?.avatarUrl}
            alt='User Avatar'
            className='w-14 h-14 rounded-full object-cover border-2 border-blue-200'
          />
          <div>
            <div className='font-bold text-base text-blue-700 leading-tight'>{data?.username}</div>
            <div className='text-sm text-gray-500'>{data?.email}</div>
          </div>
        </div>
        <button className='p-2 rounded-full hover:bg-gray-100 transition' title='Edit profile'>
          <svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
            <path strokeLinecap='round' strokeLinejoin='round' d='M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4 1a1 1 0 01-1.213-1.213l1-4a4 4 0 01.828-1.414z' />
          </svg>
        </button>
      </div>

      <div className='p-4 border-b border-blue-200 flex justify-between items-center bg-blue-50'>
        <h2 className='text-lg font-bold text-blue-700'>Chats</h2>
        <Button type='text' icon={<ReloadOutlined />} onClick={handleRetry} title='Refresh list' />
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
              className={`ml-2 px-4 py-3 rounded-lg my-1 cursor-pointer transition-colors flex items-center gap-2 border border-transparent hover:bg-blue-50 hover:border-blue-200 ${user.id === selectedUserIdState ? 'bg-blue-100 border-blue-400' : ''}`}
              onClick={() => handleUserClick(user.id)}
            >
              <List.Item.Meta
                className='ml-2'
                avatar={
                  <div className='relative'>
                    <Avatar
                      src={user.avatarUrl || undefined}
                      icon={<UserOutlined />}
                      className='bg-blue-500 border-2 border-white shadow'
                      size={44}
                    />
                    <span className='absolute bottom-0 right-0 block w-3 h-3 bg-green-400 border-2 border-white rounded-full'></span>
                  </div>
                }
                title={
                  <span
                    className={
                      user.id === selectedUserIdState
                        ? 'text-blue-700 font-bold'
                        : 'text-gray-700 font-medium'
                    }
                  >
                    {user.username}
                  </span>
                }
                description={<span className='text-xs text-gray-400'>{user.email}</span>}
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default UserList;
