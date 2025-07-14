import React from 'react';
import { Button, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, ThunderboltOutlined, PlusOutlined } from '@ant-design/icons';

interface StudySetActionsProps {
  item: any;
  onEdit: (id: number) => void;
  onGenerate: (id: number) => void;
  onDelete: (id: number) => void;
  onAddFlashcards?: (id: number) => void;
}

const StudySetActions: React.FC<StudySetActionsProps> = ({
  item,
  onEdit,
  onGenerate,
  onDelete,
  onAddFlashcards,
}) => (
  <Space>
    <Button
      icon={<EditOutlined />}
      size='small'
      onClick={(e) => {
        e.stopPropagation();
        onEdit(item.id);
      }}
      title='Edit study set'
    />
    {onAddFlashcards && (
      <Button
        icon={<PlusOutlined />}
        size='small'
        type='primary'
        onClick={(e) => {
          e.stopPropagation();
          onAddFlashcards(item.id);
        }}
        title='Add flashcards'
      />
    )}
    <Button
      icon={<ThunderboltOutlined />}
      size='small'
      onClick={(e) => {
        e.stopPropagation();
        onGenerate(item.id);
      }}
      title='Generate flashcards'
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
      <Button
        icon={<DeleteOutlined />}
        size='small'
        danger
        onClick={(e) => e.stopPropagation()}
        title='Delete study set'
      />
    </Popconfirm>
  </Space>
);

export default StudySetActions;
