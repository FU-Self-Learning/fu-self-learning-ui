'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Space, Typography, Empty, Spin, Input, Select } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useExams } from '@/hooks/exam/useExams';
import { ExamFilter } from '@/types/examType';
import { ExamList } from './exam/ExamList';

const { Title } = Typography;
const { Search } = Input;

interface CourseExamsTabProps {
  courseId: string;
}

export const CourseExamsTab: React.FC<CourseExamsTabProps> = ({ courseId }) => {
  const router = useRouter();
  const [filter, setFilter] = useState<ExamFilter>({ courseId: parseInt(courseId) });

  const { data: exams, isLoading, error } = useExams(parseInt(courseId), filter);

  const handleFilterChange = (key: keyof ExamFilter, value: any) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreateExam = () => {
    router.push(`/instructor/course/${courseId}/exam/create`);
  };

  if (error) {
    return <div>Error loading exams: {error.message}</div>;
  }

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <Title level={3} className='mb-0'>
          Course Exams
        </Title>
        <Button type='primary' icon={<PlusOutlined />} onClick={handleCreateExam}>
          Create New Exam
        </Button>
      </div>

      {/* Filters */}
      <div className='bg-gray-50 p-4 rounded-lg mb-6'>
        <Space wrap>
          <Search
            placeholder='Search exams...'
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            allowClear
          />
          <Select
            placeholder='Filter by status'
            style={{ width: 150 }}
            allowClear
            onChange={(value) => handleFilterChange('isActive', value)}
            options={[
              { label: 'Active', value: true },
              { label: 'Inactive', value: false },
            ]}
          />
          <Select
            placeholder='Filter by type'
            style={{ width: 150 }}
            allowClear
            onChange={(value) => handleFilterChange('type', value)}
            options={[
              { label: 'Practice', value: 'practice' },
              { label: 'Midterm', value: 'midterm' },
              { label: 'Final', value: 'final' },
              { label: 'Quiz', value: 'quiz' },
            ]}
          />
        </Space>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className='flex justify-center items-center h-64'>
          <Spin size='large' />
        </div>
      ) : exams && exams.length > 0 ? (
        <ExamList exams={exams} />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No exams found' className='my-8'>
          <Button type='primary' onClick={handleCreateExam}>
            Create Your First Exam
          </Button>
        </Empty>
      )}
    </div>
  );
};
