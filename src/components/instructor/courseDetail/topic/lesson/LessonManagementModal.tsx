"use client";

import { Button, Modal, message, Spin } from "antd";
import { useState, useEffect, useCallback } from "react";
import { useCreateManyLessons } from "@/hooks/lesson/instructor/useCreateManyLessons";
import { useLessonsInstructor } from "@/hooks/lesson/instructor/useLessonsInstructor";
import { LessonForm } from "./LessonForm";
import { LessonList } from "./LessonList";
import { LessonHeader } from "./LessonHeader";
import { Lesson, CreateLessonData } from "./types";

interface LessonManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicTitle: string;
  topicId: string;
}

export const LessonManagementModal = ({
  isOpen,
  onClose,
  topicTitle,
  topicId,
}: LessonManagementModalProps) => {
  const { data: lessons, isLoading } = useLessonsInstructor(topicId);
  const [currentLessons, setCurrentLessons] = useState<Lesson[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const { mutate: createManyLessons, isPending: isCreating } =
    useCreateManyLessons(topicId);

  useEffect(() => {
    if (lessons) {
      setCurrentLessons(lessons);
    }
  }, [lessons]);

  const handleAddLesson = useCallback(() => {
    setIsAdding(true);
    setEditingIndex(null);
  }, []);

  const handleEditLesson = useCallback((index: number) => {
    setEditingIndex(index);
    setIsAdding(true);
  }, []);

  const handleSaveLesson = useCallback(
    (lesson: Lesson) => {
      if (editingIndex !== null) {
        const updatedLessons = [...currentLessons];
        updatedLessons[editingIndex] = lesson;
        setCurrentLessons(updatedLessons);
      } else {
        setCurrentLessons([...currentLessons, lesson]);
      }

      setIsAdding(false);
      setEditingIndex(null);
    },
    [currentLessons, editingIndex]
  );

  const handleCancelEdit = useCallback(() => {
    setIsAdding(false);
    setEditingIndex(null);
  }, []);

  const handleDeleteLesson = useCallback(
    (index: number) => {
      const updatedLessons = currentLessons.filter((_, i) => i !== index);
      setCurrentLessons(updatedLessons);
    },
    [currentLessons]
  );

  const handleSave = useCallback(async () => {
    try {
      const newLessons = currentLessons.filter((lesson) => !lesson.id);

      if (newLessons.length === 0) {
        message.info("No new lessons to save");
        return;
      }

      const lessonsData: CreateLessonData[] = newLessons.map((lesson) => ({
        title: lesson.title,
        description: lesson.description,
      }));

      const videoFiles = newLessons
        .map((lesson) => lesson.videoFile)
        .filter((file): file is File => file !== undefined);

      if (videoFiles.length !== lessonsData.length) {
        message.error("Each lesson must have a video file");
        return;
      }

      createManyLessons({
        lessons: lessonsData,
        videoFiles: videoFiles,
      });

      const updatedLessons = currentLessons.map((lesson) =>
        lesson.id ? lesson : { ...lesson, id: "temp-" + Date.now() }
      );
      setCurrentLessons(updatedLessons);
    } catch (error) {
      console.error("Error saving lessons:", error);
    }
  }, [currentLessons, createManyLessons]);

  const handleClose = useCallback(() => {
    setCurrentLessons(lessons || []);
    setIsAdding(false);
    setEditingIndex(null);
    onClose();
  }, [lessons, onClose]);

  const newLessonsCount = currentLessons.filter((lesson) => !lesson.id).length;
  const editingLesson =
    editingIndex !== null ? currentLessons[editingIndex] : undefined;

  if (isLoading) {
    return (
      <Modal
        title={`Manage Lessons - ${topicTitle}`}
        open={isOpen}
        onCancel={handleClose}
        width={1000}
        footer={null}
      >
        <div className="flex justify-center items-center py-8">
          <Spin size="large" />
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title={`Manage Lessons - ${topicTitle}`}
      open={isOpen}
      onCancel={handleClose}
      width={1000}
      footer={[
        <Button key="cancel" onClick={handleClose}>
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          loading={isCreating}
          onClick={handleSave}
          disabled={newLessonsCount === 0}
        >
          Save Changes
        </Button>,
      ]}
    >
      <div className="space-y-6">
        {isAdding && (
          <LessonForm
            lesson={editingLesson}
            isEditing={editingIndex !== null}
            onSave={handleSaveLesson}
            onCancel={handleCancelEdit}
          />
        )}

        <div>
          <LessonHeader
            totalLessons={currentLessons.length}
            newLessonsCount={newLessonsCount}
            onAddLesson={handleAddLesson}
            isAdding={isAdding}
          />

          <LessonList
            lessons={currentLessons}
            onEdit={handleEditLesson}
            onDelete={handleDeleteLesson}
            isAdding={isAdding}
          />
        </div>
      </div>
    </Modal>
  );
};
