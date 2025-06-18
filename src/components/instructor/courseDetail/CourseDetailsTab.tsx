"use client";

import {
  Button,
  Form,
  Image,
  Input,
  Space,
  Typography,
  Upload,
  message,
} from "antd";
import {
  InfoCircleOutlined,
  UploadOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { RcFile } from "antd/lib/upload";
import { CourseInstructorDetailResponse } from "@/types/courseType";

interface CourseDetailsTabProps {
  course: CourseInstructorDetailResponse;
  onSave: (values: any) => Promise<void>;
}

export const CourseDetailsTab = ({ course, onSave }: CourseDetailsTabProps) => {
  const [form] = Form.useForm();
  const [isChanged, setIsChanged] = useState(false);
  const [imageFile, setImageFile] = useState<UploadFile | null>(null);
  const [videoFile, setVideoFile] = useState<UploadFile | null>(null);
  const [documentFile, setDocumentFile] = useState<UploadFile | null>(null);

  useEffect(() => {
    if (course) {
      setImageFile({
        uid: course.imageUrl,
        name: course.imageUrl,
        url: course.imageUrl,
      });
      setVideoFile({
        uid: course.videoIntroUrl,
        name: course.videoIntroUrl,
        url: course.videoIntroUrl,
      });
      setDocumentFile({
        uid: course.documentUrl,
        name: course.documentUrl,
        url: course.documentUrl,
      });
    }
  }, [course]);

  const handleValuesChange = () => {
    setIsChanged(true);
  };

  const handleSave = async (values: any) => {
    try {
      await onSave(values);
      setIsChanged(false);
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  const handleImageUpload: UploadProps["customRequest"] = async ({
    file,
    onSuccess,
  }) => {
    try {
      const previewUrl = URL.createObjectURL(file as Blob);

      setImageFile({
        uid: (file as RcFile).uid,
        name: (file as RcFile).name,
        url: previewUrl,
        originFileObj: file as RcFile,
      });

      setIsChanged(true);
      onSuccess?.("ok");
    } catch (error) {
      message.error("Upload failed");
    }
  };

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
      setIsChanged(true);
      onSuccess?.("ok");
    } catch (error) {
      message.error("Upload failed");
    }
  };

  const handleDocumentUpload: UploadProps["customRequest"] = async ({
    file,
    onSuccess,
  }) => {
    try {
      const previewUrl = URL.createObjectURL(file as Blob);

      setDocumentFile({
        uid: (file as RcFile).uid,
        name: (file as RcFile).name,
        url: previewUrl,
        originFileObj: file as RcFile,
      });
      setIsChanged(true);
      onSuccess?.("ok");
    } catch (error) {
      message.error("Upload failed");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Typography.Title level={3}>Video Details</Typography.Title>
        <Button 
          type="primary" 
          onClick={() => form.submit()}
          disabled={!isChanged}
        >
          Save Changes
        </Button>
      </div>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          title: course.title,
          description: course.description,
        }}
        onValuesChange={handleValuesChange}
        onFinish={handleSave}
      >
        <div className="space-y-6">
          <Form.Item
            name="title"
            label={
              <Typography.Text
                strong
                className="flex items-center gap-1 mb-2"
              >
                Title (required) <InfoCircleOutlined />
              </Typography.Text>
            }
            rules={[{ required: true, message: "Please enter the title" }]}
          >
            <Input maxLength={100} placeholder="Enter video title" />
          </Form.Item>

          <Form.Item
            name="description"
            label={
              <Typography.Text
                strong
                className="flex items-center gap-1 mb-2"
              >
                Description <InfoCircleOutlined />
              </Typography.Text>
            }
          >
            <Input.TextArea
              rows={4}
              placeholder="Enter video description"
            />
          </Form.Item>

          <Space size="large" className="w-full">
            <Form.Item
              name="imageUrl"
              label={
                <Typography.Text
                  strong
                  className="flex items-center gap-1 mb-2"
                >
                  Course Image <InfoCircleOutlined />
                </Typography.Text>
              }
            >
              <div className="space-y-4">
                <div className="w-[300px] h-[200px] border border-gray-200 rounded-lg overflow-hidden">
                  {imageFile?.url ? (
                    <Image
                      src={imageFile.url}
                      alt="Course image"
                      className="w-full h-full object-cover"
                      width={300}
                      height={200}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <Typography.Text type="secondary">No image</Typography.Text>
                    </div>
                  )}
                </div>
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  customRequest={handleImageUpload}
                >
                  <Button icon={<UploadOutlined />}>Upload Image</Button>
                </Upload>
              </div>
            </Form.Item>

            <Form.Item
              name="videoIntroUrl"
              label={
                <Typography.Text
                  strong
                  className="flex items-center gap-1 mb-2"
                >
                  Video Introduction <InfoCircleOutlined />
                </Typography.Text>
              }
            >
              <div className="space-y-4">
                <div className="w-[300px] h-[200px] border border-gray-200 rounded-lg overflow-hidden">
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
                  <Button icon={<UploadOutlined />}>Upload Video</Button>
                </Upload>
              </div>
            </Form.Item>

            <Form.Item
              name="documentUrl"
              label={
                <Typography.Text
                  strong
                  className="flex items-center gap-1 mb-2"
                >
                  Course Document <InfoCircleOutlined />
                </Typography.Text>
              }
            >
              <div className="space-y-4">
                <div className="w-[300px] h-[200px] border border-gray-200 rounded-lg overflow-hidden">
                  {documentFile?.url ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <Space direction="vertical" align="center">
                        <FileOutlined className="text-4xl" />
                        <a 
                          href={documentFile.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          View Document
                        </a>
                      </Space>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <Typography.Text type="secondary">No document</Typography.Text>
                    </div>
                  )}
                </div>
                <Upload
                  accept=".pdf"
                  showUploadList={false}
                  customRequest={handleDocumentUpload}
                >
                  <Button icon={<UploadOutlined />}>Upload PDF</Button>
                </Upload>
              </div>
            </Form.Item>
          </Space>
        </div>
      </Form>
    </div>
  );
}; 