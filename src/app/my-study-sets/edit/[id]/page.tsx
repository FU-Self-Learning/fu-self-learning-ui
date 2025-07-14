'use client';

import React, { useState } from 'react';
import { Card, Steps, Button, Typography, Spin } from 'antd';
import { useRouter, useParams } from 'next/navigation';
import { useStudySet } from '@/hooks/study-set/useStudySet';
import StudySetCreateForm from '@/components/studySet/StudySetCreateForm';

const { Title, Text } = Typography;

const EditStudySetPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const params = useParams();
  const studySetId = parseInt(params.id as string);

  const { data: studySet, isLoading } = useStudySet(studySetId);

  const steps = [
    {
      title: 'Basic Information',
      content: 'basic-info',
    },
    {
      title: 'Study Cards',
      content: 'study-cards',
    },
    {
      title: 'Settings & Review',
      content: 'settings',
    },
  ];

  const handleBack = () => {
    router.back();
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 py-8 flex items-center justify-center'>
        <Spin size='large' />
      </div>
    );
  }

  if (!studySet) {
    return (
      <div className='min-h-screen bg-gray-50 py-8'>
        <div className='max-w-4xl mx-auto px-4'>
          <Card>
            <div className='text-center'>
              <Title level={3}>Study Set Not Found</Title>
              <Text>
                The study set you are looking for does not exist or you don&apos;t have permission
                to edit it.
              </Text>
              <div className='mt-4'>
                <Button type='primary' onClick={() => router.push('/my-study-sets')}>
                  Back to My Study Sets
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <Title level={2} className='mb-2'>
                Edit Study Set
              </Title>
              <Text className='text-gray-600'>
                Update your study set &quot;{studySet.name}&quot;
              </Text>
            </div>
            <Button onClick={handleBack} size='large'>
              Cancel
            </Button>
          </div>
        </div>

        {/* Steps */}
        <Card className='mb-6'>
          <Steps current={currentStep} onChange={handleStepChange} items={steps} className='mb-4' />
        </Card>

        {/* Main Content */}
        <StudySetCreateForm
          currentStep={currentStep}
          onStepChange={handleStepChange}
          onCancel={handleBack}
          studySet={studySet}
        />
      </div>
    </div>
  );
};

export default EditStudySetPage;
