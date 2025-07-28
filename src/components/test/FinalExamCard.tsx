import React from 'react';
import { Card, Button, Tag, Typography, Progress, Row, Col, Statistic, Alert, Badge } from 'antd';
import {
  TrophyOutlined,
  LockOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StarOutlined,
  ReloadOutlined,
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

  const handleContinueExam = () => {
    if (finalExam.currentAttempt) {
      router.push(
        `/course/${courseId}/test/${finalExam.id}/attempt/${finalExam.currentAttempt.id}`,
      );
    }
  };

  const getStatusColor = () => {
    if (!finalExam.isAvailable) return 'red';
    if (finalExam.currentAttempt) return 'blue';
    if (finalExam.lastAttempt?.isPassed) return 'green';
    if (finalExam.lastAttempt && !finalExam.lastAttempt.isPassed) return 'orange';
    return 'green';
  };

  const getStatusText = () => {
    if (!finalExam.isAvailable) return 'Locked';
    if (finalExam.currentAttempt) return 'In Progress';
    if (finalExam.lastAttempt?.isPassed) return 'Passed';
    if (finalExam.lastAttempt && !finalExam.lastAttempt.isPassed) return 'Failed';
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

            {/* Status badges for attempt information */}
            {finalExam.currentAttempt && <Badge color='blue' text='In Progress' />}
            {!finalExam.currentAttempt && finalExam.lastAttempt?.isPassed && (
              <Badge color='green' text='Passed' />
            )}
            {!finalExam.currentAttempt &&
              finalExam.lastAttempt &&
              !finalExam.lastAttempt.isPassed && <Badge color='red' text='Failed' />}
            {!finalExam.currentAttempt && !finalExam.lastAttempt && finalExam.isAvailable && (
              <Badge color='green' text='Ready to Start' />
            )}
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

          {finalExam.isAvailable && !finalExam.currentAttempt && !finalExam.lastAttempt && (
            <Alert
              message='Ready for Final Exam'
              description='Congratulations! You have completed all topic exams. You can now take the final exam to earn your certificate.'
              type='success'
              showIcon
              className='mb-3'
            />
          )}

          {finalExam.currentAttempt && (
            <Alert
              message='Exam In Progress'
              description='You have an unfinished final exam. You can continue where you left off.'
              type='info'
              showIcon
              className='mb-3'
            />
          )}

          {finalExam.lastAttempt && (
            <Alert
              message={
                finalExam.lastAttempt.isPassed ? 'Final Exam Completed!' : 'Final Exam Failed'
              }
              description={
                finalExam.lastAttempt.isPassed
                  ? `Congratulations! You passed the final exam with ${finalExam.lastAttempt.score}%. You can now download your certificate.`
                  : `You scored ${finalExam.lastAttempt.score}% on your last attempt. You need ${finalExam.passingScore}% to pass. You can retry the exam.`
              }
              type={finalExam.lastAttempt.isPassed ? 'success' : 'warning'}
              showIcon
              className='mb-3'
            />
          )}
        </div>

        <div className='flex flex-col gap-2'>
          {!finalExam.isAvailable ? (
            <Button disabled icon={<LockOutlined />} size='large'>
              Locked
            </Button>
          ) : finalExam.currentAttempt ? (
            <Button
              type='primary'
              icon={<ClockCircleOutlined />}
              onClick={handleContinueExam}
              size='large'
              style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
            >
              Continue Exam
            </Button>
          ) : finalExam.lastAttempt?.isPassed ? (
            <Button
              type='default'
              disabled
              className='bg-green-100 border-green-300 text-green-700'
              icon={<CheckCircleOutlined />}
              size='large'
            >
              ✓ Passed
            </Button>
          ) : (
            <Button
              type='primary'
              icon={finalExam.lastAttempt ? <ReloadOutlined /> : <TrophyOutlined />}
              onClick={handleStartExam}
              size='large'
              style={{
                backgroundColor: finalExam.lastAttempt ? '#fa8c16' : '#52c41a',
                borderColor: finalExam.lastAttempt ? '#fa8c16' : '#52c41a',
              }}
            >
              {finalExam.lastAttempt ? 'Retry Final Exam' : 'Start Final Exam'}
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
