'use client';
import React, { useState } from 'react';
import { Upload, Button, message, Card, Typography } from 'antd';
import { UploadOutlined, FilePdfOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { createInstructorRequest } from '@/shared/api/instructorRequest.api';

const { Dragger } = Upload;
const { Title, Paragraph } = Typography;

const InstructorRequestForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const uploadProps: UploadProps = {
    accept: 'application/pdf',
    maxCount: 1,
    beforeUpload: (file) => {
      setFile(file);
      return false;
    },
    onRemove: () => {
      setFile(null);
    },
  };

  const handleSubmit = async () => {
    if (!file) {
      message.error('Please select a PDF file first');
      return;
    }

    const token = localStorage.getItem('accessToken') || '';
    if (!token) {
      message.error('Please login to submit a request');
      return;
    }

    setLoading(true);
    try {
      await createInstructorRequest(file, token);
      message.success('Your request has been submitted successfully!');
      setFile(null);
    } catch (err: any) {
      console.error(err);
      message.error(err?.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className='max-w-lg mx-auto shadow-lg'>
      <Title level={3}>Become an Instructor</Title>
      <Paragraph>
        Upload your CV / certificate PDF. Our team will review and approve your instructor request
        as soon as possible.
      </Paragraph>

      <Dragger {...uploadProps} style={{ marginBottom: 16 }}>
        <p className='ant-upload-drag-icon'>
          <FilePdfOutlined style={{ color: '#ff4d4f' }} />
        </p>
        <p className='ant-upload-text'>Click or drag PDF file to this area to upload</p>
        <p className='ant-upload-hint'>Only one PDF file is allowed.</p>
      </Dragger>

      <Button
        type='primary'
        icon={<UploadOutlined />}
        block
        loading={loading}
        onClick={handleSubmit}
        disabled={!file}
      >
        Submit Request
      </Button>
    </Card>
  );
};

export default InstructorRequestForm;
