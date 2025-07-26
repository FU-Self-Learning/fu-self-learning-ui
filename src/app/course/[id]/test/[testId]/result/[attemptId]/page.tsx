'use client';

import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  Button,
  Typography,
  Row,
  Col,
  Statistic,
  Progress,
  Tag,
  Alert,
  Divider,
  Spin,
} from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { getTestResult } from '@/shared/api/test.api';
import { TestResultSummary } from '@/components/test';

const { Title, Text } = Typography;

const TestResultPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id: courseId, testId, attemptId } = params;

  const {
    data: result,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['test-result', attemptId],
    queryFn: () => getTestResult(Number(attemptId)),
    enabled: !!attemptId,
  });

  const handleBackToCourse = () => {
    router.push(`/course/${courseId}`);
  };

  const handleRetakeTest = () => {
    router.push(`/course/${courseId}`);
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Spin size='large' />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Alert
          message='Error loading test results'
          description='Unable to load your test results. Please try again.'
          type='error'
          action={
            <Button type='primary' onClick={handleBackToCourse}>
              Back to Course
            </Button>
          }
        />
      </div>
    );
  }

  const { id, status, score, correctAnswers, totalQuestions, timeSpent, isPassed, testTitle } =
    result;

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <Button icon={<ArrowLeftOutlined />} onClick={handleBackToCourse} className='mb-4'>
            Back to Course
          </Button>
          <Title level={2} className='text-center mb-2'>
            Test Results
          </Title>
          <Text className='text-center block text-gray-600'>{testTitle}</Text>
        </div>

        {/* Main Result Card */}
        <Card className='shadow-xl border-0 mb-6'>
          <Row gutter={24}>
            <Col span={6}>
              <div className='text-center'>
                <div className='text-6xl font-bold mb-2'>{score ? Math.round(score) : 0}%</div>
                <Progress
                  type='circle'
                  percent={score || 0}
                  strokeColor={isPassed ? '#52c41a' : '#ff4d4f'}
                  size={120}
                  format={(percent) => (
                    <div className='text-center'>
                      <div className='text-2xl font-bold'>{percent}%</div>
                      <div className='text-sm text-gray-500'>{isPassed ? 'PASSED' : 'FAILED'}</div>
                    </div>
                  )}
                />
              </div>
            </Col>

            <Col span={18}>
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title='Correct Answers'
                    value={correctAnswers}
                    suffix={`/ ${totalQuestions}`}
                    prefix={<CheckCircleOutlined className='text-green-500' />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title='Time Spent'
                    value={timeSpent ? Math.floor(timeSpent / 60) : 0}
                    suffix='minutes'
                    prefix={<ClockCircleOutlined className='text-blue-500' />}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title='Test ID'
                    value={id}
                    prefix={<TrophyOutlined className='text-orange-500' />}
                  />
                </Col>
              </Row>

              <Divider />

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Text strong>Status: </Text>
                  <Tag color='blue' className='capitalize'>
                    {status}
                  </Tag>
                </div>
                <div>
                  <Text strong>Accuracy: </Text>
                  <Text>{Math.round((correctAnswers / totalQuestions) * 100)}%</Text>
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Action Buttons */}
        <div className='flex justify-center gap-4 mb-6'>
          <Button
            type='primary'
            size='large'
            icon={<FileTextOutlined />}
            onClick={() =>
              router.push(`/course/${courseId}/test/${testId}/result/${attemptId}/answers`)
            }
          >
            View Detailed Answers
          </Button>
          <Button size='large' icon={<ReloadOutlined />} onClick={handleRetakeTest}>
            Retake Test
          </Button>
        </div>

        {/* Summary Cards */}
        <TestResultSummary result={result} />
      </div>
    </div>
  );
};

export default TestResultPage;
