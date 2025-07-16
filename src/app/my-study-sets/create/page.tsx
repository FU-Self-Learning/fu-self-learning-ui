'use client';

import React, { useState } from 'react';
import { Card, Steps, Button, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import StudySetCreateForm from '@/components/studySet/StudySetCreateForm';

const { Title, Text } = Typography;

const CreateStudySetPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

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

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4'>
        <div className='mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <Title level={2} className='mb-2'>
                Create New Study Set
              </Title>
              <Text className='text-gray-600'>
                Create flashcards to help you study and memorize information effectively
              </Text>
            </div>
            <Button onClick={handleBack} size='large'>
              Cancel
            </Button>
          </div>
        </div>

        <Card className='mb-6'>
          <Steps current={currentStep} onChange={handleStepChange} items={steps} className='mb-4' />
        </Card>

        <StudySetCreateForm
          currentStep={currentStep}
          onStepChange={handleStepChange}
          onCancel={handleBack}
        />
      </div>
    </div>
  );
};

export default CreateStudySetPage;
