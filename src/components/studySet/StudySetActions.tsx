import React from 'react';
import { Button, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, ThunderboltOutlined } from '@ant-design/icons';

interface StudySetActionsProps {
  item: any;
  onEdit: (id: number) => void;
  onGenerate: (id: number) => void;
  onDelete: (id: number) => void;
}

const StudySetActions: React.FC<StudySetActionsProps> = ({
  item,
  onEdit,
  onGenerate,
  onDelete,
}) => (
  <Space>
    <Button
      icon={<EditOutlined />}
      size='small'
      onClick={(e) => {
        e.stopPropagation();
        onEdit(item.id);
      }}
    />
    <Button
      icon={<ThunderboltOutlined />}
      size='small'
      onClick={(e) => {
        e.stopPropagation();
        onGenerate(item.id);
      }}
    />
    <Popconfirm
      title='Are you sure to delete this study set?'
      onConfirm={(e) => {
        e?.stopPropagation();
        onDelete(item.id);
      }}
      okText='Yes'
      cancelText='No'
    >
      <Button icon={<DeleteOutlined />} size='small' danger onClick={(e) => e.stopPropagation()} />
    </Popconfirm>
  </Space>
);

export default StudySetActions;
