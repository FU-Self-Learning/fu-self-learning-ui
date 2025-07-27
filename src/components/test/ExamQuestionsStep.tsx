import React from 'react';
import { Card, Button, Typography } from 'antd';
import { BulbOutlined } from '@ant-design/icons';
import QuestionEditor from './QuestionEditor';

const { Title, Text } = Typography;

export interface ExamQuestionsStepProps {
  questions: any[];
  topics: any[];
  addQuestion: () => void;
  removeQuestion: (index: number) => void;
  updateQuestion: (index: number, field: string | null, value: any) => void;
  addChoice: (questionIndex: number) => void;
  removeChoice: (questionIndex: number, choiceIndex: number) => void;
  updateChoice: (questionIndex: number, choiceIndex: number, value: string) => void;
  toggleCorrectAnswer: (questionIndex: number, choice: string, checked: boolean) => void;
  generateErrors: Record<number, string>;
  handleRetryGenerate: (topicId: number) => void;
  autoGenerate: boolean;
  isGeneratingQuestions: boolean;
  formData: any;
}

const ExamQuestionsStep: React.FC<ExamQuestionsStepProps> = ({
  questions,
  topics,
  addQuestion,
  removeQuestion,
  updateQuestion,
  addChoice,
  removeChoice,
  updateChoice,
  toggleCorrectAnswer,
  generateErrors,
  handleRetryGenerate,
  autoGenerate,
  isGeneratingQuestions,
  formData,
}) => (
  <div>
    {autoGenerate && isGeneratingQuestions ? (
      <Card className='shadow-lg border-0 rounded-xl text-center'>
        <BulbOutlined className='text-4xl text-blue-500 mb-2' />
        <Title level={4}>Generating exam questions with AI...</Title>
      </Card>
    ) : autoGenerate && Object.keys(generateErrors).length > 0 ? (
      <>
        <Card className='shadow-lg border-0 rounded-xl text-center mb-6'>
          <Title level={4}>Some topics failed to generate exam questions</Title>
          {formData.topicIds?.map((topicId: number) =>
            generateErrors[topicId] ? (
              <div key={topicId} className='mb-4'>
                <Text type='danger'>
                  Topic: {topics.find((t) => t.id === topicId)?.title || topicId} -{' '}
                  {generateErrors[topicId]}
                </Text>
                <Button
                  type='primary'
                  onClick={() => handleRetryGenerate(topicId)}
                  className='ml-2'
                >
                  Retry
                </Button>
              </div>
            ) : null,
          )}
        </Card>
        <QuestionEditor
          questions={questions}
          topics={topics}
          addQuestion={addQuestion}
          removeQuestion={removeQuestion}
          updateQuestion={updateQuestion}
          addChoice={addChoice}
          removeChoice={removeChoice}
          updateChoice={updateChoice}
          toggleCorrectAnswer={toggleCorrectAnswer}
        />
      </>
    ) : (
      <QuestionEditor
        questions={questions}
        topics={topics}
        addQuestion={addQuestion}
        removeQuestion={removeQuestion}
        updateQuestion={updateQuestion}
        addChoice={addChoice}
        removeChoice={removeChoice}
        updateChoice={updateChoice}
        toggleCorrectAnswer={toggleCorrectAnswer}
      />
    )}
  </div>
);

export default ExamQuestionsStep;
