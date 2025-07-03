"use client";

import { Button, Input, Space, Typography, Upload, message } from "antd";
import { useState } from "react";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { RcFile } from "antd/lib/upload";
import { 
  PlusOutlined, 
  UploadOutlined, 
  SaveOutlined,
  CloseOutlined 
} from "@ant-design/icons";

interface Lesson {
  id?: string;
  title: string;
  description: string;
  videoFile?: File;
  videoUrl?: string;
}

interface LessonFormProps {
  lesson?: Lesson;
  isEditing?: boolean;
  onSave: (lesson: Lesson) => void;
  onCancel: () => void;
}

export const LessonForm = ({ lesson, isEditing = false, onSave, onCancel }: LessonFormProps) => {
  const [formData, setFormData] = useState<Lesson>({
    title: lesson?.title || "",
    description: lesson?.description || "",
  });
  const [videoFile, setVideoFile] = useState<UploadFile | null>(
    lesson?.videoUrl ? {
      uid: lesson.videoUrl,
      name: lesson.videoUrl,
      url: lesson.videoUrl,
    } : null
  );

  const handleVideoUpload: UploadProps["customRequest"] = async ({
    file,
    onSuccess,
  }) => {
    try {
      const previewUrl = URL.createObjectURL(file as Blob);
      setVideoFile({
        uid: (file as RcFile).uid,
        name: (file as RcFile).name,
        url: previewUrl,
        originFileObj: file as RcFile,
      });
      onSuccess?.("ok");
    } catch (error) {
      console.log(error);
      message.error("Upload failed");
    }
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      message.error("Please enter lesson title");
      return;
    }

    const lessonToSave: Lesson = {
      ...formData,
      videoFile: videoFile?.originFileObj,
      videoUrl: videoFile?.url,
    };

    onSave(lessonToSave);
  };

  const handleCancel = () => {
    setFormData({ title: "", description: "" });
    setVideoFile(null);
    onCancel();
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <Typography.Text strong className="block mb-3">
        {isEditing ? "Edit Lesson" : "Add New Lesson"}
      </Typography.Text>
      <Space direction="vertical" className="w-full" size="middle">
        <Input
          placeholder="Lesson title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <Input.TextArea
          placeholder="Lesson description"
          rows={2}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <div className="space-y-2">
          <div className="w-full h-[150px] border border-gray-200 rounded-lg overflow-hidden">
            {videoFile?.url ? (
              <video
                src={videoFile.url}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <Typography.Text type="secondary">No video</Typography.Text>
              </div>
            )}
          </div>
          <Upload
            accept="video/*"
            showUploadList={false}
            customRequest={handleVideoUpload}
          >
            <Button icon={<UploadOutlined />} size="small">
              {videoFile?.url ? "Change Video" : "Upload Video"}
            </Button>
          </Upload>
        </div>
        <Space>
          <Button 
            type="primary" 
            icon={isEditing ? <SaveOutlined /> : <PlusOutlined />}
            onClick={handleSubmit}
            disabled={!formData.title.trim()}
          >
            {isEditing ? "Update Lesson" : "Add Lesson"}
          </Button>
          <Button 
            icon={<CloseOutlined />}
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </Space>
      </Space>
    </div>
  );
}; 