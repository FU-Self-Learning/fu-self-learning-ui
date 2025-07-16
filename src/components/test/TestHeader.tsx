import { Card, Typography, Progress, Row, Col } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface TestHeaderProps {
  testTitle: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  timeLeft: number;
  answeredCount: number;
  progress: number;
}

const TestHeader = ({
  testTitle,
  currentQuestionIndex,
  totalQuestions,
  timeLeft,
  answeredCount,
  progress,
}: TestHeaderProps) => {
  return (
    <div className='bg-white/95 backdrop-blur-sm shadow-xl border-b border-gray-200/50 sticky top-0 z-10'>
      <div className='max-w-7xl mx-auto px-6 py-6'>
        <Row justify='space-between' align='middle'>
          <Col>
            <div className='space-y-1'>
              <Title
                level={3}
                className='mb-0 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
              >
                {testTitle}
              </Title>
              <Text type='secondary' className='text-base'>
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </Text>
            </div>
          </Col>
          <Col>
            <div className='flex items-center gap-8'>
              {/* Timer Card */}
              <Card
                className={`shadow-lg border-0 ${timeLeft < 300000 ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}
                styles={{ body: { padding: '16px 20px' } }}
              >
                <div className='flex items-center gap-3'>
                  <div
                    className={`p-2 rounded-full ${timeLeft < 300000 ? 'bg-red-100' : 'bg-blue-100'}`}
                  >
                    <ClockCircleOutlined
                      className={`text-lg ${timeLeft < 300000 ? 'text-red-600' : 'text-blue-600'}`}
                    />
                  </div>
                  <div>
                    <Text className='text-xs uppercase font-semibold text-gray-500'>
                      Time Remaining
                    </Text>
                    <div
                      className={`text-2xl font-bold ${timeLeft < 300000 ? 'text-red-600' : 'text-blue-600'}`}
                    >
                      {Math.floor(timeLeft / 60000)}:
                      {String(Math.floor((timeLeft % 60000) / 1000)).padStart(2, '0')}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Progress Card */}
              <Card
                className='shadow-lg border-0 bg-green-50 border-green-200'
                styles={{ body: { padding: '16px 20px' } }}
              >
                <div className='flex items-center gap-3'>
                  <div className='p-2 bg-green-100 rounded-full'>
                    <CheckCircleOutlined className='text-lg text-green-600' />
                  </div>
                  <div>
                    <Text className='text-xs uppercase font-semibold text-gray-500'>Progress</Text>
                    <div className='text-2xl font-bold text-green-600'>
                      {answeredCount}/{totalQuestions}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </Col>
        </Row>

        <Progress
          percent={progress}
          strokeColor={{
            '0%': '#3b82f6',
            '50%': '#8b5cf6',
            '100%': '#10b981',
          }}
          trailColor='#e5e7eb'
          size={8}
          className='mt-6'
        />
      </div>
    </div>
  );
};

export default TestHeader;
