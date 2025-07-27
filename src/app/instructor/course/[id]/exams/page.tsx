'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  Typography,
  Tabs,
  Spin,
  Alert,
  Empty,
  Space,
  Button,
  Tag,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  BookOutlined,
  TrophyOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { useTopics } from '@/hooks/topic/useTopics';
import { useCourseInstructorDetail } from '@/hooks/course/instructor/useCourseInstructorDetail';
import { ExamResponse } from '@/types/examType';
import { useInstructorExams } from '@/hooks/exam/useExams';
import FinalExamManagement from '@/components/instructor/exam/FinalExamManagement';
import TopicExamManagement from '@/components/instructor/exam/TopicExamManagement';
import ExamStats from '@/components/instructor/exam/ExamStats';
import { getExamTypeLabel, getExamTypeColor } from '@/utils/examTypeMapper';

const { Title, Text } = Typography;

const InstructorExamsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const [activeTab, setActiveTab] = useState('1');

  const { data: topics = [], isLoading: topicsLoading } = useTopics(courseId);
  const { data: course, isLoading: courseLoading } = useCourseInstructorDetail(courseId);
  const { data: exams = [], isLoading: examsLoading } = useInstructorExams(parseInt(courseId));

  if (topicsLoading || courseLoading || examsLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spin size='large' />
      </div>
    );
  }

  if (!course) {
    return (
      <div className='p-6'>
        <Alert
          message='Course not found'
          description='The course you are looking for does not exist.'
          type='error'
          showIcon
        />
      </div>
    );
  }

  const topicExams = exams.filter((exam: ExamResponse) => exam.type === 'topic_exam');
  const finalExam = exams.find((exam: ExamResponse) => exam.type === 'final');
  const practiceExams = exams.filter((exam: ExamResponse) => exam.type === 'practice');

  const items = [
    {
      key: '1',
      label: (
        <Space>
          <BookOutlined />
          <span>
            {getExamTypeLabel('topic_exam')} ({topicExams.length})
          </span>
        </Space>
      ),
      children: <TopicExamManagement courseId={courseId} topics={topics} topicExams={topicExams} />,
    },
    {
      key: '2',
      label: (
        <Space>
          <TrophyOutlined />
          <span>
            {getExamTypeLabel('final_exam')} {finalExam && <Tag color='green'>Created</Tag>}
          </span>
        </Space>
      ),
      children: <FinalExamManagement courseId={courseId} topics={topics} finalExam={finalExam} />,
    },
    {
      key: '3',
      label: (
        <Space>
          <StarOutlined />
          <span>
            {getExamTypeLabel('practice')} ({practiceExams.length})
          </span>
        </Space>
      ),
      children: (
        <div className='space-y-4'>
          {practiceExams.length > 0 ? (
            practiceExams.map((exam: ExamResponse) => (
              <Card key={exam.id} className='hover:shadow-md transition-shadow'>
                <div className='flex justify-between items-start'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-2'>
                      <Title level={5} className='mb-0'>
                        {exam.title}
                      </Title>
                      <Tag color={getExamTypeColor(exam.type)}>{getExamTypeLabel(exam.type)}</Tag>
                      <Tag color={exam.isActive ? 'green' : 'red'}>
                        {exam.isActive ? 'Active' : 'Inactive'}
                      </Tag>
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
                          value={exam.questionCount}
                          prefix={<CheckCircleOutlined />}
                        />
                      </Col>
                      <Col span={6}>
                        <Statistic title='Passing Score' value={exam.passingScore} suffix='%' />
                      </Col>
                    </Row>
                  </div>
                  <div className='flex gap-2'>
                    <Button
                      type='primary'
                      icon={<EditOutlined />}
                      onClick={() =>
                        router.push(`/instructor/course/${courseId}/exam/edit/${exam.id}`)
                      }
                    >
                      Edit
                    </Button>
                    <Button danger icon={<DeleteOutlined />}>
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Empty description='No practice tests created yet' image={Empty.PRESENTED_IMAGE_SIMPLE}>
              <Button
                type='primary'
                icon={<PlusOutlined />}
                onClick={() =>
                  router.push(`/instructor/course/${courseId}/exam/create?type=practice`)
                }
              >
                Create Practice Test
              </Button>
            </Empty>
          )}
        </div>
      ),
    },
    {
      key: '4',
      label: (
        <Space>
          <CheckCircleOutlined />
          <span>Statistics</span>
        </Space>
      ),
      children: <ExamStats courseId={courseId} exams={exams} />,
    },
  ];

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      {/* Header */}
      <div className='mb-6'>
        <div className='flex justify-between items-start'>
          <div>
            <Title level={2}>Course Exams Management</Title>
            <Text type='secondary'>
              Manage topic exams and final exam for &quot;{course.title}&quot;
            </Text>
          </div>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            size='large'
            onClick={() => router.push(`/instructor/course/${courseId}/exam/create?type=practice`)}
          >
            Create Practice Test
          </Button>
        </div>
      </div>

      {/* Course Overview */}
      <Card
        className='mb-6'
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        <div className='text-white'>
          <Row gutter={24}>
            <Col span={6}>
              <Statistic
                title='Total Topics'
                value={topics.length}
                valueStyle={{ color: '#ffffff' }}
                prefix={<BookOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title='Topic Exams'
                value={topicExams.length}
                valueStyle={{ color: '#ffffff' }}
                prefix={<CheckCircleOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title='Final Exam'
                value={finalExam ? 1 : 0}
                valueStyle={{ color: '#ffffff' }}
                prefix={<TrophyOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title='Practice Tests'
                value={practiceExams.length}
                valueStyle={{ color: '#ffffff' }}
                prefix={<StarOutlined />}
              />
            </Col>
          </Row>
        </div>
      </Card>

      {/* Main Content */}
      <Card>
        <Tabs
          defaultActiveKey='1'
          items={items}
          size='large'
          tabPosition='top'
          activeKey={activeTab}
          onChange={setActiveTab}
        />
      </Card>
    </div>
  );
};

export default InstructorExamsPage;
