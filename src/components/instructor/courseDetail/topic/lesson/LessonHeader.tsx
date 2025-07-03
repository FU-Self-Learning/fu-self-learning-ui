'use client';

import { Button, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface LessonHeaderProps {
  totalLessons: number;
  newLessonsCount: number;
  onAddLesson: () => void;
  isAdding: boolean;
}

export const LessonHeader = ({
  totalLessons,
  newLessonsCount,
  onAddLesson,
  isAdding,
}: LessonHeaderProps) => {
  return (
    <div className='flex justify-between items-center mb-3'>
      <Typography.Text strong>
        Current Lessons ({totalLessons})
        {newLessonsCount > 0 && <span className='text-blue-500 ml-2'>({newLessonsCount} new)</span>}
      </Typography.Text>
      {!isAdding && (
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={onAddLesson}
          className='!bg-blue-600 hover:!bg-blue-700 !border-blue-600 hover:!border-blue-700 !rounded-lg !font-medium transition-all duration-200'
        >
          Add Lesson
        </Button>
      )}
    </div>
  );
};
