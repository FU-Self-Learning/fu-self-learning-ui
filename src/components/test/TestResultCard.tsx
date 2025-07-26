import { useState } from 'react';
import { Button, Card, Tag, Typography, Row, Col, Statistic, Progress, Modal, Alert } from 'antd';
import { EyeOutlined, FileTextOutlined } from '@ant-design/icons';
import { TestResult } from '@/types/testType';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

interface TestResultCardProps {
  result: TestResult;
  courseId: string;
}

const TestResultCard = ({ result, courseId }: TestResultCardProps) => {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);
  const timeSpent = result.timeSpent
    ? Math.floor(result.timeSpent / 60)
    : Math.floor((Date.now() - new Date(result.startedAt).getTime()) / 60000);

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
            <div className='flex flex-col gap-2'>
              <Button icon={<EyeOutlined />} onClick={() => setShowDetails(true)}>
                View Details
              </Button>
              <Button
                type='primary'
                icon={<FileTextOutlined />}
                onClick={() =>
                  router.push(
                    `/course/${courseId}/test/${result.testId}/result/${result.id}/answers`,
                  )
                }
              >
                View Answers
              </Button>
            </div>
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
                <div className='text-lg'>{timeSpent ? `${timeSpent} minutes` : 'N/A'}</div>
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

export default TestResultCard;
