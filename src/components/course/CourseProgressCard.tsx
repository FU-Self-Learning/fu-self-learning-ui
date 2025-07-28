import React from 'react';
import { Card, Progress, Row, Col, Statistic, Button, Tag, Typography, Alert } from 'antd';
import {
  TrophyOutlined,
  BookOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { CourseProgress } from '@/types/testType';
import { useRouter } from 'next/navigation';
import {
  useHasCertificate,
  useGenerateCertificate,
} from '@/hooks/certificate/useCertificateManagement';

const { Title, Text } = Typography;

interface CourseProgressCardProps {
  progress: CourseProgress;
  courseId: string;
}

const CourseProgressCard: React.FC<CourseProgressCardProps> = ({ progress, courseId }) => {
  const router = useRouter();
  const { data: hasCertificateData } = useHasCertificate(Number(courseId));
  const { mutate: generateCertificate, isPending: isGenerating } = useGenerateCertificate();

  const hasCertificate = hasCertificateData?.hasCertificate || false;
  const canGenerateCertificate = progress.finalExamCompleted && !hasCertificate;

  const handleViewCertificate = () => {
    // Try to get certificate data first
    if (hasCertificate) {
      // Use course-based URL as fallback since we don't have certificate ID here
      router.push(`/certificates/course/${courseId}`);
    }
  };

  const handleGenerateCertificate = () => {
    generateCertificate(Number(courseId));
  };

  return (
    <Card className='mb-6 shadow-lg'>
      <div className='mb-4'>
        <Title level={4} className='mb-2'>
          Course Progress: {progress.courseTitle}
        </Title>
        <Progress
          percent={Math.round(progress.progressPercentage)}
          status={progress.certificateEarned ? 'success' : 'active'}
          strokeColor={progress.certificateEarned ? '#52c41a' : '#1890ff'}
        />
      </div>

      <Row gutter={16} className='mb-4'>
        <Col span={6}>
          <Statistic
            title='Topics Completed'
            value={progress.completedTopics}
            suffix={`/ ${progress.totalTopics}`}
            prefix={<BookOutlined />}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title='Lessons Completed'
            value={progress.completedLessons}
            suffix={`/ ${progress.totalLessons}`}
            prefix={<PlayCircleOutlined />}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title='Topic Exams'
            value={progress.completedTopicExams}
            suffix={`/ ${progress.totalTopicExams}`}
            prefix={<CheckCircleOutlined />}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title='Final Exam'
            value={progress.finalExamCompleted ? 'Completed' : 'Pending'}
            valueStyle={{ color: progress.finalExamCompleted ? '#52c41a' : '#faad14' }}
            prefix={<TrophyOutlined />}
          />
        </Col>
      </Row>

      {progress.finalExamCompleted && (
        <div className='mb-4'>
          <Row gutter={16}>
            <Col span={12}>
              <Statistic
                title='Final Exam Score'
                value={progress.finalExamScore}
                suffix='%'
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col span={12} className='flex items-center justify-end gap-2'>
              {hasCertificate ? (
                <>
                  <Button
                    type='primary'
                    icon={<TrophyOutlined />}
                    onClick={handleViewCertificate}
                    size='large'
                  >
                    View Certificate
                  </Button>
                </>
              ) : canGenerateCertificate ? (
                <Button
                  type='primary'
                  icon={<TrophyOutlined />}
                  onClick={handleGenerateCertificate}
                  loading={isGenerating}
                  size='large'
                >
                  Generate Certificate
                </Button>
              ) : null}
            </Col>
          </Row>
        </div>
      )}

      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Tag
            color={
              hasCertificate ? 'success' : progress.finalExamCompleted ? 'processing' : 'default'
            }
          >
            {hasCertificate
              ? 'Certificate Earned'
              : progress.finalExamCompleted
                ? 'Ready for Certificate'
                : 'In Progress'}
          </Tag>
          {progress.finalExamCompleted && <Tag color='green'>Course Completed</Tag>}
        </div>

        <Text type='secondary'>{Math.round(progress.progressPercentage)}% Complete</Text>
      </div>

      {canGenerateCertificate && (
        <Alert
          message='Certificate Ready'
          description='You have completed the final exam. Click "Generate Certificate" to create your certificate.'
          type='info'
          showIcon
          className='mt-4'
        />
      )}
    </Card>
  );
};

export default CourseProgressCard;
