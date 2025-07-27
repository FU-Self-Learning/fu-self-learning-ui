import React from 'react';
import { Card, Typography, Tag, Badge } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export interface ExamReviewStepProps {
  formData: any;
  questions: any[];
}

const ExamReviewStep: React.FC<ExamReviewStepProps> = ({ formData, questions }) => {
  const validQuestions = questions.filter(
    (q) =>
      q.question_text.trim() &&
      q.choices.length >= 2 &&
      q.choices.every((choice: string) => choice.trim()) &&
      q.correct_answer.length > 0 &&
      q.topicId > 0,
  );

  return (
    <div className='space-y-6'>
      <Card
        className='shadow-lg border-0 rounded-xl overflow-hidden !mb-6'
        style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}
      >
        <div className='text-white'>
          <div className='flex items-center space-x-3'>
            <div className='w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center'>
              <CheckCircleOutlined className='text-2xl text-white' />
            </div>
            <div>
              <Title level={3} className='text-white mb-0'>
                Review & Publish
              </Title>
              <Text className='text-white/80'>Review your exam before publishing</Text>
            </div>
          </div>
        </div>
      </Card>
      <Card className='shadow-lg border-0 rounded-xl !mb-6'>
        <Title level={4} className='text-gray-800 mb-4'>
          📋 Exam Summary
        </Title>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
          <div className='p-3 bg-blue-50 rounded-lg'>
            <Text strong className='text-blue-700'>
              Title:
            </Text>
            <div className='text-gray-800 mt-1'>{formData.title}</div>
          </div>
          <div className='p-3 bg-purple-50 rounded-lg'>
            <Text strong className='text-purple-700'>
              Type:
            </Text>
            <Tag color='purple' className='!ml-2 capitalize'>
              {formData.type}
            </Tag>
          </div>
          <div className='p-3 bg-green-50 rounded-lg'>
            <Text strong className='text-green-700'>
              Duration:
            </Text>
            <div className='text-gray-800 mt-1'>{formData.duration} minutes</div>
          </div>
          <div className='p-3 bg-orange-50 rounded-lg'>
            <Text strong className='text-orange-700'>
              Passing Score:
            </Text>
            <div className='text-gray-800 mt-1'>{formData.passingScore}%</div>
          </div>
        </div>
        <div className='p-4 bg-gray-50 rounded-lg mb-4'>
          <Text strong className='text-gray-700'>
            Description:
          </Text>
          <Paragraph className='mt-2 mb-0 text-gray-600'>{formData.description}</Paragraph>
        </div>
        <div className='flex flex-wrap gap-2 mb-4'>
          <Text strong className='text-gray-700'>
            Settings:
          </Text>
          <Tag color={formData.shuffleQuestions ? 'blue' : 'default'}>
            🔀 Shuffle Questions: {formData.shuffleQuestions ? 'Yes' : 'No'}
          </Tag>
          <Tag color={formData.shuffleAnswers ? 'blue' : 'default'}>
            🎲 Shuffle Answers: {formData.shuffleAnswers ? 'Yes' : 'No'}
          </Tag>
        </div>
      </Card>
      <Card className='shadow-lg border-0 rounded-xl !mb-6'>
        <Title level={4} className='text-gray-800 mb-4'>
          ❓ Questions Preview
          <Badge count={validQuestions.length} className='!ml-2 !mb-1' />
        </Title>
        {validQuestions.map((question, index) => (
          <Card key={index} size='small' className='!mb-4 border border-gray-200 rounded-lg'>
            <div className='mb-3'>
              <Text strong className='text-blue-600'>
                Q{index + 1}:
              </Text>
              <Text className='ml-2 text-gray-800'>{question.question_text}</Text>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
              {question.choices.map((choice: string, cIndex: number) => (
                <div key={cIndex} className='flex items-center space-x-2'>
                  <div className='w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold'>
                    {String.fromCharCode(65 + cIndex)}
                  </div>
                  <Text
                    className={
                      question.correct_answer.includes(choice)
                        ? '!text-green-600 font-bold'
                        : 'text-gray-600'
                    }
                  >
                    {choice}
                  </Text>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </Card>
    </div>
  );
};

export default ExamReviewStep;
