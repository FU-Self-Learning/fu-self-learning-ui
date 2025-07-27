'use client';

import React, { useState } from 'react';
import { Card, Typography, Button, Tag, Row, Col, Statistic, Empty, Modal, message } from 'antd';
import {
  BookOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  LockOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { ExamResponse } from '@/types/examType';
import { TopicResponse } from '@/types/topicType';
import { getExamTypeLabel, getExamTypeColor } from '@/utils/examTypeMapper';
import { extractErrorMessage } from '@/utils/ErrorHandle';

const { Title, Text } = Typography;

interface TopicExamManagementProps {
  courseId: string;
  topics: TopicResponse[];
  topicExams: ExamResponse[];
}

const TopicExamManagement: React.FC<TopicExamManagementProps> = ({
  courseId,
  topics,
  topicExams,
}) => {
  const router = useRouter();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [examToDelete, setExamToDelete] = useState<ExamResponse | null>(null);

  const topicsWithoutExams = topics.filter(
    (topic) => !topicExams.some((exam) => exam.topicIds?.includes(topic.id)),
  );

  const handleCreateTopicExam = (topicId: number) => {
    router.push(`/instructor/course/${courseId}/exam/create?type=topic_exam&topicId=${topicId}`);
  };

  const handleEditTopicExam = (examId: number) => {
    router.push(`/instructor/course/${courseId}/exam/edit/${examId}`);
  };

  const handleDeleteTopicExam = (exam: ExamResponse) => {
    setExamToDelete(exam);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!examToDelete) return;

    try {
      // TODO: Implement delete API call
      message.success('Topic exam deleted successfully');
      setDeleteModalVisible(false);
      setExamToDelete(null);
    } catch (error) {
      message.error(extractErrorMessage(error) || 'Failed to delete topic exam');
    }
  };

  const getTopicTitle = (exam: ExamResponse) => {
    const topicId = exam.topicIds?.[0];
    const topic = topics.find((t) => t.id === topicId);
    return topic?.title || 'Unknown Topic';
  };

  return (
    <div className='space-y-6'>
      {/* Topics without exams */}
      {topicsWithoutExams.length > 0 && (
        <div>
          <Title level={4} className='mb-4'>
            Topics Without Exams
          </Title>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {topicsWithoutExams.map((topic) => (
              <Card
                key={topic.id}
                className='hover:shadow-md transition-shadow border-dashed border-2 border-gray-300'
              >
                <div className='text-center'>
                  <BookOutlined className='text-4xl text-gray-400 mb-3' />
                  <Title level={5} className='mb-2'>
                    {topic.title}
                  </Title>
                  <Text type='secondary' className='block mb-4'>
                    No exam created yet
                  </Text>
                  <Button
                    type='primary'
                    icon={<PlusOutlined />}
                    onClick={() => handleCreateTopicExam(topic.id)}
                  >
                    Create Topic Exam
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Existing topic exams */}
      {topicExams.length > 0 && (
        <div>
          <Title level={4} className='mb-4'>
            {getExamTypeLabel('topic_exam')}
          </Title>
          <div className='space-y-4'>
            {topicExams.map((exam) => (
              <Card key={exam.id} className='hover:shadow-md transition-shadow'>
                <div className='flex justify-between items-start'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-2'>
                      <Title level={5} className='mb-0'>
                        {exam.title}
                      </Title>
                      <Tag color={getExamTypeColor('topic_exam')}>
                        {getExamTypeLabel('topic_exam')}
                      </Tag>
                      <Tag color={exam.isActive ? 'green' : 'red'}>
                        {exam.isActive ? 'Active' : 'Inactive'}
                      </Tag>
                      <Tag color='blue'>{getTopicTitle(exam)}</Tag>
                    </div>
                    <Text type='secondary' className='block mb-3'>
                      {exam.description}
                    </Text>
                    <Row gutter={16}>
                      <Col span={6}>
                        <Statistic
                          title='Duration'
                          value={exam.duration}
                          suffix='min'
                          prefix={<ClockCircleOutlined />}
                        />
                      </Col>
                      <Col span={6}>
                        <Statistic
                          title='Questions'
                          value={exam.totalQuestions}
                          prefix={<CheckCircleOutlined />}
                        />
                      </Col>
                      <Col span={6}>
                        <Statistic title='Passing Score' value={exam.passingScore} suffix='%' />
                      </Col>
                      <Col span={6}>
                        <div className='flex items-center gap-2'>
                          <LockOutlined className='text-orange-500' />
                          <Text>Video Required</Text>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div className='flex gap-2'>
                    <Button
                      type='default'
                      icon={<EyeOutlined />}
                      onClick={() => router.push(`/instructor/course/${courseId}/exam/${exam.id}`)}
                    >
                      View
                    </Button>
                    <Button
                      type='primary'
                      icon={<EditOutlined />}
                      onClick={() => handleEditTopicExam(exam.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteTopicExam(exam)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {topics.length === 0 && (
        <Empty
          description='No topics available for this course'
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}

      {/* Delete confirmation modal */}
      <Modal
        title={`Delete ${getExamTypeLabel('topic_exam')}`}
        open={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => {
          setDeleteModalVisible(false);
          setExamToDelete(null);
        }}
        okText='Delete'
        cancelText='Cancel'
        okButtonProps={{ danger: true }}
      >
        <p>
          Are you sure you want to delete the topic exam &quot;{examToDelete?.title}&quot;? This
          action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default TopicExamManagement;
