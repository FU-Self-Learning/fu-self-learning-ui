import { Button, Card, Tag, Typography, Space, Row, Col } from 'antd';
import {
  PlayCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Test, TestResult } from '@/types/testType';
import { getExamTypeLabel } from '@/utils/examTypeMapper';

const { Title, Text } = Typography;

interface TestCardProps {
  test: Test;
  onStartTest: (testId: number) => void;
  onContinueTest: (testId: number, attemptId: number) => void;
  userResults?: TestResult[];
}

const TestCard = ({ test, onStartTest, onContinueTest, userResults }: TestCardProps) => {
  const hasAttempted = userResults?.some((result) => result.testId === test.id);
  const lastAttempt = userResults?.find((result) => result.testId === test.id);
  const isInProgress = lastAttempt && !lastAttempt.completedAt;

  // Check if any test is in progress (not just this test)
  const anyTestInProgress = userResults?.some((result) => !result.completedAt);
  const isThisTestInProgress = isInProgress;
  const shouldDisable = anyTestInProgress && !isThisTestInProgress;

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
      case 'topic_exam':
        return '📝';
      case 'final_exam':
        return '🏆';
      default:
        return '📄';
    }
  };

  return (
    <Card className='!mb-4 hover:shadow-lg transition-shadow' style={{ borderRadius: '12px' }}>
      <div className='flex justify-between items-start'>
        <div className='flex-1'>
          <div className='flex items-center gap-2 mb-2'>
            <span className='text-xl'>{getTypeIcon(test.type)}</span>
            <Title level={4} className='!mb-0'>
              {test.title}
            </Title>
            <Tag color={getTypeColor(test.type)} className='capitalize'>
              {getExamTypeLabel(test.type)}
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
            icon={
              isInProgress ? (
                <ClockCircleOutlined />
              ) : hasAttempted ? (
                <ReloadOutlined />
              ) : (
                <PlayCircleOutlined />
              )
            }
            onClick={() => {
              if (isInProgress && lastAttempt) {
                onContinueTest(test.id, lastAttempt.id);
              } else {
                onStartTest(test.id);
              }
            }}
            disabled={shouldDisable}
            size='large'
            className={`${shouldDisable ? '!bg-gray-400 !cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-purple-500'} border-0 rounded-lg`}
          >
            {isInProgress ? 'Continue Test' : hasAttempted ? 'Retake Test' : 'Start Test'}
          </Button>
          {shouldDisable && (
            <div className='text-xs text-gray-500 mt-1 text-center'>
              Complete current test first
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TestCard;
