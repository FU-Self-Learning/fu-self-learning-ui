import { Card, Row, Col, Statistic, Tag, Alert } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import { TestResult } from '@/types/testType';

interface TestResultSummaryProps {
  result: TestResult;
}

const TestResultSummary = ({ result }: TestResultSummaryProps) => {
  const { score, correctAnswers, totalQuestions, timeSpent, isPassed, status } = result;

  return (
    <>
      <Card className='shadow-lg border-0 !mb-6'>
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
            <div className='text-2xl font-bold text-red-600'>{totalQuestions - correctAnswers}</div>
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

      <Card title='Test Information' className='shadow-lg border-0'>
        <Row gutter={16}>
          <Col span={12}>
            <div className='space-y-2'>
              <div>
                <Statistic
                  title='Final Score'
                  value={score || 0}
                  suffix='%'
                  valueStyle={{ color: isPassed ? '#3f8600' : '#cf1322' }}
                  prefix={<TrophyOutlined className='text-orange-500' />}
                />
              </div>
              <div>
                <Statistic
                  title='Time Spent'
                  value={timeSpent ? Math.floor(timeSpent / 60) : 0}
                  suffix='minutes'
                  prefix={<ClockCircleOutlined className='text-blue-500' />}
                />
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className='space-y-2'>
              <div>
                <Statistic
                  title='Correct Answers'
                  value={correctAnswers}
                  suffix={`/ ${totalQuestions}`}
                  prefix={<CheckCircleOutlined className='text-green-500' />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </div>
              <div>
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-gray-600'>Status:</span>
                  <Tag color='blue' className='capitalize'>
                    {status}
                  </Tag>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default TestResultSummary;
