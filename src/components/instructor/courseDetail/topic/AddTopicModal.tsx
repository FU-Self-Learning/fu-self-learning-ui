"use client";

import { Button, Form, Input, Modal, Typography } from "antd";
import { useState } from "react";

interface AddTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => Promise<void>;
  isLoading: boolean;
}

export const AddTopicModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: AddTopicModalProps) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit({
        ...values,
      });
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      title="Add New Topic"
      open={isOpen}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isLoading}
          onClick={handleSubmit}
        >
          Add Topic
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="title"
          label={<Typography.Text strong>Title (required)</Typography.Text>}
          rules={[{ required: true, message: "Please enter the title" }]}
        >
          <Input placeholder="Enter topic title" />
        </Form.Item>

        <Form.Item
          name="description"
          label={<Typography.Text strong>Description</Typography.Text>}
        >
          <Input.TextArea rows={4} placeholder="Enter topic description" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
