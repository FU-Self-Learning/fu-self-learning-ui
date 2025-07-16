import { useState } from 'react';
import {
  Button,
  Card,
  Tag,
  Typography,
  Space,
  Row,
  Col,
  Tabs,
  Empty,
  Spin,
  Progress,
  Badge,
  Modal,
  Statistic,
  Alert,
} from 'antd';
import {
  PlayCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useTests } from '@/hooks/test/useTests';
import { useMyTestResults } from '@/hooks/test/useMyTestResults';
import { useStartTest } from '@/hooks/test/useStartTest';
import { Test, TestResult } from '@/types/testType';
import { useRouter } from 'next/navigation';
import { saveCurrentAttemptId, isLocalStorageAvailable } from '@/utils/testUtils';

const { Title, Text } = Typography;

interface TestsSectionProps {
  courseId: string;
}

interface TestCardProps {
  test: Test;
  onStartTest: (testId: number) => void;
  userResults?: TestResult[];
}

const TestCard = ({ test, onStartTest, userResults }: TestCardProps) => {
  const hasAttempted = userResults?.some((result) => result.testId === test.id);
  const lastAttempt = userResults?.find((result) => result.testId === test.id);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'practice':
        return 'blue';
      case 'quiz':
        return 'green';
      case 'midterm':
        return 'orange';
      case 'final':
        return 'red';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'practice':
        return '🎯';
      case 'quiz':
        return '📝';
      case 'midterm':
        return '📋';
      case 'final':
        return '🎓';
      default:
        return '📄';
    }
  };

  return (
    <Card className='mb-4 hover:shadow-lg transition-shadow' style={{ borderRadius: '12px' }}>
      <div className='flex justify-between items-start'>
        <div className='flex-1'>
          <div className='flex items-center gap-2 mb-2'>
            <span className='text-xl'>{getTypeIcon(test.type)}</span>
            <Title level={4} className='mb-0'>
              {test.title}
            </Title>
            <Tag color={getTypeColor(test.type)} className='capitalize'>
              {test.type}
            </Tag>
          </div>

          <Text className='text-gray-600 block mb-3'>{test.description}</Text>

          <Row gutter={16} className='mb-3'>
            <Col>
              <Space>
                <ClockCircleOutlined className='text-blue-500' />
                <Text>{test.duration} minutes</Text>
              </Space>
            </Col>
            <Col>
              <Space>
                <FileTextOutlined className='text-green-500' />
                <Text>{test.questionCount} questions</Text>
              </Space>
            </Col>
            <Col>
              <Space>
                <TrophyOutlined className='text-orange-500' />
                <Text>{test.passingScore}% to pass</Text>
              </Space>
            </Col>
          </Row>

          {hasAttempted && lastAttempt && (
            <div className='p-3 bg-gray-50 rounded-lg mb-3'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  {lastAttempt.isPassed ? (
                    <CheckCircleOutlined className='text-green-500' />
                  ) : (
                    <CloseCircleOutlined className='text-red-500' />
                  )}
                  <Text strong>Last Score: {lastAttempt.score}%</Text>
                  <Tag color={lastAttempt.isPassed ? 'success' : 'error'}>
                    {lastAttempt.isPassed ? 'Passed' : 'Failed'}
                  </Tag>
                </div>
                <Text type='secondary'>
                  {lastAttempt.completedAt
                    ? new Date(lastAttempt.completedAt).toLocaleDateString()
                    : 'In Progress'}
                </Text>
              </div>
            </div>
          )}
        </div>

        <div className='ml-4'>
          <Button
            type='primary'
            icon={<PlayCircleOutlined />}
            onClick={() => onStartTest(test.id)}
            size='large'
            className='bg-gradient-to-r from-blue-500 to-purple-500 border-0 rounded-lg'
          >
            {hasAttempted ? 'Retake Test' : 'Start Test'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

const TestResultCard = ({ result }: { result: TestResult }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <Card className='!mb-4 hover:shadow-lg transition-shadow' style={{ borderRadius: '12px' }}>
        <div className='flex justify-between items-start'>
          <div className='flex-1'>
            <div className='flex items-center gap-2 mb-2'>
              <Title level={5} className='mb-0'>
                {result.testTitle}
              </Title>
              <Tag color={result.isPassed ? 'success' : 'error'}>
                {result.isPassed ? 'Passed' : 'Failed'}
              </Tag>
              <Tag color='blue' className='capitalize'>
                {result.status === 'completed' ? 'Completed' : 'In Progress'}
              </Tag>
            </div>

            <Row gutter={16} className='mb-3'>
              <Col span={6}>
                <Statistic
                  title='Score'
                  value={result.score || 0}
                  suffix='%'
                  valueStyle={{ color: result.isPassed ? '#3f8600' : '#cf1322' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title='Correct'
                  value={result.correctAnswers}
                  suffix={`/ ${result.totalQuestions}`}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title='Time Spent'
                  value={result.timeSpent ? Math.floor(result.timeSpent / 60) : 0}
                  suffix='min'
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title='Date'
                  value={
                    result.completedAt
                      ? new Date(result.completedAt).toLocaleDateString()
                      : 'In Progress'
                  }
                />
              </Col>
            </Row>

            <Progress
              percent={result.score || 0}
              strokeColor={result.isPassed ? '#52c41a' : '#ff4d4f'}
              className='mb-2'
            />
          </div>

          {result.status === 'completed' && (
            <Button icon={<EyeOutlined />} onClick={() => setShowDetails(true)}>
              View Details
            </Button>
          )}
        </div>
      </Card>

      <Modal
        title={`Test Results: ${result.testTitle}`}
        open={showDetails}
        onCancel={() => setShowDetails(false)}
        footer={null}
        width={800}
      >
        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <Card size='small'>
              <Statistic
                title='Final Score'
                value={result.score || 0}
                suffix='%'
                valueStyle={{ color: result.isPassed ? '#3f8600' : '#cf1322' }}
              />
            </Card>
            <Card size='small'>
              <Statistic
                title='Status'
                value={result.isPassed ? 'PASSED' : 'FAILED'}
                valueStyle={{ color: result.isPassed ? '#3f8600' : '#cf1322' }}
              />
            </Card>
          </div>

          <div className='p-4 bg-gray-50 rounded-lg'>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <Text strong>Test ID:</Text>
                <div className='text-lg'>{result.testId}</div>
              </div>
              <div>
                <Text strong>Started At:</Text>
                <div className='text-lg'>{new Date(result.startedAt).toLocaleString()}</div>
              </div>
              <div>
                <Text strong>Completed At:</Text>
                <div className='text-lg'>
                  {result.completedAt
                    ? new Date(result.completedAt).toLocaleString()
                    : 'Not completed'}
                </div>
              </div>
              <div>
                <Text strong>Time Spent:</Text>
                <div className='text-lg'>
                  {result.timeSpent ? `${Math.floor(result.timeSpent / 60)} minutes` : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          <Alert
            message={
              result.isPassed
                ? '🎉 Congratulations! You passed this test!'
                : '📚 Keep studying! You can retake this test to improve your score.'
            }
            type={result.isPassed ? 'success' : 'info'}
            showIcon
          />
        </div>
      </Modal>
    </>
  );
};

const TestsSection = ({ courseId }: TestsSectionProps) => {
  const router = useRouter();
  const { data: tests, isLoading: testsLoading } = useTests(courseId);
  const { data: myResults, isLoading: resultsLoading } = useMyTestResults({
    courseId: parseInt(courseId),
  });

  const startTestMutation = useStartTest();

  const handleStartTest = async (testId: number) => {
    try {
      const response = await startTestMutation.mutateAsync({ testId });

      if (response && response.id) {
        // Save attempt ID to localStorage for reload recovery
        if (isLocalStorageAvailable()) {
          saveCurrentAttemptId(response.id);
        }

        router.push(`/course/${courseId}/test/${testId}/attempt/${response.id}`);
      } else {
        console.warn('Test started but no attempt ID returned.');
      }
    } catch (error) {
      console.error('Failed to start test:', error);
    }
  };

  const tabItems = [
    {
      key: 'available',
      label: (
        <Badge count={tests?.length || 0} showZero size='small'>
          <span>Available Tests</span>
        </Badge>
      ),
      children: (
        <div>
          {testsLoading ? (
            <div className='text-center py-8'>
              <Spin size='large' />
            </div>
          ) : tests && tests.length > 0 ? (
            tests.map((test) => (
              <TestCard
                key={test.id}
                test={test}
                onStartTest={handleStartTest}
                userResults={myResults}
              />
            ))
          ) : (
            <Empty
              description='No tests available for this course'
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </div>
      ),
    },
    {
      key: 'results',
      label: (
        <Badge count={myResults?.length || 0} showZero size='small'>
          <span>My Results</span>
        </Badge>
      ),
      children: (
        <div>
          {resultsLoading ? (
            <div className='text-center py-8'>
              <Spin size='large' />
            </div>
          ) : myResults && myResults.length > 0 ? (
            myResults.map((result) => <TestResultCard key={result.id} result={result} />)
          ) : (
            <Empty
              description="You haven't taken any tests yet"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className='mb-6'>
        <Title level={4} className='flex items-center gap-2'>
          <FileTextOutlined className='text-blue-500' />
          Course Tests
        </Title>
        <Text type='secondary'>
          Take tests to evaluate your understanding of the course material
        </Text>
      </div>

      <Tabs items={tabItems} defaultActiveKey='available' className='test-tabs' />
    </div>
  );
};

export default TestsSection;
