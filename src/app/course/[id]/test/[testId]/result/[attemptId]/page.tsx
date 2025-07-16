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
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { getTestResult } from '@/shared/api/test.api';

const { Title, Text } = Typography;

const TestResultPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id: courseId, testId, attemptId } = params;
  console.log(testId);

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

  const {
    id,
    status,
    startedAt,
    completedAt,
    score,
    correctAnswers,
    totalQuestions,
    timeSpent,
    isPassed,
    testTitle,
  } = result;

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      {/* Header */}
      <div className='bg-white shadow-lg border-b'>
        <div className='max-w-6xl mx-auto px-4 py-6'>
          <div className='flex items-center justify-between'>
            <div>
              <Button
                type='text'
                icon={<ArrowLeftOutlined />}
                onClick={handleBackToCourse}
                className='mb-2'
              >
                Back to Course
              </Button>
              <Title level={2} className='mb-0'>
                Test Results: {testTitle}
              </Title>
              <Text type='secondary'>
                {completedAt
                  ? `Completed on ${new Date(completedAt).toLocaleDateString()}`
                  : 'In Progress'}
              </Text>
            </div>
            <div className='text-right'>
              <div className='mb-2'>
                <Tag color={isPassed ? 'success' : 'error'} className='text-lg px-4 py-2'>
                  {isPassed ? 'PASSED' : 'FAILED'}
                </Tag>
                <Tag color='blue' className='ml-2 capitalize'>
                  {status}
                </Tag>
              </div>
              <Text strong className='text-2xl'>
                {score || 0}%
              </Text>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-6xl mx-auto px-4 py-8'>
        {/* Results Overview */}
        <Card className='!mb-8 shadow-lg'>
          <Row gutter={32}>
            <Col span={6}>
              <div className='text-center'>
                <div className='mb-4'>
                  <Progress
                    type='line'
                    percent={score || 0}
                    strokeColor={isPassed ? '#52c41a' : '#ff4d4f'}
                    size={{ height: 8, width: 120 }}
                    format={() => (
                      <div className='text-center'>
                        <div className='text-2xl font-bold'>{score || 0}%</div>
                        <div className='text-sm text-gray-500'>Score</div>
                      </div>
                    )}
                  />
                </div>
                <Tag color={isPassed ? 'success' : 'error'} className='text-lg px-3 py-1'>
                  {isPassed ? 'PASSED' : 'FAILED'}
                </Tag>
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

        <Card title='Performance Summary' className='!mb-8 shadow-lg'>
          <Alert
            message={
              isPassed
                ? '🎉 Congratulations! You passed the test!'
                : '📚 Keep studying! You can retake the test to improve your score.'
            }
            type={isPassed ? 'success' : 'info'}
            showIcon
            className='!mb-4'
          />

          <div className='grid grid-cols-3 gap-4 text-center'>
            <div className='p-4 bg-green-50 rounded-lg'>
              <div className='text-2xl font-bold text-green-600'>{correctAnswers}</div>
              <div className='text-sm text-gray-600'>Correct</div>
            </div>
            <div className='p-4 bg-red-50 rounded-lg'>
              <div className='text-2xl font-bold text-red-600'>
                {totalQuestions - correctAnswers}
              </div>
              <div className='text-sm text-gray-600'>Incorrect</div>
            </div>
            <div className='p-4 bg-blue-50 rounded-lg'>
              <div className='text-2xl font-bold text-blue-600'>
                {Math.round((correctAnswers / totalQuestions) * 100)}%
              </div>
              <div className='text-sm text-gray-600'>Accuracy</div>
            </div>
          </div>
        </Card>

        {/* Test Details */}
        <Card title='Test Details' className='shadow-lg !mb-8'>
          <div className='grid grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <div>
                <Text strong className='text-gray-700'>
                  Test Title:
                </Text>
                <div className='text-lg'>{testTitle}</div>
              </div>
              <div>
                <Text strong className='text-gray-700'>
                  Started At:
                </Text>
                <div className='text-lg'>{new Date(startedAt).toLocaleString()}</div>
              </div>
              <div>
                <Text strong className='text-gray-700'>
                  Status:
                </Text>
                <div className='text-lg'>
                  <Tag color='blue' className='capitalize'>
                    {status}
                  </Tag>
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <div>
                <Text strong className='text-gray-700'>
                  Final Score:
                </Text>
                <div
                  className='text-lg font-bold'
                  style={{ color: isPassed ? '#52c41a' : '#ff4d4f' }}
                >
                  {score || 0}%
                </div>
              </div>
              <div>
                <Text strong className='text-gray-700'>
                  Completed At:
                </Text>
                <div className='text-lg'>
                  {completedAt ? new Date(completedAt).toLocaleString() : 'Not completed'}
                </div>
              </div>
              <div>
                <Text strong className='text-gray-700'>
                  Total Time:
                </Text>
                <div className='text-lg'>
                  {timeSpent
                    ? `${Math.floor(timeSpent / 60)} minutes ${timeSpent % 60} seconds`
                    : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className='text-center space-x-4'>
          <Button size='large' onClick={handleBackToCourse}>
            Back to Course
          </Button>
          <Button type='primary' size='large' icon={<ReloadOutlined />} onClick={handleRetakeTest}>
            Retake Test
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestResultPage;
