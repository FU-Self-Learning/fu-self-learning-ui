import { Card, List, Empty } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { TestResultDetail } from '@/types/testType';
import TestAnswerItem from './TestAnswerItem';

interface TestAnswersSectionProps {
  resultDetail: TestResultDetail;
}

const TestAnswersSection = ({ resultDetail }: TestAnswersSectionProps) => {
  const wrongAnswers = resultDetail.answers.filter((answer) => !answer.isCorrect);
  const correctAnswers = resultDetail.answers.filter((answer) => answer.isCorrect);

  return (
    <>
      {/* Wrong Answers Section */}
      {wrongAnswers.length > 0 && (
        <Card
          title={
            <div className='flex items-center gap-2 text-red-600'>
              <CloseCircleOutlined />
              Wrong Answers ({wrongAnswers.length})
            </div>
          }
          className='shadow-lg border-red-200 !mb-6'
        >
          <List
            dataSource={wrongAnswers}
            renderItem={(answer, index) => (
              <TestAnswerItem key={answer.id} answer={answer} index={index} isWrongAnswer={true} />
            )}
          />
        </Card>
      )}

      {/* Correct Answers Section */}
      {correctAnswers.length > 0 && (
        <Card
          title={
            <div className='flex items-center gap-2 text-green-600'>
              <CheckCircleOutlined />
              Correct Answers ({correctAnswers.length})
            </div>
          }
          className='shadow-lg border-green-200 mb-6'
        >
          <List
            dataSource={correctAnswers}
            renderItem={(answer, index) => (
              <TestAnswerItem key={answer.id} answer={answer} index={index} isWrongAnswer={false} />
            )}
          />
        </Card>
      )}

      {wrongAnswers.length === 0 && correctAnswers.length === 0 && (
        <Card className='shadow-lg border-0'>
          <Empty description='No answers found for this test' />
        </Card>
      )}
    </>
  );
};

export default TestAnswersSection;
