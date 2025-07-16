import { Card, Button, Typography } from 'antd';
import { CheckCircleOutlined, FileTextOutlined, SendOutlined } from '@ant-design/icons';
import { QuizQuestion } from '@/types/testType';

const { Text, Title } = Typography;

interface QuestionNavigatorProps {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answeredCount: number;
  isTestActive: boolean;
  isQuestionAnswered: (questionId: number) => boolean;
  onNavigateToQuestion: (index: number) => void;
  onShowSubmitModal: () => void;
}

const QuestionNavigator = ({
  questions,
  currentQuestionIndex,
  answeredCount,
  isTestActive,
  isQuestionAnswered,
  onNavigateToQuestion,
  onShowSubmitModal,
}: QuestionNavigatorProps) => {
  return (
    <div className='sticky top-32 space-y-6'>
      <Card
        className='shadow-xl border-0 bg-white/80 backdrop-blur-sm'
        styles={{ body: { padding: '24px' } }}
      >
        <div className='mb-6'>
          <Title level={5} className='text-gray-700 mb-4 flex items-center gap-2'>
            <FileTextOutlined className='text-blue-500' />
            Question Navigator
          </Title>
        </div>

        <div className='grid grid-cols-4 gap-3 mb-6'>
          {questions.map((_: any, index: number) => {
            const isAnswered = isQuestionAnswered(questions[index].id);
            const isCurrent = index === currentQuestionIndex;

            return (
              <Button
                key={index}
                size='large'
                disabled={!isTestActive}
                className={`
                  h-12 relative transition-all duration-200 border-2 font-semibold
                  ${
                    isCurrent
                      ? 'border-blue-500 bg-blue-500 text-white shadow-lg scale-105'
                      : isAnswered
                        ? 'border-green-400 text-green-700'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                  }
                  ${!isTestActive ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                onClick={() => onNavigateToQuestion(index)}
              >
                <span className='text-sm'>{index + 1}</span>
                {isAnswered && !isCurrent && (
                  <CheckCircleOutlined className='absolute -top-1 -right-1 text-green-500 bg-white rounded-full p-0.5' />
                )}
              </Button>
            );
          })}
        </div>

        <div className='space-y-4 pt-4 border-t border-gray-200'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='text-center p-3 bg-green-50 rounded-lg border border-green-200'>
              <div className='text-2xl font-bold text-green-600'>{answeredCount}</div>
              <Text className='text-xs text-green-700 font-medium'>Answered</Text>
            </div>
            <div className='text-center p-3 bg-orange-50 rounded-lg border border-orange-200'>
              <div className='text-2xl font-bold text-orange-600'>
                {questions.length - answeredCount}
              </div>
              <Text className='text-xs text-orange-700 font-medium'>Remaining</Text>
            </div>
          </div>

          <Button
            type='primary'
            size='large'
            block
            disabled={!isTestActive}
            className='h-12 bg-gradient-to-r from-red-500 to-red-600 border-0 font-semibold shadow-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50'
            icon={<SendOutlined />}
            onClick={onShowSubmitModal}
          >
            Submit Test
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default QuestionNavigator;
