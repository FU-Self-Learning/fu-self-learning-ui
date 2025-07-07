'use client';

import React, { useState } from 'react';
import { Button, Card, Typography } from 'antd';
import { PlusOutlined, ThunderboltOutlined } from '@ant-design/icons';
import FlashcardList from '@/components/flashcard/FlashcardList';
import FlashcardFilter from '@/components/flashcard/FlashcardFilter';
import FlashcardForm from '@/components/flashcard/FlashcardForm';
import FlashcardGenerateModal from '@/components/flashcard/FlashcardGenerateModal';

const { Title } = Typography;

export default function FlashcardsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const [filter, setFilter] = useState<{ courseId?: number; topicId?: number; lessonId?: number }>(
    {},
  );

  return (
    <div className='max-w-screen-xl mx-auto p-4'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>
        <div>
          <Title level={2} className='!mb-1'>
            Flashcards
          </Title>
          <p className='text-gray-500'>
            Practice, review, and auto-generate flashcards for your learning journey.
          </p>
        </div>
        <div className='flex gap-2'>
          <Button type='primary' icon={<PlusOutlined />} onClick={() => setShowCreate(true)}>
            Create Flashcard
          </Button>
          <Button icon={<ThunderboltOutlined />} onClick={() => setShowGenerate(true)}>
            Auto-generate
          </Button>
        </div>
      </div>
      <Card className='mb-6'>
        <FlashcardFilter filter={filter} setFilter={setFilter} />
      </Card>
      <FlashcardList filter={filter} />
      <>
        <FlashcardForm open={showCreate} onClose={() => setShowCreate(false)} />
        <FlashcardGenerateModal open={showGenerate} onClose={() => setShowGenerate(false)} />
      </>
    </div>
  );
}
