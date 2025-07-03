"use client";

import { Button, List, Space, Typography } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

interface Lesson {
  id?: string;
  title: string;
  description: string;
  videoFile?: File;
  videoUrl?: string;
}

interface LessonListProps {
  lessons: Lesson[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  isAdding: boolean;
}

export const LessonList = ({ lessons, onEdit, onDelete, isAdding }: LessonListProps) => {
  if (lessons.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No lessons added yet. Click &quot;Add Lesson&quot; to get started.
      </div>
    );
  }

  return (
    <List
      size="small"
      dataSource={lessons}
      renderItem={(lesson, index) => (
        <List.Item
          className="hover:bg-gray-50 transition-colors duration-200 rounded-lg"
          actions={[
            <Button
              key="edit"
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(index)}
              disabled={isAdding}
              className="!text-blue-600 hover:!text-blue-700 hover:!bg-blue-50 !rounded-lg transition-all duration-200"
            >
              Edit
            </Button>,
            <Button
              key="delete"
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(index)}
              disabled={isAdding}
              className="!text-red-600 hover:!text-red-700 hover:!bg-red-50 !rounded-lg transition-all duration-200"
            >
              Remove
            </Button>,
          ]}
        >
          <List.Item.Meta
            title={
              <Space>
                <span className="font-medium">{lesson.title}</span>
                {!lesson.id && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                    New
                  </span>
                )}
              </Space>
            }
            description={
              <Typography.Text type="secondary" className="text-sm">
                {lesson.description}
              </Typography.Text>
            }
          />
        </List.Item>
      )}
    />
  );
}; 