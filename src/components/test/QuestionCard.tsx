import { Card, Typography, Radio, Checkbox, Button } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, SendOutlined } from '@ant-design/icons';
import { QuizQuestion } from '@/types/testType';

const { Title, Text } = Typography;

interface QuestionAnswer {
  questionId: number;
  selectedAnswers: string[];
  timeSpent: number;
}

interface QuestionCardProps {
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  answers: Record<number, QuestionAnswer>;
  isTestActive: boolean;
  onAnswerChange: (questionId: number, selectedAnswers: string[]) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

const QuestionCard = ({
  question,
  questionIndex,
  totalQuestions,
  answers,
  isTestActive,
  onAnswerChange,
  onPrevious,
  onNext,
  onSubmit,
  canGoPrevious,
  canGoNext,
}: QuestionCardProps) => {
  const isLastQuestion = questionIndex === totalQuestions - 1;
  console.log(isLastQuestion);

  return (
    <Card
      className='shadow-xl border-0 bg-white/90 backdrop-blur-sm'
      styles={{ body: { padding: '40px' } }}
    >
      {/* Question Header */}
      <div className='mb-8 pb-6 border-b border-gray-100'>
        <div className='flex items-center justify-between mb-4'>
          <Title level={2} className='mb-0 text-gray-800'>
            Question {questionIndex + 1}
          </Title>
          <div className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200'>
            <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
            <Text className='text-sm font-medium text-blue-700'>
              {question.correct_answer?.length === 1 ? 'Single Choice' : 'Multiple Choice'}
            </Text>
          </div>
        </div>
        <div className='bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200'>
          <Text className='text-xl leading-relaxed text-gray-800 font-medium'>
            {question.question_text}
          </Text>
        </div>
      </div>

      {/* Answer Choices */}
      <div className='space-y-4 mb-8'>
        {question.correct_answer?.length === 1 ? (
          // Single choice question
          <Radio.Group
            value={answers[question.id]?.selectedAnswers[0]}
            onChange={(e) => onAnswerChange(question.id, [e.target.value])}
            disabled={!isTestActive}
            className='w-full'
          >
            <div className='space-y-4'>
              {question.choices.map((choice: string, index: number) => {
                const isSelected = answers[question.id]?.selectedAnswers[0] === choice;
                const optionLabel = String.fromCharCode(65 + index); // A, B, C, D

                return (
                  <div key={index} className='relative'>
                    <Radio
                      value={choice}
                      className={`
                        w-full p-6 transition-all duration-200
                        ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 shadow-lg'
                            : 'border-gray-200 bg-white hover:border-blue-300 '
                        }
                      `}
                    >
                      <div className='flex items-center gap-4'>
                        <div
                          className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                          ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}
                        `}
                        >
                          {optionLabel}
                        </div>
                        <span className='text-lg text-gray-800'>{choice}</span>
                      </div>
                    </Radio>
                  </div>
                );
              })}
            </div>
          </Radio.Group>
        ) : (
          // Multiple choice question
          <Checkbox.Group
            value={answers[question.id]?.selectedAnswers || []}
            onChange={(values) => onAnswerChange(question.id, values as string[])}
            disabled={!isTestActive}
            className='w-full'
          >
            <div className='space-y-4'>
              {question.choices.map((choice: string, index: number) => {
                const isSelected = (answers[question.id]?.selectedAnswers || []).includes(choice);
                const optionLabel = String.fromCharCode(65 + index); // A, B, C, D

                return (
                  <div key={index} className='relative'>
                    <Checkbox
                      value={choice}
                      className={`
                        w-full p-6 transition-all duration-200
                        ${isSelected ? '' : 'border-gray-200 bg-white hover:bg-black-50/50'}
                      `}
                    >
                      <div className='flex items-center gap-4'>
                        <div
                          className={`
                          w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
                          ${isSelected ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'}
                        `}
                        >
                          {optionLabel}
                        </div>
                        <span className='text-lg text-gray-800'>{choice}</span>
                      </div>
                    </Checkbox>
                  </div>
                );
              })}
            </div>
          </Checkbox.Group>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className='flex justify-between pt-8 border-t border-gray-100'>
        <Button
          size='large'
          disabled={!canGoPrevious || !isTestActive}
          onClick={onPrevious}
          icon={<ArrowLeftOutlined />}
          className='h-12 px-8 border-2 border-gray-300 hover:border-blue-400 hover:text-blue-600 disabled:opacity-50'
        >
          Previous
        </Button>

        <div className='flex gap-4'>
          {canGoNext ? (
            <Button
              type='primary'
              size='large'
              disabled={!isTestActive}
              onClick={onNext}
              className='h-12 px-8 bg-gradient-to-r from-blue-500 to-blue-600 border-0 shadow-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50'
            >
              Next Question <ArrowRightOutlined />
            </Button>
          ) : (
            <Button
              type='primary'
              size='large'
              disabled={!isTestActive}
              onClick={onSubmit}
              icon={<SendOutlined />}
              className='h-12 px-8 bg-gradient-to-r from-green-500 to-green-600 border-0 shadow-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50'
            >
              Complete Test
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default QuestionCard;
