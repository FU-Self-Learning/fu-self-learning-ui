'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Card, Typography, Tabs, Spin, Alert, Empty, Space } from 'antd';
import { BookOutlined, TrophyOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useTopicExams } from '@/hooks/test/useTopicExams';
import { useFinalExam } from '@/hooks/test/useFinalExam';
import { useCourseProgress } from '@/hooks/test/useCourseProgress';
import TopicExamCard from '@/components/test/TopicExamCard';
import FinalExamCard from '@/components/test/FinalExamCard';
import CourseProgressCard from '@/components/course/CourseProgressCard';
import { getExamTypeLabel } from '@/utils/examTypeMapper';

const { Title, Text } = Typography;

const ExamsPage: React.FC = () => {
  const params = useParams();
  const courseId = params.id as string;

  const {
    data: topicExams,
    isLoading: topicExamsLoading,
    error: topicExamsError,
  } = useTopicExams(Number(courseId));

  const {
    data: finalExam,
    isLoading: finalExamLoading,
    error: finalExamError,
  } = useFinalExam(Number(courseId));

  const {
    data: courseProgress,
    isLoading: progressLoading,
    error: progressError,
  } = useCourseProgress(Number(courseId));

  if (topicExamsLoading || finalExamLoading || progressLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spin size='large' />
      </div>
    );
  }

  if (topicExamsError || finalExamError || progressError) {
    return (
      <div className='p-6'>
        <Alert
          message='Error loading exams'
          description='Unable to load exam information. Please try again later.'
          type='error'
          showIcon
        />
      </div>
    );
  }

  const availableTopicExams = topicExams?.filter((exam) => exam.isAvailable) || [];
  const lockedTopicExams = topicExams?.filter((exam) => !exam.isAvailable) || [];
  const items = [
    {
      key: '1',
      label: (
        <Space key='topic-exams'>
          <BookOutlined />
          <span>
            {getExamTypeLabel('topic_exam')} ({topicExams?.length || 0})
          </span>
        </Space>
      ),
      children: (
        <div className='space-y-4'>
          {availableTopicExams.length > 0 && (
            <div key='available-exams'>
              <Title level={5} className='mb-3 text-green-600'>
                Available {getExamTypeLabel('topic_exam')}
              </Title>
              {availableTopicExams.map((exam) => (
                <TopicExamCard key={exam.id} topicExam={exam} courseId={courseId} />
              ))}
            </div>
          )}

          {lockedTopicExams.length > 0 && (
            <div key='locked-exams'>
              <Title level={5} className='mb-3 text-orange-600'>
                Locked {getExamTypeLabel('topic_exam')}
              </Title>
              {lockedTopicExams.map((exam) => (
                <TopicExamCard key={exam.topicId} topicExam={exam} courseId={courseId} />
              ))}
            </div>
          )}

          {topicExams?.length === 0 && (
            <Empty
              key='no-exams'
              description={`No ${getExamTypeLabel('topic_exam').toLowerCase()} available for this course`}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <Space key='final-exam'>
          <TrophyOutlined />
          <span>{getExamTypeLabel('final_exam')}</span>
        </Space>
      ),
      children: (
        <div>
          {finalExam ? (
            <FinalExamCard finalExam={finalExam} courseId={courseId} />
          ) : (
            <Empty
              description={`No ${getExamTypeLabel('final_exam').toLowerCase()} available for this course`}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <Space key='course-progress'>
          <PlayCircleOutlined />
          <span>Course Progress</span>
        </Space>
      ),
      children: (
        <div>
          {courseProgress ? (
            <CourseProgressCard progress={courseProgress} courseId={courseId} />
          ) : (
            <Empty
              description='No progress information available'
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <div className='mb-6'>
        <Title level={2}>Course Exams</Title>
        <Text type='secondary'>
          Complete topic exams and the final exam to earn your course certificate
        </Text>
      </div>

      <Card>
        <Tabs defaultActiveKey='1' items={items} size='large' tabPosition='top' />
      </Card>
    </div>
  );
};

export default ExamsPage;
