'use client';

import React, { useState } from 'react';
import {
  Card,
  Typography,
  Button,
  Space,
  Tag,
  Row,
  Col,
  Statistic,
  Modal,
  message,
  Alert,
} from 'antd';
import {
  TrophyOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  LockOutlined,
  EyeOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { ExamResponse } from '@/types/examType';
import { TopicResponse } from '@/types/topicType';
import { getExamTypeLabel, getExamTypeColor } from '@/utils/examTypeMapper';
import { extractErrorMessage } from '@/utils/ErrorHandle';

const { Title, Text } = Typography;

interface FinalExamManagementProps {
  courseId: string;
  topics: TopicResponse[];
  finalExam?: ExamResponse;
}

const FinalExamManagement: React.FC<FinalExamManagementProps> = ({
  courseId,
  topics,
  finalExam,
}) => {
  const router = useRouter();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleCreateFinalExam = () => {
    router.push(`/instructor/course/${courseId}/exam/create?type=final_exam`);
  };

  const handleEditFinalExam = (examId: number) => {
    router.push(`/instructor/course/${courseId}/exam/edit/${examId}`);
  };

  const handleDeleteFinalExam = () => {
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      // TODO: Implement delete API call
      message.success('Final exam deleted successfully');
      setDeleteModalVisible(false);
    } catch (error) {
      message.error(extractErrorMessage(error) || 'Failed to delete final exam');
    }
  };

  return (
    <div className='space-y-6'>
      {finalExam ? (
        <div>
          <div className='flex justify-between items-center mb-4'>
            <Title level={4}>{getExamTypeLabel('final_exam')}</Title>
            <Space>
              <Button
                type='default'
                icon={<EyeOutlined />}
                onClick={() => router.push(`/instructor/course/${courseId}/exam/${finalExam.id}`)}
              >
                View
              </Button>
              <Button
                type='primary'
                icon={<EditOutlined />}
                onClick={() => handleEditFinalExam(finalExam.id)}
              >
                Edit
              </Button>
              <Button danger icon={<DeleteOutlined />} onClick={handleDeleteFinalExam}>
                Delete
              </Button>
            </Space>
          </div>

          <Card
            className='hover:shadow-md transition-shadow'
            style={{ border: '2px solid #1890ff' }}
          >
            <div className='flex justify-between items-start'>
              <div className='flex-1'>
                <div className='flex items-center gap-2 mb-2'>
                  <Title level={4} className='mb-0'>
                    {finalExam.title}
                  </Title>
                  <Tag color={getExamTypeColor('final_exam')}>{getExamTypeLabel('final_exam')}</Tag>
                  <Tag color='purple'>Certificate Required</Tag>
                  <Tag color={finalExam.isActive ? 'green' : 'red'}>
                    {finalExam.isActive ? 'Active' : 'Inactive'}
                  </Tag>
                </div>
                <Text type='secondary' className='block mb-3'>
                  {finalExam.description}
                </Text>
                <Row gutter={16}>
                  <Col span={6}>
                    <Statistic
                      title='Duration'
                      value={finalExam.duration}
                      suffix='min'
                      prefix={<ClockCircleOutlined />}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title='Questions'
                      value={finalExam.totalQuestions}
                      prefix={<CheckCircleOutlined />}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic title='Passing Score' value={finalExam.passingScore} suffix='%' />
                  </Col>
                  <Col span={6}>
                    <div className='flex items-center gap-2'>
                      <LockOutlined className='text-orange-500' />
                      <Text>All Topic Exams Required</Text>
                    </div>
                  </Col>
                </Row>

                <Alert
                  message='Final Exam Requirements'
                  description='Students must complete all topic exams before they can take the final exam. This exam is required to earn the course certificate.'
                  type='info'
                  showIcon
                  className='mt-4'
                />
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div className='text-center py-12'>
          <TrophyOutlined className='text-6xl text-gray-400 mb-4' />
          <Title level={3} className='mb-2'>
            No Final Exam Created
          </Title>
          <Text type='secondary' className='block mb-6'>
            Create a final exam that students must pass to earn their course certificate. Students
            will need to complete all topic exams first.
          </Text>
          <Button
            type='primary'
            size='large'
            icon={<PlusOutlined />}
            onClick={handleCreateFinalExam}
          >
            Create Final Exam
          </Button>
        </div>
      )}

      {/* Course Topics Overview */}
      <Card title='Course Topics Overview' className='mt-6'>
        <div className='space-y-3'>
          {topics.map((topic, index) => (
            <div
              key={topic.id}
              className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'
            >
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold'>
                  {index + 1}
                </div>
                <div>
                  <Text strong>{topic.title}</Text>
                  <div className='text-xs text-gray-500'>
                    {topic.lessons.length} lessons • {topic.totalDuration} min
                  </div>
                </div>
              </div>
              <Tag color='blue'>Topic {index + 1}</Tag>
            </div>
          ))}
        </div>
        <div className='mt-4 p-3 bg-blue-50 rounded-lg'>
          <Text type='secondary'>
            <StarOutlined className='mr-2' />
            Final exam questions will be generated from all {topics.length} topics above
          </Text>
        </div>
      </Card>

      {/* Delete confirmation modal */}
      <Modal
        title='Delete Final Exam'
        open={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText='Delete'
        cancelText='Cancel'
        okButtonProps={{ danger: true }}
      >
        <p>
          Are you sure you want to delete the final exam &quot;{finalExam?.title}&quot;? This action
          cannot be undone and students will no longer be able to earn certificates for this course.
        </p>
      </Modal>
    </div>
  );
};

export default FinalExamManagement;
