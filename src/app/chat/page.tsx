'use client';

import { useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import { RootState } from '@/providers/store';
import ChatBox from '@/app/chat/ChatBox';
import UserList from '@/components/chat/UserList';
import GroupList from '@/components/chat/GroupList';
import { Suspense } from 'react';
import { Spin } from 'antd';
import { useHasMounted } from '@/hooks/useHasMounted';
import { useState } from 'react';
import type { User } from '@/components/chat/UserList';
import { Button } from 'antd';
import { MessageOutlined, TeamOutlined } from '@ant-design/icons';

function ChatPageComponent() {
  const searchParams = useSearchParams();
  const userParam = searchParams.get('user');
  const groupParam = searchParams.get('group');
  const receiverUserId = userParam ? parseInt(userParam, 10) : null;
  const receiverGroupId = groupParam ? parseInt(groupParam, 10) : null;
  const hasMounted = useHasMounted();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'chats' | 'groups'>('chats');

  if (!hasMounted || !currentUser) {
    return (
      <div className='flex h-[calc(100vh-6rem)] bg-gradient-to-br from-slate-50 to-blue-50'>
        <div className='w-64 bg-white/90 backdrop-blur-sm border-r border-gray-200 h-full shadow-lg'>
          <div className='flex items-center justify-center h-full'>
            <Spin size='large' />
          </div>
        </div>
        <div className='flex-1 p-4'>
          <div className='flex items-center justify-center h-full text-gray-500'>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex h-[calc(100vh-6rem)] bg-gradient-to-br from-slate-50 to-blue-50'>
      <div className='flex flex-col w-72 bg-white border-r border-gray-200 h-full shadow-lg'>
        <div className='flex gap-3 p-4 border-b bg-blue-50 justify-center'>
          <Button
            type={activeTab === 'chats' ? 'primary' : 'default'}
            shape='round'
            icon={<MessageOutlined style={{ fontSize: 20 }} />}
            size='large'
            className={`flex items-center font-bold text-base px-6 py-2 transition-all duration-150 ${activeTab === 'chats' ? 'bg-white text-blue-700 shadow' : 'text-gray-500 hover:text-blue-700'}`}
            onClick={() => setActiveTab('chats')}
          >
            Chats
          </Button>
          <Button
            type={activeTab === 'groups' ? 'primary' : 'default'}
            shape='round'
            icon={<TeamOutlined style={{ fontSize: 20 }} />}
            size='large'
            className={`flex items-center font-bold text-base px-6 py-2 transition-all duration-150 ${activeTab === 'groups' ? 'bg-white text-blue-700 shadow' : 'text-gray-500 hover:text-blue-700'}`}
            onClick={() => setActiveTab('groups')}
          >
            Group Chats
          </Button>
        </div>
        {activeTab === 'chats' ? (
          <UserList currentUserId={Number(currentUser.id)} onUserSelect={setSelectedUser} selectedUserId={selectedUser?.id} />
        ) : (
          <GroupList currentUserId={Number(currentUser.id)} onGroupSelect={setSelectedGroup} />
        )}
      </div>
      <div className='flex-1 h-full flex flex-col bg-white shadow-xl'>
        {activeTab === 'chats' && selectedUser ? (
          <ChatBox senderUserId={Number(currentUser.id)} receiverUserId={selectedUser.id} receiverUser={selectedUser} />
        ) : activeTab === 'groups' && receiverGroupId && selectedGroup ? (
          <ChatBox senderUserId={Number(currentUser.id)} receiverGroupId={receiverGroupId} receiverGroup={selectedGroup} />
        ) : (
          <div className='flex items-center justify-center h-full w-full'>
            <div className='text-center p-8 bg-white rounded-2xl shadow-lg'>
              <div className='w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-md'>
                <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
                </svg>
              </div>
              <h3 className='text-xl font-semibold text-gray-700 mb-2'>Select a user or group to start chatting</h3>
              <p className='text-gray-500'>Choose someone or a group from your contact list to begin a conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<Spin />}>
      <ChatPageComponent />
    </Suspense>
  );
}
