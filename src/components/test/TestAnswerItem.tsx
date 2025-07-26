import { Card, Tag, Typography, List } from 'antd';
import { ClockCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import { TestAnswerDetail } from '@/types/testType';

const { Text } = Typography;

interface TestAnswerItemProps {
  answer: TestAnswerDetail;
  index: number;
  isWrongAnswer?: boolean;
}

const TestAnswerItem = ({ answer, index, isWrongAnswer = false }: TestAnswerItemProps) => {
  return (
    <List.Item className='!block !p-0 mb-6'>
      <Card
        className={`${isWrongAnswer ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}
      >
        <div className='space-y-4'>
          <div className='flex items-center gap-2'>
            <Tag color={isWrongAnswer ? 'red' : 'green'}>Question {index + 1}</Tag>
            <Text strong className={`text-lg ${isWrongAnswer ? 'text-red-700' : 'text-green-700'}`}>
              {answer.questionText}
            </Text>
          </div>

          <div className='ml-4 space-y-2'>
            {answer.choices.map((choice, choiceIndex) => {
              const isSelected = answer.selectedAnswers.includes(choice);
              const isCorrect = answer.correctAnswer.includes(choice);
              const optionLabel = String.fromCharCode(65 + choiceIndex);

              return (
                <div
                  key={choiceIndex}
                  className={`p-3 rounded-lg border-2 ${
                    isCorrect
                      ? 'bg-green-100 border-green-300 text-green-800'
                      : isSelected && !isCorrect
                        ? 'bg-red-100 border-red-300 text-red-800'
                        : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className='flex items-center gap-3'>
                    <span className='font-bold text-lg'>{optionLabel}.</span>
                    <span className='text-lg'>{choice}</span>
                    {isCorrect && <Tag color='green'>Correct Answer</Tag>}
                    {isSelected && !isCorrect && <Tag color='red'>Your Answer</Tag>}
                    {isSelected && isCorrect && <Tag color='blue'>Your Answer</Tag>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className='flex items-center gap-6 text-sm text-gray-600 bg-white p-3 rounded-lg'>
            <span>
              <ClockCircleOutlined className='mr-1' />
              Time spent: {Math.floor(answer.timeSpent / 60)}m {answer.timeSpent % 60}s
            </span>
            <span>
              <FileTextOutlined className='mr-1' />
              Answered at: {new Date(answer.answeredAt).toLocaleString()}
            </span>
          </div>
        </div>
      </Card>
    </List.Item>
  );
};

export default TestAnswerItem;
