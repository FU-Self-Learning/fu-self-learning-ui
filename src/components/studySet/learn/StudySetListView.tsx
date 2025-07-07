import React from 'react';
import { List } from 'antd';

interface Props {
  flashcards: Array<{ id: number; front_text: string; back_text: string }>;
}

const StudySetListView: React.FC<Props> = ({ flashcards }) => {
  return (
    <div className='max-w-3xl mx-auto px-4 py-8'>
      <List
        grid={{ gutter: 16, column: 1 }}
        style={{
          backgroundColor: '#f0f2f5',
          padding: '16px',
          borderRadius: '12px',
        }}
        dataSource={flashcards}
        renderItem={(item) => (
          <List.Item>
            <div className='flex bg-white rounded-xl shadow border border-gray-200 overflow-hidden min-h-[64px]'>
              <div className='flex items-center px-6 py-4 w-1/4 border-r border-gray-100'>
                <span className='text-base text-gray-800'>{item.front_text}</span>
              </div>
              <div className='flex items-center px-6 py-4 w-3/4'>
                <span className='text-base text-gray-700'>{item.back_text}</span>
              </div>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default StudySetListView;
