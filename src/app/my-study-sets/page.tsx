'use client';

import React, { useState } from 'react';
import { Button, Card, Typography, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import StudySetList from '@/components/studySet/list/StudySetList';

import FlashcardGenerateModal from '@/components/flashcard/FlashcardGenerateModal';
import { useDeleteStudySet } from '@/hooks/study-set/useDeleteStudySet';
import StudySetActions from '../../components/studySet/StudySetActions';

const { Title } = Typography;

export default function MyStudySetsPage() {
  const userId = 1;
  const router = useRouter();

  const [showGenerate, setShowGenerate] = useState(false);
  const [generateSetId, setGenerateSetId] = useState<number | null>(null);
  const { mutate: deleteStudySet } = useDeleteStudySet();

  const handleEdit = (id: number) => router.push(`/my-study-sets/edit/${id}`);
  const handleAddFlashcards = (id: number) => router.push(`/my-study-sets/${id}/flashcards`);
  const handleGenerate = (id: number) => {
    setGenerateSetId(id);
    setShowGenerate(true);
  };
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Delete Study Set',
      content: 'Are you sure you want to delete this study set?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        deleteStudySet(id);
      },
    });
  };

  return (
    <div className='max-w-screen-xl mx-auto p-4 min-h-[calc(100vh-100px)]'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>
        <div>
          <Title level={2} className='!mb-1'>
            My Study Sets
          </Title>
          <p className='text-gray-500'>Manage your own flashcard study sets.</p>
        </div>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => router.push('/my-study-sets/create')}
        >
          Create Study Set
        </Button>
      </div>
      <Card>
        <StudySetList
          filter={{ userId }}
          canEdit={true}
          onSelect={() => {}}
          renderActions={(item) => (
            <StudySetActions
              item={item}
              onEdit={handleEdit}
              onAddFlashcards={handleAddFlashcards}
              onGenerate={handleGenerate}
              onDelete={handleDelete}
            />
          )}
        />
      </Card>

      {showGenerate && generateSetId && (
        <FlashcardGenerateModal open={showGenerate} onClose={() => setShowGenerate(false)} />
      )}
    </div>
  );
}
