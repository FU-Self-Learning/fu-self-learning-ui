'use client';

import { useParams } from 'next/navigation';
import { Card, Typography, Spin, Alert, List, Tag } from 'antd';
import { useExamDetail } from '@/hooks/exam/useExamDetail';

const { Title, Text } = Typography;

export default function ExamDetailPage() {
  const params = useParams();
  const { examId } = params;
  const { data: exam, isLoading, error } = useExamDetail(Number(examId));

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Spin size='large' />
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Alert
          message='Error loading exam details'
          description='Unable to load exam details. Please try again.'
          type='error'
        />
      </div>
    );
  }

  return (
    <div className='max-w-3xl mx-auto py-8 px-4'>
      <Card>
        <div className='flex justify-between items-center mb-4'>
          <Title level={2} className='mb-0'>
            {exam.title}
          </Title>
          <Tag color={exam.isActive ? 'green' : 'red'}>{exam.isActive ? 'Active' : 'Inactive'}</Tag>
        </div>
        <Text type='secondary' className='block mb-4'>
          {exam.description}
        </Text>
        <div className='grid grid-cols-2 gap-4 mb-6'>
          <div>
            <Text strong>Duration:</Text> {exam.duration} min
          </div>
          <div>
            <Text strong>Questions:</Text> {exam.totalQuestions || exam.questions?.length || 0}
          </div>
          <div>
            <Text strong>Pass Score:</Text> {exam.passingScore}%
          </div>
          <div>
            <Text strong>Type:</Text> <span className='capitalize'>{exam.type}</span>
          </div>
          <div>
            <Text strong>Shuffle Q:</Text> {exam.shuffleQuestions ? 'Yes' : 'No'}
          </div>
          <div>
            <Text strong>Created:</Text> {new Date(exam.createdAt).toLocaleString()}
          </div>
        </div>
        <Title level={4} className='mt-8 mb-4'>
          Questions
        </Title>
        <List
          dataSource={exam.questions || []}
          locale={{ emptyText: 'No questions found.' }}
          renderItem={(q, idx) => (
            <List.Item className='!block !p-0 mb-6'>
              <Card className='shadow border border-gray-100 rounded-lg' style={{ padding: 20 }}>
                <div className='flex items-center mb-2'>
                  <div className='font-semibold text-blue-600 mr-2'>Q{idx + 1}:</div>
                  <div className='text-base font-medium'>{q.question_text}</div>
                </div>
                <div className='ml-6 space-y-1'>
                  {(Array.isArray(q.choices) ? q.choices : []).map((choice, cidx) => {
                    const isCorrect =
                      Array.isArray(q.correct_answer) && q.correct_answer.includes(choice);
                    return (
                      <div key={cidx} className='flex items-center'>
                        <span
                          className={`inline-block w-6 font-bold ${isCorrect ? 'text-green-600' : 'text-gray-500'}`}
                        >
                          {String.fromCharCode(65 + cidx)}.
                        </span>
                        <span className={`ml-2 ${isCorrect ? 'text-green-700 font-semibold' : ''}`}>
                          {choice}
                        </span>
                        {isCorrect && (
                          <Tag color='green' className='ml-2'>
                            Correct
                          </Tag>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
