import React, { useEffect, useState } from 'react';
import { Avatar, List, Spin, Button, Alert } from 'antd';
import { UserOutlined, ReloadOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/shared/api';
import { APP_URL } from '@/shared/constants/apiConstants';

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

const UserList: React.FC<UserListProps> = ({ currentUserId }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const receiverUserIdFromParams = searchParams.get('user');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(
    receiverUserIdFromParams ? parseInt(receiverUserIdFromParams, 10) : null
  );

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<FollowRelationship[]>(`${APP_URL}/follow/followers`);
      const followerUsers = response.data.map(item => item.followingUser);
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
    fetchUsers();
  }, []);

  useEffect(() => {
    const userIdFromParams = searchParams.get('user');
    setSelectedUserId(userIdFromParams ? parseInt(userIdFromParams, 10) : null);
  }, [searchParams]);

  const handleUserClick = (userId: number) => {
    setSelectedUserId(userId);
    router.push(`/chat?user=${userId}`);
  };

  const handleRetry = () => {
    fetchUsers();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-64 bg-white border-r border-gray-200 h-full p-4">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          action={
            <Button 
              size="small" 
              type="primary" 
              icon={<ReloadOutlined />}
              onClick={handleRetry}
            >
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Chats</h2>
        <Button 
          type="text" 
          icon={<ReloadOutlined />} 
          onClick={handleRetry}
          title="Refresh list"
        />
      </div>
      {users.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No users found
        </div>
      ) : (
        <List
          dataSource={users}
          renderItem={(user) => (
            <List.Item
              className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                user.id === selectedUserId ? 'bg-gray-200' : ''
              }`}
              onClick={() => handleUserClick(user.id)}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={user.avatarUrl || undefined}
                    icon={<UserOutlined />}
                    className="bg-blue-500"
                  />
                }
                title={
                  <span className={
                    user.id === selectedUserId
                      ? 'text-gray-800 font-semibold' 
                      : 'text-gray-600' 
                  }>
                    {user.username}
                  </span>
                }
                description={user.email}
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default UserList; 