import React from 'react';
import { Card, Button, Tag, Typography, Progress, Row, Col, Statistic, Alert } from 'antd';
import {
  TrophyOutlined,
  LockOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { FinalExam } from '@/types/testType';
import { useRouter } from 'next/navigation';
import { getExamTypeLabel, getExamTypeColor } from '@/utils/examTypeMapper';

const { Title, Text } = Typography;

interface FinalExamCardProps {
  finalExam: FinalExam;
  courseId: string;
}

const FinalExamCard: React.FC<FinalExamCardProps> = ({ finalExam, courseId }) => {
  const router = useRouter();

  const handleStartExam = () => {
    router.push(`/course/${courseId}/test/${finalExam.id}`);
  };

  const getStatusColor = () => {
    if (!finalExam.isAvailable) return 'red';
    return 'green';
  };

  const getStatusText = () => {
    if (!finalExam.isAvailable) return 'Locked';
    return 'Ready';
  };

  const getProgressPercentage = () => {
    if (finalExam.totalTopicExams === 0) return 0;
    return (finalExam.completedTopicExams / finalExam.totalTopicExams) * 100;
  };

  return (
    <Card
      className={`mb-6 hover:shadow-lg transition-shadow ${
        !finalExam.isAvailable ? 'opacity-60' : ''
      }`}
      style={{ borderRadius: '12px', border: '2px solid #1890ff' }}
    >
      <div className='flex justify-between items-start mb-4'>
        <div className='flex-1'>
          <div className='flex items-center gap-2 mb-2'>
            <Title level={4} className='mb-0'>
              {finalExam.title}
            </Title>
            <Tag color={getStatusColor()}>{getStatusText()}</Tag>
            <Tag color={getExamTypeColor('final_exam')}>{getExamTypeLabel('final_exam')}</Tag>
            <Tag color='purple'>Certificate Required</Tag>
          </div>

          <Text type='secondary' className='block mb-3'>
            {finalExam.description}
          </Text>

          <Row gutter={16} className='mb-3'>
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
                value={finalExam.questionCount}
                prefix={<CheckCircleOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic title='Passing Score' value={finalExam.passingScore} suffix='%' />
            </Col>
            <Col span={6}>
              <Statistic
                title='Topic Exams'
                value={finalExam.completedTopicExams}
                suffix={`/ ${finalExam.totalTopicExams}`}
                valueStyle={{
                  color: finalExam.isAllTopicExamsCompleted ? '#52c41a' : '#faad14',
                }}
                prefix={<StarOutlined />}
              />
            </Col>
          </Row>

          <div className='mb-3'>
            <Text strong>Topic Exams Progress:</Text>
            <Progress
              percent={Math.round(getProgressPercentage())}
              status={finalExam.isAllTopicExamsCompleted ? 'success' : 'active'}
              strokeColor={finalExam.isAllTopicExamsCompleted ? '#52c41a' : '#1890ff'}
            />
          </div>

          {!finalExam.isAvailable && (
            <Alert
              message='Prerequisites Required'
              description={`You must complete all ${finalExam.totalTopicExams} topic exams before taking the final exam. Currently completed: ${finalExam.completedTopicExams}/${finalExam.totalTopicExams}.`}
              type='warning'
              showIcon
              className='mb-3'
            />
          )}

          {finalExam.isAvailable && (
            <Alert
              message='Ready for Final Exam'
              description='Congratulations! You have completed all topic exams. You can now take the final exam to earn your certificate.'
              type='success'
              showIcon
              className='mb-3'
            />
          )}
        </div>

        <div className='flex flex-col gap-2'>
          {finalExam.isAvailable ? (
            <Button
              type='primary'
              icon={<TrophyOutlined />}
              onClick={handleStartExam}
              size='large'
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
              Start Final Exam
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
          <Text type='secondary'>Complete this exam to earn your course certificate</Text>
        </div>

        <div className='flex items-center gap-2'>
          {finalExam.shuffleQuestions && <Tag color='purple'>Shuffled Questions</Tag>}
          {finalExam.shuffleAnswers && <Tag color='purple'>Shuffled Answers</Tag>}
        </div>
      </div>
    </Card>
  );
};

export default FinalExamCard;
