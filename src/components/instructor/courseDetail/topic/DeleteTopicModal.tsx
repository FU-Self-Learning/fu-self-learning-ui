"use client";

import { Modal, Typography } from "antd";

interface DeleteTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export const DeleteTopicModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: DeleteTopicModalProps) => {
  return (
    <Modal
      title="Delete Topic"
      open={isOpen}
      onOk={onConfirm}
      onCancel={onClose}
      okText="Delete"
      cancelText="Cancel"
      okButtonProps={{ danger: true, loading: isLoading }}
    >
      <Typography.Text>
        Are you sure you want to delete this topic? This action cannot be undone.
      </Typography.Text>
    </Modal>
  );
}; 