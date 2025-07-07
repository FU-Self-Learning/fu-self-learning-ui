import React, { useState } from 'react';
import { Button, Space } from 'antd';
import { AppstoreOutlined, ArrowLeftOutlined, IdcardOutlined } from '@ant-design/icons';
import FlashcardLearnView from './FlashcardLearnView';
import StudySetListView from './StudySetListView';

interface Props {
  flashcards: Array<{ id: number; front_text: string; back_text: string }>;
  onExit: () => void;
}

const StudySetLearn: React.FC<Props> = ({ flashcards, onExit }) => {
  const [view, setView] = useState<'flashcard' | 'list'>('flashcard');

  return (
    <div>
      <div className='flex justify-center my-4'>
        <Space>
          <Button onClick={onExit} icon={<ArrowLeftOutlined />}>
            Back
          </Button>
          <Button
            type={view === 'flashcard' ? 'primary' : 'default'}
            icon={<IdcardOutlined />}
            onClick={() => setView('flashcard')}
          >
            Flashcard View
          </Button>
          <Button
            type={view === 'list' ? 'primary' : 'default'}
            icon={<AppstoreOutlined />}
            onClick={() => setView('list')}
          >
            List View
          </Button>
        </Space>
      </div>

      {view === 'flashcard' ? (
        <FlashcardLearnView flashcards={flashcards} onExit={onExit} />
      ) : (
        <StudySetListView flashcards={flashcards} />
      )}
    </div>
  );
};

export default StudySetLearn;
