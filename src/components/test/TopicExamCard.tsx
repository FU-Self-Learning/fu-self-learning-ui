import React from 'react';
import { Card, Button, Tag, Typography, Row, Col, Statistic } from 'antd';
import {
  PlayCircleOutlined,
  LockOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { TopicExam } from '@/types/testType';
import { useRouter } from 'next/navigation';
import { getExamTypeLabel, getExamTypeColor } from '@/utils/examTypeMapper';

const { Title, Text } = Typography;

interface TopicExamCardProps {
  topicExam: TopicExam;
  courseId: string;
}

const TopicExamCard: React.FC<TopicExamCardProps> = ({ topicExam, courseId }) => {
  const router = useRouter();

  const handleStartExam = () => {
    router.push(`/course/${courseId}/test/${topicExam.id}`);
  };

  const getStatusColor = () => {
    if (!topicExam.isAvailable) return 'red';
    if (topicExam.isVideoCompleted) return 'green';
    return 'orange';
  };

  const getStatusText = () => {
    if (!topicExam.isAvailable) return 'Locked';
    if (topicExam.isVideoCompleted) return 'Ready';
    return 'Video Required';
  };

  return (
    <Card
      className={`!mb-4 hover:shadow-lg transition-shadow ${
        !topicExam.isAvailable ? 'opacity-60' : ''
      }`}
      style={{ borderRadius: '12px' }}
    >
      <div className='flex justify-between items-start mb-4'>
        <div className='flex-1'>
          <div className='flex items-center gap-2 mb-2'>
            <Title level={5} className='mb-0'>
              {topicExam.title}
            </Title>
            <Tag color={getStatusColor()}>{getStatusText()}</Tag>
            <Tag color={getExamTypeColor('topic_exam')}>{getExamTypeLabel('topic_exam')}</Tag>
          </div>

          <Text type='secondary' className='block mb-3'>
            Topic: {topicExam.topicTitle}
          </Text>

          <Row gutter={16} className='mb-3'>
            <Col span={6}>
              <Statistic
                title='Duration'
                value={topicExam.duration}
                suffix='min'
                prefix={<ClockCircleOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title='Questions'
                value={topicExam.questionCount}
                prefix={<CheckCircleOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic title='Passing Score' value={topicExam.passingScore} suffix='%' />
            </Col>
            <Col span={6}>
              <Statistic
                title='Video Status'
                value={topicExam.isVideoCompleted ? 'Completed' : 'Required'}
                valueStyle={{
                  color: topicExam.isVideoCompleted ? '#52c41a' : '#faad14',
                }}
                prefix={<PlayCircleOutlined />}
              />
            </Col>
          </Row>

          {topicExam.requireVideoCompletion && (
            <div className='mb-3'>
              <Text type='secondary'>
                ⚠️ You must complete all videos in this topic before taking the exam
              </Text>
            </div>
          )}
        </div>

        <div className='flex flex-col gap-2'>
          {topicExam.isAvailable ? (
            <Button
              type='primary'
              icon={<PlayCircleOutlined />}
              onClick={handleStartExam}
              size='large'
            >
              Start Exam
            </Button>
          ) : (
            <Button disabled icon={<LockOutlined />} size='large'>
              Locked
            </Button>
          )}
        </div>
      </div>

      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Text type='secondary'>{topicExam.description}</Text>
        </div>

        <div className='flex items-center gap-2'>
          {topicExam.shuffleQuestions && <Tag color='purple'>Shuffled Questions</Tag>}
          {topicExam.shuffleAnswers && <Tag color='purple'>Shuffled Answers</Tag>}
        </div>
      </div>
    </Card>
  );
};

export default TopicExamCard;
