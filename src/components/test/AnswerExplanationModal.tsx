import { useState } from 'react';
import { Modal, Button, Typography, Card, Spin, Alert, Divider, Tag } from 'antd';
import {
  RobotOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useAnswerExplanation } from '@/hooks/test/useAnswerExplanation';
import { TestAnswerDetail } from '@/types/testType';

const { Title, Text, Paragraph } = Typography;

interface AnswerExplanationModalProps {
  answer: TestAnswerDetail;
  visible: boolean;
  onClose: () => void;
}

const AnswerExplanationModal = ({ answer, visible, onClose }: AnswerExplanationModalProps) => {
  const [explanation, setExplanation] = useState<any>(null);
  const [hasRequested, setHasRequested] = useState(false);

  const explanationMutation = useAnswerExplanation();

  const handleGetExplanation = async () => {
    if (hasRequested) return;

    setHasRequested(true);
    try {
      const result = await explanationMutation.mutateAsync({
        questionText: answer.questionText,
        choices: answer.choices,
        correctAnswers: answer.correctAnswer,
        selectedAnswers: answer.selectedAnswers,
        isCorrect: answer.isCorrect,
      });
      setExplanation(result);
    } catch (error) {
      console.error('Failed to get explanation:', error);
    }
  };

  const handleClose = () => {
    onClose();
    setExplanation(null);
    setHasRequested(false);
  };

  return (
    <Modal
      title={
        <div className='flex items-center gap-2'>
          <RobotOutlined className='text-blue-500' />
          <span>AI Answer Explanation</span>
        </div>
      }
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={800}
    >
      <div className='space-y-4'>
        {/* Question Display */}
        <Card className='bg-gray-50'>
          <div className='space-y-3'>
            <div className='flex items-center gap-2'>
              <Tag color={answer.isCorrect ? 'green' : 'red'}>
                {answer.isCorrect ? 'CORRECT' : 'INCORRECT'}
              </Tag>
              <Text strong className='text-lg'>
                {answer.questionText}
              </Text>
            </div>

            <div className='ml-4 space-y-2'>
              {answer.choices.map((choice, index) => {
                const isSelected = answer.selectedAnswers.includes(choice);
                const isCorrect = answer.correctAnswer.includes(choice);
                const optionLabel = String.fromCharCode(65 + index);

                return (
                  <div
                    key={index}
                    className={`p-2 rounded border ${
                      isCorrect
                        ? 'bg-green-100 border-green-300 text-green-800'
                        : isSelected && !isCorrect
                          ? 'bg-red-100 border-red-300 text-red-800'
                          : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className='flex items-center gap-2'>
                      <span className='font-bold'>{optionLabel}.</span>
                      <span>{choice}</span>
                      {isCorrect && <CheckCircleOutlined className='text-green-500' />}
                      {isSelected && !isCorrect && <CloseCircleOutlined className='text-red-500' />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* AI Explanation */}
        {!hasRequested && (
          <div className='text-center py-8'>
            <RobotOutlined className='text-4xl text-blue-500 mb-4' />
            <Title level={4}>Would you like AI to explain this answer?</Title>
            <Text type='secondary' className='block mb-4'>
              AI will analyze and provide detailed explanation about why the answer is
              correct/incorrect, along with learning tips.
            </Text>
            <Button
              type='primary'
              size='large'
              icon={<RobotOutlined />}
              onClick={handleGetExplanation}
              loading={explanationMutation.isPending}
            >
              Get AI Explanation
            </Button>
          </div>
        )}

        {explanationMutation.isPending && (
          <div className='text-center py-8'>
            <Spin size='large' />
            <div className='mt-4'>
              <Text>AI is analyzing and generating explanation...</Text>
            </div>
          </div>
        )}

        {explanationMutation.isError && (
          <Alert
            message='Error generating explanation'
            description='Unable to generate AI explanation at this time. Please try again later.'
            type='error'
            showIcon
          />
        )}

        {explanation && (
          <div className='space-y-4'>
            <Divider>Detailed Explanation</Divider>

            {/* Explanation */}
            <Card title='Explanation' className='!border-blue-200 !mb-4'>
              <Paragraph className='text-gray-700 leading-relaxed'>
                {explanation.explanation}
              </Paragraph>
            </Card>

            <Card title='Why is the correct answer right?' className='!border-green-200 !mb-4'>
              <Paragraph className='text-gray-700 leading-relaxed'>
                {explanation.whyCorrect}
              </Paragraph>
            </Card>

            {!answer.isCorrect && explanation.whyWrong && (
              <Card title='Why is your answer wrong?' className='!border-red-200 !mb-4'>
                <Paragraph className='text-gray-700 leading-relaxed'>
                  {explanation.whyWrong}
                </Paragraph>
              </Card>
            )}

            <Card
              title={
                <div className='flex items-center gap-2'>
                  <BulbOutlined className='!text-yellow-500' />
                  <span>Learning Tip</span>
                </div>
              }
              className='!border-yellow-200 !bg-yellow-50 !mb-4'
            >
              <Paragraph className='text-gray-700 leading-relaxed'>
                {explanation.learningTip}
              </Paragraph>
            </Card>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AnswerExplanationModal;
