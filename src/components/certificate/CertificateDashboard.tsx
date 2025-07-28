'use client';

import React from 'react';
import { Card, Typography, Row, Col, Statistic, Button, Empty, Spin } from 'antd';
import { TrophyOutlined, BookOutlined, StarOutlined, PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useUserCertificates } from '@/hooks/certificate/useCertificates';

const { Title, Text } = Typography;

const CertificateDashboard: React.FC = () => {
  const router = useRouter();
  const { data: certificates, isLoading } = useUserCertificates();

  const handleViewAllCertificates = () => {
    router.push('/certificates');
  };

  const handleViewCertificate = (certificateId: number) => {
    router.push(`/certificates/id/${certificateId}`);
  };

  if (isLoading) {
    return (
      <Card className='shadow-lg'>
        <div className='flex justify-center items-center h-32'>
          <Spin size='large' />
        </div>
      </Card>
    );
  }

  const recentCertificates = certificates?.slice(0, 3) || [];
  const totalCertificates = certificates?.length || 0;
  const averageScore = certificates?.length
    ? certificates.reduce((acc, cert) => acc + cert.finalScore, 0) / certificates.length
    : 0;

  return (
    <Card className='shadow-lg'>
      <div className='mb-6'>
        <div className='flex items-center justify-between mb-4'>
          <Title level={3} className='mb-0'>
            <TrophyOutlined className='mr-2 text-yellow-500' />
            Certificate Overview
          </Title>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={handleViewAllCertificates}
            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
          >
            View All Certificates
          </Button>
        </div>

        <Row gutter={16} className='mb-6'>
          <Col span={8}>
            <Statistic
              title='Total Certificates'
              value={totalCertificates}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title='Average Score'
              value={averageScore}
              suffix='%'
              prefix={<StarOutlined />}
              valueStyle={{ color: '#1890ff' }}
              precision={1}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title='Courses Completed'
              value={new Set(certificates?.map((cert) => cert.courseId) || []).size}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Col>
        </Row>
      </div>

      <div>
        <Title level={4} className='mb-4'>
          Recent Certificates
        </Title>

        {recentCertificates.length > 0 ? (
          <div className='space-y-3'>
            {recentCertificates.map((certificate) => (
              <Card
                key={certificate.id}
                size='small'
                className='hover:shadow-md transition-shadow duration-200 cursor-pointer'
                onClick={() => handleViewCertificate(certificate.id)}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <TrophyOutlined className='text-2xl text-yellow-500' />
                    <div>
                      <Text strong>Course {certificate.courseId}</Text>
                      <br />
                      <Text type='secondary' className='text-xs'>
                        {certificate.certificateNumber}
                      </Text>
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='text-lg font-bold text-green-600'>
                      {certificate.finalScore}%
                    </div>
                    <Text type='secondary' className='text-xs'>
                      {new Date(certificate.issuedAt).toLocaleDateString()}
                    </Text>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <Text type='secondary'>No certificates yet</Text>
                <br />
                <Text type='secondary' className='text-xs'>
                  Complete courses and pass final exams to earn certificates
                </Text>
              </div>
            }
          />
        )}
      </div>
    </Card>
  );
};

export default CertificateDashboard;
