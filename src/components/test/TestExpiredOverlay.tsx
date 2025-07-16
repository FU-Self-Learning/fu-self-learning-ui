import { Card, Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface TestExpiredOverlayProps {
  isVisible: boolean;
}

const TestExpiredOverlay = ({ isVisible }: TestExpiredOverlayProps) => {
  if (!isVisible) return null;

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center'>
      <Card className='shadow-2xl border-0 max-w-md mx-4'>
        <div className='text-center space-y-4'>
          <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto'>
            <ClockCircleOutlined className='text-2xl text-red-600' />
          </div>
          <Title level={3} className='text-red-600 mb-2'>
            Test Time Expired
          </Title>
          <Text className='text-gray-600'>
            The allocated time for this test has ended. Please wait while we process your
            submission.
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default TestExpiredOverlay;
