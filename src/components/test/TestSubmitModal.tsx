import { Modal, Alert, Typography } from 'antd';
import { WarningOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface TestSubmitModalProps {
  isVisible: boolean;
  isLoading: boolean;
  totalQuestions: number;
  answeredCount: number;
  passingScore: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const TestSubmitModal = ({
  isVisible,
  isLoading,
  totalQuestions,
  answeredCount,
  passingScore,
  onConfirm,
  onCancel,
}: TestSubmitModalProps) => {
  const unansweredCount = totalQuestions - answeredCount;

  return (
    <Modal
      title={
        <div className='flex items-center gap-2'>
          <WarningOutlined className='text-orange-500' />
          Submit Test Confirmation
        </div>
      }
      open={isVisible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText='Submit Test'
      cancelText='Continue Test'
      okButtonProps={{
        loading: isLoading,
        danger: true,
      }}
    >
      <div className='space-y-4'>
        <Alert
          message='Are you sure you want to submit the test?'
          description='Once submitted, you cannot change your answers.'
          type='warning'
          className='!mb-3'
          showIcon
        />

        <div className='bg-gray-50 p-4 rounded-lg'>
          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div>
              <Text strong>Total Questions:</Text>
              <div className='text-lg'>{totalQuestions}</div>
            </div>
            <div>
              <Text strong>Answered:</Text>
              <div className='text-lg text-green-600'>{answeredCount}</div>
            </div>
            <div>
              <Text strong>Unanswered:</Text>
              <div className='text-lg text-orange-600'>{unansweredCount}</div>
            </div>
            <div>
              <Text strong>Passing Score:</Text>
              <div className='text-lg'>{passingScore}%</div>
            </div>
          </div>
        </div>

        {unansweredCount > 0 && (
          <Alert
            message={`You have ${unansweredCount} unanswered questions`}
            description='Unanswered questions will be marked as incorrect.'
            type='warning'
            showIcon
          />
        )}
      </div>
    </Modal>
  );
};

export default TestSubmitModal;
