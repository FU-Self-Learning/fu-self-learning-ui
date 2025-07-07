'use client';

import React, { useState } from 'react';
import { Button, Card, Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import StudySetList from '@/components/studySet/list/StudySetList';
import StudySetDetail from '@/components/studySet/StudySetDetail';
import StudySetLearn from '@/components/studySet/learn/StudySetLearn';
import StudySetFilter from '@/components/studySet/StudySetFilter';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

export default function FlashcardsPage() {
  const userId = 1;
  const router = useRouter();
  const [filter, setFilter] = useState<any>({});
  const [selectedSetId, setSelectedSetId] = useState<number | null>(null);
  const [learnMode, setLearnMode] = useState(false);
  const [learnFlashcards, setLearnFlashcards] = useState<any[]>([]);

  const handleSelectSet = (id: number) => {
    setSelectedSetId(id);
    setLearnMode(false);
  };

  const handleLearn = (flashcards: any[]) => {
    setLearnFlashcards(flashcards);
    setLearnMode(true);
  };

  const handleExitLearn = () => {
    setLearnMode(false);
  };

  const handleExitDetail = () => {
    setLearnMode(false);
    setSelectedSetId(null);
  };

  const navigateToMyStudySets = () => {
    router.push('/my-study-sets');
  };

  return (
    <div className='max-w-screen-xl mx-auto p-4 min-h-[calc(100vh-100px)]'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>
        <div>
          <Title level={2} className='!mb-1'>
            Flashcards
          </Title>
          <p className='text-gray-500'>
            Create, manage, and learn with your own flashcard study sets.
          </p>
        </div>
        <Button type='primary' icon={<ArrowRightOutlined />} onClick={navigateToMyStudySets}>
          Go to my Study Sets
        </Button>
      </div>
      <Card className='!mb-6'>
        <StudySetFilter filter={filter} setFilter={setFilter} />
      </Card>
      {!selectedSetId && !learnMode && <StudySetList onSelect={handleSelectSet} filter={filter} />}
      {selectedSetId && !learnMode && (
        <StudySetDetail
          id={selectedSetId}
          userId={userId}
          onLearn={(flashcards) => handleLearn(flashcards)}
          onExit={handleExitDetail}
        />
      )}
      {learnMode && <StudySetLearn flashcards={learnFlashcards} onExit={handleExitLearn} />}
    </div>
  );
}
