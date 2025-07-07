import React from 'react';
import { Card, List, Button, Tag, Typography, Space, Popconfirm, Empty, Skeleton } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { useStudySets } from '@/hooks/study-set/useStudySets';
import { useDeleteStudySet } from '@/hooks/study-set/useDeleteStudySet';

interface StudySetListProps {
  onSelect: (id: number) => void;
  filter?: any;
  userId?: number;
}

const StudySetList: React.FC<StudySetListProps> = ({ onSelect, filter, userId }) => {
  const { data, isLoading } = useStudySets(filter);
  const { mutate: deleteStudySet, isPending: isDeleting } = useDeleteStudySet();

  const handleDelete = (id: number) => {
    deleteStudySet(id);
  };

  if (isLoading) return <Skeleton active paragraph={{ rows: 6 }} />;
  if (!data || data.length === 0)
    return <Empty description='No study sets found' className='my-12' />;

  return (
    <List
      grid={{
        gutter: 24,
        xs: 1,
        sm: 1,
        md: 2,
        lg: 2,
        xl: 2,
        xxl: 1,
      }}
      dataSource={data}
      renderItem={(item: any) => (
        <List.Item>
          <Card
            hoverable
            title={<span className='truncate block max-w-[90%]'>{item.name}</span>}
            onClick={() => onSelect(item.id)}
            className='h-full flex flex-col cursor-pointer'
            extra={
              item.isPublic ? (
                <Tag color='blue'>Public</Tag>
              ) : (
                <Tag icon={<LockOutlined />} color='default'>
                  Private
                </Tag>
              )
            }
          >
            <Typography.Paragraph className='mb-2 text-gray-700' ellipsis={{ rows: 2 }}>
              {item.description}
            </Typography.Paragraph>
            <Space wrap>
              {item.tags?.map((tag: string) => (
                <Tag key={tag} color='purple'>
                  {tag}
                </Tag>
              ))}
            </Space>
            <div className='flex justify-between items-end mt-4'>
              <div className='text-xs text-gray-400'>
                {item.user?.name && (
                  <>
                    <UserOutlined /> {item.user.name}
                  </>
                )}
                <div>
                  Created: {item.createdAt && new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
              {userId === item.user?.id && (
                <Space>
                  <Button icon={<EditOutlined />} size='small' disabled>
                    Edit
                  </Button>
                  <Popconfirm
                    title='Are you sure to delete this study set?'
                    onConfirm={() => handleDelete(item.id)}
                    okText='Yes'
                    cancelText='No'
                  >
                    <Button icon={<DeleteOutlined />} size='small' danger loading={isDeleting} />
                  </Popconfirm>
                </Space>
              )}
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default StudySetList;
