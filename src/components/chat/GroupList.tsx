import React, { useEffect, useState } from 'react';
import { Avatar, List, Spin, Button, Alert } from 'antd';
import { UserOutlined, ReloadOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getUserGroups } from '@/context/group/groupSlice';
import { RootState, AppDispatch } from '@/providers/store';

interface GroupListProps {
  currentUserId: number;
}

const GroupList: React.FC<GroupListProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { groups, loading, error } = useSelector((state: RootState) => state.group);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(getUserGroups());
  }, [dispatch]);

  const handleGroupClick = (groupId: number) => {
    setSelectedGroupId(groupId);
    router.push(`/chat?group=${groupId}`);
  };

  const handleRetry = () => {
    dispatch(getUserGroups());
  };

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
        <h2 className='text-lg font-semibold text-gray-800'>Group Chats</h2>
        <Button
          type='text'
          icon={<ReloadOutlined />}
          onClick={handleRetry}
          title='Refresh list'
          className='hover:bg-gray-100 rounded-full'
        />
      </div>
      {groups.length === 0 ? (
        <div className='p-6 text-center text-gray-500'>
          <div className='w-12 h-12 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center'>
            <UserOutlined className='text-gray-400' />
          </div>
          <p className='font-medium'>No groups found</p>
        </div>
      ) : (
        <List
          dataSource={groups}
          renderItem={(group) => (
            <List.Item
              className={`px-4 py-3 hover:bg-blue-50/70 cursor-pointer transition-all duration-200 border-none ${
                group.id === selectedGroupId ? 'bg-blue-100/80 border-r-4 border-blue-500' : ''
              }`}
              onClick={() => handleGroupClick(group.id)}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={group.avatarUrl}
                    icon={<UserOutlined />}
                    className='bg-gradient-to-r from-purple-500 to-blue-600 shadow-md'
                    size={40}
                  />
                }
                title={
                  <span
                    className={`font-medium transition-colors ${
                      group.id === selectedGroupId ? 'text-blue-700' : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    {group.name}
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

export default GroupList;
