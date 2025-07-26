import React, { useEffect, useState } from 'react';
import { Avatar, List, Spin, Button, Alert } from 'antd';
import { UserOutlined, ReloadOutlined, TeamOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getUserGroups } from '@/context/group/groupSlice';
import { RootState, AppDispatch } from '@/providers/store';

interface GroupListProps {
  currentUserId: number;
  onGroupSelect?: (group: any) => void;
}

const GroupList: React.FC<GroupListProps> = ({ currentUserId, onGroupSelect }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { groups, loading, error } = useSelector((state: RootState) => state.group);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(getUserGroups());
  }, [dispatch]);

  const handleGroupClick = (group: any) => {
    setSelectedGroupId(group.id);
    router.push(`/chat?group=${group.id}`);
    if (onGroupSelect) onGroupSelect(group);
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
    <div className='w-72 bg-white h-full overflow-y-auto shadow-lg p-2'>
      <div className='p-4 border-b border-blue-200 flex justify-between items-center bg-blue-50 rounded-t-xl'>
        <h2 className='text-lg font-bold text-blue-700'>Group Chats</h2>
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
        <div
          className={groups.length > 9 ? 'flex-1 overflow-y-auto' : ''}
          style={groups.length > 9 ? { maxHeight: 9 * 68 + 16, minHeight: 0 } : {}}
        >
          <List
            dataSource={groups}
            renderItem={(group) => (
              <List.Item
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 cursor-pointer border border-transparent transition-all duration-150
                  ${group.id === selectedGroupId ? 'bg-blue-100 border-blue-400 font-bold text-blue-700' : 'hover:bg-blue-50 hover:border-blue-300'}
                `}
                onClick={() => handleGroupClick(group)}
              >
                <Avatar
                  src={group.avatarUrl || undefined}
                  icon={!group.avatarUrl ? <TeamOutlined /> : undefined}
                  className='bg-gray-200 text-2xl text-gray-400 shadow-sm'
                  size={44}
                />
                <div className='flex-1'>
                  <div className='text-base'>{group.name}</div>
                </div>
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default GroupList;
