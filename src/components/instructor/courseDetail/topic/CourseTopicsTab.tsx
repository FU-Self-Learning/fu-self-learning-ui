"use client";

import { Button, List, Space, Spin, Typography } from "antd";
import {
  ArrowLeftOutlined,
  PlusOutlined,
  BookOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { AddTopicModal } from "./AddTopicModal";
import { DeleteTopicModal } from "./DeleteTopicModal";
import { EditTopicModal } from "./EditTopicModal";
import { LessonManagementModal } from "./lesson/LessonManagementModal";
import { useCreateTopic } from "@/hooks/topic/instructor/useCreateTopic";
import { TopicInstructorCreateRequest } from "@/types/topicType";
import { useTopics } from "@/hooks/topic/useTopics";
import { useDeleteTopic } from "@/hooks/topic/instructor/useDeleteTopic";
import { useUpdateTopic } from "@/hooks/topic/instructor/useUpdateTopic";
import { useRouter } from "next/navigation";

interface CourseTopicsTabProps {
  courseId: string;
}

export const CourseTopicsTab = ({ courseId }: CourseTopicsTabProps) => {
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState<string | null>(null);
  const [topicToEdit, setTopicToEdit] = useState<any>(null);
  const [idTopicForLessons, setIdTopicForLessons] = useState<string | null>(
    null
  );
  const { mutate: createTopic, isPending: isCreating } =
    useCreateTopic(courseId);
  const { mutate: updateTopic, isPending: isUpdating } = useUpdateTopic(
    courseId,
    topicToEdit?.id
  );
  const { mutate: deleteTopic, isPending: isDeleting } =
    useDeleteTopic(courseId);
  const { data: topics, isLoading } = useTopics(courseId);

  const handleAddTopic = async (values: TopicInstructorCreateRequest) => {
    createTopic(values);
  };

  const handleEditTopic = async (values: any) => {
    if (topicToEdit) {
      updateTopic({ id: topicToEdit.id, ...values });
    }
  };

  const handleEditClick = (topic: any) => {
    setTopicToEdit(topic);
    setIsEditModalOpen(true);
  };

  const handleManageLessonsClick = (topicId: string) => {
    setIdTopicForLessons(topicId);
    setIsLessonModalOpen(true);
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

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setTopicToEdit(null);
  };

  const handleCloseLessonModal = () => {
    setIsLessonModalOpen(false);
    setIdTopicForLessons(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Space>
          <Button
            type="primary"
            icon={<ArrowLeftOutlined />}
            className="mb-2 !bg-white !text-black"
            onClick={() => router.back()}
          />
          <Typography.Title level={3}>Course Topics</Typography.Title>
        </Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          loading={isCreating}
          onClick={() => setIsAddModalOpen(true)}
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
                <Button
                  key="edit"
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => handleEditClick(item)}
                >
                  Edit
                </Button>,
                <Button
                  key="lessons"
                  type="link"
                  icon={<BookOutlined />}
                  onClick={() => handleManageLessonsClick(item.id.toString())}
                >
                  Manage Lessons
                </Button>,
                <Button
                  key="delete"
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
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
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTopic}
        isLoading={isCreating}
      />

      <EditTopicModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSubmit={handleEditTopic}
        topic={topicToEdit}
        isLoading={isUpdating}
      />

      <DeleteTopicModal
        isOpen={!!topicToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />

      <LessonManagementModal
        isOpen={isLessonModalOpen}
        onClose={handleCloseLessonModal}
        topicTitle={
          topics?.find((topic) => topic.id.toString() === idTopicForLessons)
            ?.title || ""
        }
        topicId={idTopicForLessons || ""}
      />
    </div>
  );
};
