"use client";

import { Button, List, Spin, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { AddTopicModal } from "./AddTopicModal";
import { DeleteTopicModal } from "./DeleteTopicModal";
import { useCreateTopic } from "@/hooks/topic/instructor/useCreateTopic";
import { TopicInstructorCreateRequest } from "@/types/topicType";
import { useTopics } from "@/hooks/topic/useTopics";
import { useDeleteTopic } from "@/hooks/topic/instructor/useDeleteTopic";

interface CourseTopicsTabProps {
  courseId: string;
}

export const CourseTopicsTab = ({ courseId }: CourseTopicsTabProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState<string | null>(null);
  const { mutate: createTopic, isPending } = useCreateTopic(courseId);
  const { mutate: deleteTopic, isPending: isDeleting } =
    useDeleteTopic(courseId);
  const { data: topics, isLoading } = useTopics(courseId);

  const handleAddTopic = async (values: TopicInstructorCreateRequest) => {
    createTopic(values);
  };

  const handleDeleteClick = (topicId: string) => {
    setTopicToDelete(topicId);
  };

  const handleConfirmDelete = () => {
    if (topicToDelete) {
      deleteTopic(topicToDelete, {
        onSuccess: () => {
          setTopicToDelete(null);
        },
      });
    }
  };

  const handleCancelDelete = () => {
    setTopicToDelete(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Typography.Title level={3}>Course Topics</Typography.Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          loading={isPending}
          onClick={() => setIsModalOpen(true)}
        >
          Add Topic
        </Button>
      </div>
      {isLoading ? (
        <Spin />
      ) : (
        <List
          className="bg-white rounded-lg"
          itemLayout="horizontal"
          dataSource={topics}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button key="edit" type="link">
                  Edit
                </Button>,
                <Button
                  key="delete"
                  type="link"
                  danger
                  onClick={() => handleDeleteClick(item.id.toString())}
                >
                  Delete
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={<Typography.Text strong>{item.title}</Typography.Text>}
                description={item.description}
              />
            </List.Item>
          )}
        />
      )}

      <AddTopicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTopic}
        isLoading={isPending}
      />

      <DeleteTopicModal
        isOpen={!!topicToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};
