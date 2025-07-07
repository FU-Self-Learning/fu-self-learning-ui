import React from 'react';
import { Card, Tag, Typography, Button, Space } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useStudySet } from '@/hooks/study-set/useStudySet';

interface StudySetDetailProps {
  id: number;
  onLearn: (flashcards: any[]) => void;
  userId?: number;
  onExit: () => void;
}

const StudySetDetail: React.FC<StudySetDetailProps> = ({ id, onLearn, userId, onExit }) => {
  const { data, isLoading } = useStudySet(id);

  if (isLoading || !data) return null;

  return (
    <div>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={onExit}
        className='mb-4'
        type='text'
        size='large'
      />
      <Card className='max-w-2xl mx-auto mt-8'>
        <div className='flex items-center gap-2 mb-2'>
          <span className='text-lg font-semibold'>{data.name}</span>
          {data.isPublic ? (
            <Tag color='blue'>Public</Tag>
          ) : (
            <Tag icon={<LockOutlined />} color='default'>
              Private
            </Tag>
          )}
          <Space wrap>
            {data.tags?.map((tag: string) => (
              <Tag key={tag} color='purple'>
                {tag}
              </Tag>
            ))}
          </Space>
        </div>
        <Typography.Paragraph className='mb-2 text-gray-700' ellipsis={{ rows: 3 }}>
          {data.description}
        </Typography.Paragraph>
        <div className='text-xs text-gray-400 mb-2'>
          {data.user?.name && (
            <>
              <UserOutlined /> {data.user.name}
            </>
          )}
          <div>Created: {data.createdAt && new Date(data.createdAt).toLocaleDateString()}</div>
        </div>
        <div className='mb-4'>
          <span className='font-semibold'>Flashcards:</span>
          <ul className='list-disc ml-6'>
            {data.flashcards?.slice(0, 3).map((fc: any) => (
              <li key={fc.id}>{fc.front_text}</li>
            ))}
            {data.flashcards && data.flashcards.length > 3 && (
              <li className='text-gray-400 list-none'>
                ... và {data.flashcards.length - 3} thẻ khác
              </li>
            )}
          </ul>
        </div>
        <div className='flex gap-2'>
          <Button type='primary' onClick={() => onLearn(data.flashcards)}>
            Learn
          </Button>
          {userId === data.user?.id && <Button disabled>Edit</Button>}
        </div>
      </Card>
    </div>
  );
};

export default StudySetDetail;
