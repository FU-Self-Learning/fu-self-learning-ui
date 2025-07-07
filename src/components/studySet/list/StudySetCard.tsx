import React from 'react';
import { Card, Tag, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { StudySet } from '@/types/studySetType';

interface Props {
  item: StudySet;
  onSelect: (id: number) => void;
  canEdit: boolean;
  renderActions?: (item: StudySet) => React.ReactNode;
}

const StudySetCard: React.FC<Props> = ({ item, onSelect, canEdit, renderActions }) => {
  return (
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

      <div className='flex justify-between items-end'>
        <div className='text-xs text-gray-400 mt-2'>
          {item.user?.username && (
            <>
              <UserOutlined /> {item.user.username}
            </>
          )}
          <div>Created: {item.createdAt && new Date(item.createdAt).toLocaleDateString()}</div>
        </div>

        {canEdit && renderActions && renderActions(item)}
      </div>
    </Card>
  );
};

export default StudySetCard;
