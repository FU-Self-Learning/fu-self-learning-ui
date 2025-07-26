'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button, Typography, Alert, Spin, Breadcrumb } from 'antd';
import { ArrowLeftOutlined, HomeOutlined, BookOutlined } from '@ant-design/icons';
import { useTestResultDetail } from '@/hooks/test/useTestResult';
import { TestAnswersSummary, TestAnswersSection, TestAIAnalysis } from '@/components/test';

const { Title, Text } = Typography;

const TestAnswersPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id: courseId, testId, attemptId } = params;

  const { data: resultDetail, isLoading, error } = useTestResultDetail(Number(attemptId));

  const handleBackToResult = () => {
    router.push(`/course/${courseId}/test/${testId}/result/${attemptId}`);
  };

  const handleBackToCourse = () => {
    router.push(`/course/${courseId}`);
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Spin size='large' />
      </div>
    );
  }

  if (error || !resultDetail) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Alert
          message='Error loading test answers'
          description='Unable to load your test answers. Please try again.'
          type='error'
          action={
            <Button type='primary' onClick={handleBackToCourse}>
              Back to Course
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6'>
      <div className='max-w-6xl mx-auto'>
        {/* Breadcrumb */}
        <Breadcrumb
          className='mb-6'
          items={[
            {
              title: (
                <Button type='link' icon={<HomeOutlined />} onClick={handleBackToCourse}>
                  Course
                </Button>
              ),
            },
            {
              title: (
                <Button type='link' icon={<BookOutlined />} onClick={handleBackToResult}>
                  Test Result
                </Button>
              ),
            },
            {
              title: <div className='ml-2 mt-1'>Detailed Answers</div>,
            },
          ]}
        />

        {/* Header */}
        <div className='mb-8'>
          <Button icon={<ArrowLeftOutlined />} onClick={handleBackToResult} className='mb-4'>
            Back to Results
          </Button>
          <Title level={2} className='text-center mb-2'>
            Test Answers Review
          </Title>
          <Text className='text-center block text-gray-600'>{resultDetail.testTitle}</Text>
        </div>

        {/* AI Analysis */}
        <TestAIAnalysis resultDetail={resultDetail} />

        {/* Summary */}
        <TestAnswersSummary resultDetail={resultDetail} />

        {/* Answers Sections */}
        <TestAnswersSection resultDetail={resultDetail} />

        {/* Action Buttons */}
        <div className='flex justify-center gap-4 mt-8'>
          <Button
            type='primary'
            size='large'
            icon={<ArrowLeftOutlined />}
            onClick={handleBackToResult}
          >
            Back to Results
          </Button>
          <Button size='large' icon={<BookOutlined />} onClick={handleBackToCourse}>
            Back to Course
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestAnswersPage;
