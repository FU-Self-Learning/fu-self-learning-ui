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
  Space,
} from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  FileTextOutlined,
  RobotOutlined,
  BookOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { getTestResult } from '@/shared/api/test.api';
import { getTestDetail } from '@/shared/api/test.api';
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

  const { data: testDetail, isLoading: isTestDetailLoading } = useQuery({
    queryKey: ['test-detail', testId],
    queryFn: () => getTestDetail(Number(testId)),
    enabled: !!testId,
  });

  const handleBackToCourse = () => {
    router.push(`/course/${courseId}`);
  };

  const handleRetakeTest = () => {
    router.push(`/course/${courseId}`);
  };

  const handleContinueToNextTopic = () => {
    router.push(`/course/${courseId}`);
  };

  const handleViewCourseProgress = () => {
    router.push(`/course/${courseId}`);
  };

  if (isLoading || isTestDetailLoading) {
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

  const isTopicExam = testDetail?.type === 'topic_exam';
  const isFinalExam = testDetail?.type === 'final_exam';

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
          {isTopicExam && (
            <div className='text-center mt-2'>
              <Tag color='green' icon={<BookOutlined />}>
                Topic Exam
              </Tag>
            </div>
          )}
          {isFinalExam && (
            <div className='text-center mt-2'>
              <Tag color='red' icon={<TrophyOutlined />}>
                Final Exam
              </Tag>
            </div>
          )}
        </div>

        {/* Main Result Card */}
        <Card className='shadow-xl border-0 !mb-6'>
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

        {/* Topic Exam Specific Actions */}
        {isTopicExam && (
          <Card className='shadow-lg border-0 !mb-6 bg-gradient-to-r from-green-50 to-blue-50'>
            <div className='text-center'>
              <Title level={4} className='mb-4'>
                {isPassed ? '🎉 Topic Completed!' : '📚 Keep Learning!'}
              </Title>
              <Text className='text-lg block mb-4'>
                {isPassed
                  ? 'You have successfully completed this topic exam. You can now proceed to the next topic or review your course progress.'
                  : "Don't worry! You can retry this topic exam to improve your score. Review the material and try again."}
              </Text>
              <Space size='large'>
                {isPassed ? (
                  <Button
                    type='primary'
                    size='large'
                    icon={<PlayCircleOutlined />}
                    onClick={handleContinueToNextTopic}
                    className='bg-green-600 border-green-600'
                  >
                    Continue to Next Topic
                  </Button>
                ) : (
                  <Button
                    type='primary'
                    size='large'
                    icon={<ReloadOutlined />}
                    onClick={handleRetakeTest}
                    className='bg-orange-600 border-orange-600'
                  >
                    Retry Topic Exam
                  </Button>
                )}
                <Button size='large' icon={<BookOutlined />} onClick={handleViewCourseProgress}>
                  View Course Progress
                </Button>
              </Space>
            </div>
          </Card>
        )}

        {/* Final Exam Specific Actions */}
        {isFinalExam && (
          <Card className='shadow-lg border-0 !mb-6 bg-gradient-to-r from-red-50 to-purple-50'>
            <div className='text-center'>
              <Title level={4} className='mb-4'>
                {isPassed ? '🏆 Course Completed!' : '📖 Review and Retry!'}
              </Title>
              <Text className='text-lg block mb-4'>
                {isPassed
                  ? 'Congratulations! You have successfully completed the entire course. You can now download your certificate.'
                  : 'You need to pass the final exam to complete the course. Review the course material and try again.'}
              </Text>
              <Space size='large'>
                {isPassed ? (
                  <Button
                    type='primary'
                    size='large'
                    icon={<TrophyOutlined />}
                    onClick={handleViewCourseProgress}
                    className='bg-red-600 border-red-600'
                  >
                    Download Certificate
                  </Button>
                ) : (
                  <Button
                    type='primary'
                    size='large'
                    icon={<ReloadOutlined />}
                    onClick={handleRetakeTest}
                    className='bg-red-600 border-red-600'
                  >
                    Retry Final Exam
                  </Button>
                )}
                <Button size='large' icon={<BookOutlined />} onClick={handleViewCourseProgress}>
                  Review Course
                </Button>
              </Space>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className='flex justify-center gap-4 !mb-6'>
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
          <Button
            size='large'
            icon={<RobotOutlined />}
            onClick={() =>
              router.push(`/course/${courseId}/test/${testId}/result/${attemptId}/answers`)
            }
          >
            AI Analysis
          </Button>
          {!isPassed && (
            <Button size='large' icon={<ReloadOutlined />} onClick={handleRetakeTest}>
              Retake Test
            </Button>
          )}
        </div>

        {/* Summary Cards */}
        <TestResultSummary result={result} />
      </div>
    </div>
  );
};

export default TestResultPage;
