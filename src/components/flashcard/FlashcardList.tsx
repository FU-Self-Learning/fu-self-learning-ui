import React from 'react';
import { Card, List, Button, Popconfirm, Skeleton, Empty, Tag, Typography, Space } from 'antd';
import { EditOutlined, DeleteOutlined, RobotOutlined } from '@ant-design/icons';
import { useFlashcards } from '@/hooks/flashcard/useFlashcards';
import { useDeleteFlashcard } from '@/hooks/flashcard/useDeleteFlashcard';

interface FlashcardListProps {
  filter: {
    courseId?: number;
    topicId?: number;
    lessonId?: number;
  };
}

const FlashcardList: React.FC<FlashcardListProps> = ({ filter }) => {
  const { data, isLoading } = useFlashcards(filter);
  const { mutate: deleteFlashcard, isPending: isDeleting } = useDeleteFlashcard();

  const handleDelete = (id: number) => {
    deleteFlashcard(id);
  };

  if (isLoading) return <Skeleton active paragraph={{ rows: 6 }} />;
  if (!data || data.length === 0)
    return <Empty description='No flashcards found' className='my-12' />;

  return (
    <List
      grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
      dataSource={data}
      className='!mt-4'
      renderItem={(item: any) => (
        <List.Item>
          <Card
            title={<span className='truncate block max-w-[90%]'>{item.front_text}</span>}
            extra={
              item.is_auto_generated ? (
                <Tag icon={<RobotOutlined />} color='blue'>
                  AI
                </Tag>
              ) : (
                <Tag color='default'>Manual</Tag>
              )
            }
            className='h-full flex flex-col'
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <Typography.Paragraph className='mb-2 text-gray-700' ellipsis={{ rows: 3 }}>
              {item.back_text}
            </Typography.Paragraph>
            <Space className='mt-auto'>
              {item.generation_source && <Tag color='purple'>{item.generation_source}</Tag>}
              <Button icon={<EditOutlined />} size='small' disabled>
                Edit
              </Button>
              <Popconfirm
                title='Are you sure to delete this flashcard?'
                onConfirm={() => handleDelete(item.id)}
                okText='Yes'
                cancelText='No'
              >
                <Button icon={<DeleteOutlined />} size='small' danger loading={isDeleting} />
              </Popconfirm>
            </Space>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default FlashcardList;
