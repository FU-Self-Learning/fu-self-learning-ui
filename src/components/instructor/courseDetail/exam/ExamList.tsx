'use client';

import { Card, List, Tag, Button, Popconfirm, Typography, Tooltip } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
} from '@ant-design/icons';
import { ExamResponse } from '@/types/examType';
import { useDeleteExam } from '@/hooks/exam/useDeleteExam';
import { useToggleExamStatus } from '@/hooks/exam/useToggleExamStatus';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getExamTypeLabel, getExamTypeColor } from '@/utils/examTypeMapper';
// Simple date formatter utility
const formatCreatedAt = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return date.toLocaleDateString();
};

const { Text } = Typography;

interface ExamListProps {
  exams: ExamResponse[];
  courseId: string;
}

export const ExamList: React.FC<ExamListProps> = ({ exams, courseId }) => {
  const deleteExamMutation = useDeleteExam();
  // State để lưu examId đang toggle
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const { toggle, isPending, data } = useToggleExamStatus();
  const router = useRouter();

  const handleDeleteExam = (examId: number) => {
    deleteExamMutation.mutate(examId);
  };

  const handleToggleStatus = async (examId: number) => {
    setTogglingId(examId);
    try {
      const result = await toggle(examId);
      if (result && result.id === examId) {
        setTogglingId(null);
      }
    } catch {
      setTogglingId(null);
    }
  };

  const handleEditExam = (examId: number) => {
    router.push(`/instructor/course/${courseId}/exam/${examId}/edit`);
  };

  const handleViewExam = (examId: number) => {
    router.push(`/instructor/course/${courseId}/exam/${examId}`);
  };

  return (
    <List
      grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 }}
      dataSource={exams}
      renderItem={(exam) => (
        <List.Item>
          <Card
            title={
              <div className='flex justify-between items-start'>
                <Text strong className='text-lg'>
                  {exam.title}
                </Text>
                <Tag color={exam.isActive ? 'green' : 'red'}>
                  {exam.isActive ? 'Active' : 'Inactive'}
                </Tag>
              </div>
            }
            actions={[
              <Tooltip title='View Details' key='view'>
                <Button
                  type='text'
                  icon={<EyeOutlined />}
                  onClick={() => handleViewExam(exam.id)}
                />
              </Tooltip>,
              <Tooltip title='Edit Exam' key='edit'>
                <Button
                  type='text'
                  icon={<EditOutlined />}
                  onClick={() => handleEditExam(exam.id)}
                />
              </Tooltip>,
              <Tooltip title={exam.isActive ? 'Deactivate' : 'Activate'} key='toggle'>
                <Button
                  type='text'
                  icon={exam.isActive ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                  onClick={() => handleToggleStatus(exam.id)}
                  loading={togglingId === exam.id && (isPending || (data && data.id !== exam.id))}
                  disabled={togglingId === exam.id && (isPending || (data && data.id !== exam.id))}
                />
              </Tooltip>,
              <Popconfirm
                title='Delete Exam'
                description='Are you sure you want to delete this exam?'
                onConfirm={() => handleDeleteExam(exam.id)}
                okText='Yes'
                cancelText='No'
                key='delete'
              >
                <Tooltip title='Delete Exam'>
                  <Button
                    type='text'
                    danger
                    icon={<DeleteOutlined />}
                    loading={deleteExamMutation.isPending}
                  />
                </Tooltip>
              </Popconfirm>,
            ]}
            className='h-full'
          >
            <div className='space-y-3'>
              <Text type='secondary' className='text-sm'>
                {exam.description}
              </Text>

              <div className='grid grid-cols-2 gap-2 text-sm'>
                <div>
                  <Text strong>Duration:</Text> {exam.duration} min
                </div>
                <div>
                  <Text strong>Questions:</Text> {exam.questionCount || exam.questions?.length || 0}
                </div>
                <div>
                  <Text strong>Pass Score:</Text> {exam.passingScore}%
                </div>
                <div>
                  <Text strong>Type:</Text>{' '}
                  <Tag color={getExamTypeColor(exam.type)}>{getExamTypeLabel(exam.type)}</Tag>
                </div>
                <div>
                  <Text strong>Shuffle Q:</Text> {exam.shuffleQuestions ? 'Yes' : 'No'}
                </div>
                <div>
                  <Text strong>Created:</Text> {formatCreatedAt(exam.createdAt)}
                </div>
              </div>
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
};
