
'use client';

import React from 'react';

import { useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import { RootState } from '@/providers/store';
import ChatBox from '@/app/chat/ChatBox';
import UserList from '@/components/chat/UserList';
import GroupList from '@/components/chat/GroupList';
import { Suspense } from 'react';
import { Spin } from 'antd';
import { useHasMounted } from '@/hooks/useHasMounted';


function ChatPageComponent() {
  const searchParams = useSearchParams();
  const userParam = searchParams.get('user');
  const groupParam = searchParams.get('group');
  const receiverUserId = userParam ? parseInt(userParam, 10) : null;
  const receiverGroupId = groupParam ? parseInt(groupParam, 10) : null;
  const hasMounted = useHasMounted();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [listType, setListType] = React.useState<'user' | 'group'>('user');

  if (!hasMounted || !currentUser) {
    return (
      <div className='flex h-[calc(100vh-6rem)] bg-gradient-to-br from-slate-50 to-blue-50'>
        <div className='w-64 bg-white/90 backdrop-blur-sm border-r border-gray-200 h-full shadow-lg'>
          <div className='flex items-center justify-center h-full'>
            <Spin size='large' />
          </div>
        </div>
        <div className='flex-1 p-4'>
          <div className='flex items-center justify-center h-full text-gray-500'>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex h-[calc(100vh-6rem)] bg-gradient-to-br from-slate-50 to-blue-50'>
      <div className='flex flex-col w-64 bg-white/90 backdrop-blur-sm border-r border-gray-200 h-full shadow-lg'>
        <div className='flex'>
          <button
            className={`flex-1 py-2 font-semibold rounded-tl-2xl ${listType === 'user' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-500'}`}
            onClick={() => setListType('user')}
          >
            User List
          </button>
          <button
            className={`flex-1 py-2 font-semibold rounded-tr-2xl ${listType === 'group' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-500'}`}
            onClick={() => setListType('group')}
          >
            Group List
          </button>
        </div>
        <div className='flex-1 overflow-y-auto'>
          {listType === 'user' ? (
            <UserList currentUserId={Number(currentUser.id)} />
          ) : (
            <GroupList currentUserId={Number(currentUser.id)} />
          )}
        </div>
      </div>
      <div className='flex-1 p-4'>
        {receiverUserId ? (
          <ChatBox senderUserId={Number(currentUser.id)} receiverUserId={receiverUserId} />
        ) : receiverGroupId ? (
          <ChatBox senderUserId={Number(currentUser.id)} receiverGroupId={receiverGroupId} />
        ) : (
          <div className='flex items-center justify-center h-full'>
            <div className='text-center p-8 bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20'>
              <div className='w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-md'>
                <svg
                  className='w-8 h-8 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-semibold text-gray-700 mb-2'>
                Select a user to start chatting
              </h3>
              <p className='text-gray-500'>
                Choose someone from your contact list to begin a conversation
              </p>
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
