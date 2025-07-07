import React from 'react';
import { Card, Tag, Typography, Skeleton, Empty } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import { useFlashcard } from '@/hooks/flashcard/useFlashcard';

interface FlashcardDetailProps {
  id: number;
}

const FlashcardDetail: React.FC<FlashcardDetailProps> = ({ id }) => {
  const { data, isLoading, error } = useFlashcard(id);

  if (isLoading) return <Skeleton active paragraph={{ rows: 4 }} />;
  if (error || !data) return <Empty description='Flashcard not found' />;

  return (
    <Card
      title={<span className='truncate block max-w-[90%]'>{data.front_text}</span>}
      extra={
        data.is_auto_generated ? (
          <Tag icon={<RobotOutlined />} color='blue'>
            AI
          </Tag>
        ) : (
          <Tag color='default'>Manual</Tag>
        )
      }
      className='max-w-lg mx-auto mt-8'
    >
      <Typography.Paragraph className='mb-2 text-gray-700' ellipsis={{ rows: 6 }}>
        {data.back_text}
      </Typography.Paragraph>
      {data.generation_source && <Tag color='purple'>{data.generation_source}</Tag>}
      <div className='text-xs text-gray-400 mt-2'>Created at: {data.created_at}</div>
    </Card>
  );
};

export default FlashcardDetail;
