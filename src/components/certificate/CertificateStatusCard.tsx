'use client';

import React from 'react';
import { Card, Typography, Button, Row, Col, Tag, Spin, Alert } from 'antd';
import {
  TrophyOutlined,
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import {
  useHasCertificate,
  useGenerateCertificate,
} from '@/hooks/certificate/useCertificateManagement';
import { useCertificateByCourseId } from '@/hooks/certificate/useCertificateDetail';
import { CourseProgress } from '@/types/testType';

const { Title, Text } = Typography;

interface CertificateStatusCardProps {
  courseId: number;
  courseTitle: string;
  progress: CourseProgress;
}

const CertificateStatusCard: React.FC<CertificateStatusCardProps> = ({
  courseId,
  courseTitle,
  progress,
}) => {
  const router = useRouter();
  const { data: hasCertificateData, isLoading: isLoadingHasCertificate } =
    useHasCertificate(courseId);
  const { mutate: generateCertificate, isPending: isGenerating } = useGenerateCertificate();

  // Get certificate data if it exists
  const { data: certificateData } = useCertificateByCourseId(courseId);

  const hasCertificate = hasCertificateData?.hasCertificate || false;
  const canGenerateCertificate = progress.finalExamCompleted && !hasCertificate;

  const handleViewCertificate = () => {
    if (certificateData) {
      router.push(`/certificates/id/${certificateData.id}`);
    } else if (hasCertificate) {
      // If we know certificate exists but don't have the data, use course-based URL
      router.push(`/certificates/course/${courseId}`);
    }
  };

  const handleGenerateCertificate = () => {
    generateCertificate(courseId);
  };

  if (isLoadingHasCertificate) {
    return (
      <Card className='shadow-md border-2 border-gray-200'>
        <div className='flex justify-center items-center h-32'>
          <Spin size='large' />
        </div>
      </Card>
    );
  }

  return (
    <Card className='shadow-md border-2 border-gray-200 hover:shadow-lg transition-shadow duration-300'>
      <div className='text-center mb-4'>
        <TrophyOutlined className='text-4xl text-yellow-500 mb-2' />
        <Title level={4} className='text-gray-800 mb-1'>
          Certificate Status
        </Title>
        <Text type='secondary' className='text-sm'>
          {courseTitle}
        </Text>
      </div>

      <div className='mb-4'>
        <Row gutter={16}>
          <Col span={12}>
            <div className='text-center'>
              <Text strong>Final Exam Score</Text>
              <div className='text-2xl font-bold text-green-600'>
                {progress.finalExamScore || 0}%
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className='text-center'>
              <Text strong>Course Progress</Text>
              <div className='text-2xl font-bold text-blue-600'>
                {Math.round(progress.progressPercentage)}%
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <div className='mb-4'>
        <div className='flex items-center justify-center gap-2 mb-2'>
          {hasCertificate ? (
            <Tag color='success' icon={<CheckCircleOutlined />}>
              Certificate Earned
            </Tag>
          ) : progress.finalExamCompleted ? (
            <Tag color='processing' icon={<ClockCircleOutlined />}>
              Ready to Generate
            </Tag>
          ) : (
            <Tag color='default' icon={<BookOutlined />}>
              In Progress
            </Tag>
          )}
        </div>
      </div>

      <div className='space-y-2'>
        {hasCertificate ? (
          <>
            <Button
              type='primary'
              icon={<TrophyOutlined />}
              onClick={handleViewCertificate}
              className='w-full'
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
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
            className='w-full'
            style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
          >
            Generate Certificate
          </Button>
        ) : (
          <Alert
            message='Complete the final exam to earn your certificate'
            type='info'
            showIcon
            className='text-center'
          />
        )}
      </div>

      {progress.finalExamCompleted && (
        <div className='mt-4 pt-4 border-t border-gray-200'>
          <div className='flex items-center justify-between text-sm text-gray-600'>
            <span>Final Exam:</span>
            <span className='font-medium'>
              {progress.finalExamScore || 0}% -{' '}
              {(progress.finalExamScore || 0) >= 70 ? 'Passed' : 'Failed'}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default CertificateStatusCard;
