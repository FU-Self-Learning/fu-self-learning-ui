'use client';

import { Button, Form, Input, Modal, Typography } from 'antd';
import { useEffect, useState } from 'react';
import type { UploadFile } from 'antd/es/upload/interface';
import { TopicInstructorCreateRequest } from '@/types/topicType';

interface EditTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => Promise<void>;
  topic: TopicInstructorCreateRequest | null;
  isLoading: boolean;
}

export const EditTopicModal = ({
  isOpen,
  onClose,
  onSubmit,
  topic,
  isLoading,
}: EditTopicModalProps) => {
  const [form] = Form.useForm();
  const [videoFile, setVideoFile] = useState<UploadFile | null>(null);

  useEffect(() => {
    if (topic && isOpen) {
      form.setFieldsValue({
        title: topic.title,
        description: topic.description,
      });
    }
  }, [topic, isOpen, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit({
        ...values,
        videoFile: videoFile?.originFileObj,
      });
      form.resetFields();
      setVideoFile(null);
      onClose();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setVideoFile(null);
    onClose();
  };

  return (
    <Modal
      title='Edit Topic'
      open={isOpen}
      onCancel={handleCancel}
      width={800}
      footer={[
        <Button key='cancel' onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key='submit' type='primary' loading={isLoading} onClick={handleSubmit}>
          Update Topic
        </Button>,
      ]}
    >
      <Form form={form} layout='vertical' className='mt-4'>
        <Form.Item
          name='title'
          label={<Typography.Text strong>Title (required)</Typography.Text>}
          rules={[{ required: true, message: 'Please enter the title' }]}
        >
          <Input placeholder='Enter topic title' />
        </Form.Item>

        <Form.Item name='description' label={<Typography.Text strong>Description</Typography.Text>}>
          <Input.TextArea rows={4} placeholder='Enter topic description' />
        </Form.Item>
      </Form>
    </Modal>
  );
};
