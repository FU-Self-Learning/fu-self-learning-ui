'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Card, Typography, Row, Col, Statistic, Divider, Spin, Alert } from 'antd';
import { TrophyOutlined, CalendarOutlined, StarOutlined } from '@ant-design/icons';
import { useCertificateByCourseId } from '@/hooks/certificate/useCertificateDetail';

const { Title, Text } = Typography;

const CourseCertificatePage: React.FC = () => {
  const params = useParams();
  const courseId = params.courseId as string;

  const { data: certificate, isLoading, error } = useCertificateByCourseId(Number(courseId));

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spin size='large' />
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className='p-6'>
        <Alert
          message='Certificate not found'
          description="You haven't earned a certificate for this course yet. Complete the final exam to earn your certificate."
          type='warning'
          showIcon
        />
      </div>
    );
  }

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <div className='text-center mb-8'>
        <TrophyOutlined className='text-6xl text-yellow-500 mb-4' />
        <Title level={1} className='text-green-600'>
          Certificate of Completion
        </Title>
        <Text type='secondary' className='text-lg'>
          Congratulations! You have successfully completed the course
        </Text>
      </div>

      <Card className='shadow-lg border-2 border-green-200'>
        <div className='text-center mb-6'>
          <Title level={2} className='text-green-700'>
            {certificate.certificateNumber}
          </Title>
        </div>

        <Row gutter={24} className='mb-6'>
          <Col span={12}>
            <Statistic
              title='Final Score'
              value={certificate.finalScore}
              suffix='%'
              valueStyle={{ color: '#52c41a', fontSize: '2rem' }}
              prefix={<StarOutlined />}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title='Issued Date'
              value={new Date(certificate.issuedAt).toLocaleDateString()}
              valueStyle={{ fontSize: '1.5rem' }}
              prefix={<CalendarOutlined />}
            />
          </Col>
        </Row>

        <Divider />

        <div className='text-center mb-6'>
          <Text className='text-lg'>
            This certificate is awarded to acknowledge successful completion of the course
            requirements, including all topic exams and the final examination with a passing score.
          </Text>
        </div>
      </Card>

      <div className='mt-6 text-center'>
        <Text type='secondary'>Certificate ID: {certificate.certificateNumber}</Text>
      </div>
    </div>
  );
};

export default CourseCertificatePage;
