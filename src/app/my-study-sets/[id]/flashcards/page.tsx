'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Spin, Button, Typography, Card, Alert } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useStudySet } from '@/hooks/study-set/useStudySet';
import { ManualFlashcard } from '@/hooks/study-set/useCreateManualFlashcards';
import FlashcardBuilder, { FlashcardData } from '@/components/studySet/FlashcardBuilder';
import { useReplaceAllFlashcard } from '@/hooks/study-set/useReplaceAllFlashcard';

const { Title, Text } = Typography;

const CreateFlashcardsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const studySetId = parseInt(params.id as string);

  const { data: studySet, isLoading: isLoadingStudySet } = useStudySet(studySetId);
  const { mutate: replaceFlashcards, isPending: isReplacing } = useReplaceAllFlashcard();

  const handleSave = (cards: FlashcardData[]) => {
    const flashcards: ManualFlashcard[] = cards.map((card) => ({
      front_text: card.front_text,
      back_text: card.back_text,
      generation_source: 'manual',
    }));

    replaceFlashcards(
      {
        studySetId,
        flashcards,
      },
      {
        onSuccess: () => {
          router.push(`/my-study-sets`);
        },
      },
    );
  };

  const handlePreview = (cards: FlashcardData[]) => {
    // Implement preview functionality
    console.log('Preview cards:', cards);
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoadingStudySet) {
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
              <Text>The study set you are looking for does not exist.</Text>
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
      <div className='max-w-7xl mx-auto px-4'>
        {/* Header */}
        <div className='mb-6'>
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack} className='mb-4'>
            Back
          </Button>

          <Card className='bg-gradient-to-r from-purple-50 to-blue-50 border-0'>
            <div className='flex items-center justify-between'>
              <div>
                <Title level={2} className='mb-2'>
                  Create Flashcards
                </Title>
                <Text className='text-gray-600 text-lg'>
                  Add flashcards to &quot;{studySet.name}&quot;
                </Text>
                <div className='mt-2'>
                  <Text type='secondary'>
                    Create unlimited flashcards with our powerful builder tool
                  </Text>
                </div>
              </div>
              <div className='text-right'>
                <div className='text-sm text-gray-500'>Study Set</div>
                <div className='font-semibold text-lg'>{studySet.name}</div>
                <div className='text-sm text-gray-500'>
                  {studySet.isPublic ? 'Public' : 'Private'}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Info Alert */}
        <Alert
          message='💡 Professional Flashcard Builder'
          description={
            <div className='space-y-2'>
              <div>Create unlimited flashcards with our advanced builder featuring:</div>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-2 text-sm'>
                <div>• Keyboard shortcuts</div>
                <div>• Bulk operations</div>
                <div>• Undo/Redo support</div>
                <div>• Difficulty levels</div>
                <div>• Smart validation</div>
                <div>• Import/Export tools</div>
                <div>• Search & filter</div>
                <div>• Auto-save</div>
              </div>
            </div>
          }
          type='info'
          showIcon
          className='mb-6'
          closable
        />

        <FlashcardBuilder
          studySetId={studySetId}
          onSave={handleSave}
          onPreview={handlePreview}
          autoSave={true}
        />

        {isReplacing && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <Card className='text-center'>
              <Spin size='large' />
              <div className='mt-4'>
                <Title level={4}>Creating Flashcards...</Title>
                <Text type='secondary'>Please wait while we save your flashcards</Text>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateFlashcardsPage;
