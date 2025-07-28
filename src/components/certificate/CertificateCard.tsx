'use client';

import React from 'react';
import { Card, Typography, Button, Row, Col, Statistic, Tag, Spin } from 'antd';
import { TrophyOutlined, CalendarOutlined, StarOutlined, BookOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { CourseCertificate } from '@/types/testType';

const { Title, Text } = Typography;

interface CertificateCardProps {
  certificate: CourseCertificate;
  isLoading?: boolean;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ certificate, isLoading = false }) => {
  const router = useRouter();

  const handleViewCertificate = () => {
    router.push(`/certificates/id/${certificate.id}`);
  };

  if (isLoading) {
    return (
      <Card className='shadow-lg border-2 border-green-200'>
        <div className='flex justify-center items-center h-32'>
          <Spin size='large' />
        </div>
      </Card>
    );
  }

  return (
    <Card className='shadow-lg border-2 border-green-200 hover:shadow-xl transition-shadow duration-300'>
      <div className='text-center mb-4'>
        <TrophyOutlined className='text-4xl text-yellow-500 mb-2' />
        <Title level={4} className='text-green-700 mb-1'>
          Certificate of Completion
        </Title>
        <Text type='secondary' className='text-sm'>
          Course ID: {certificate.courseId}
        </Text>
      </div>

      <div className='mb-4'>
        <Title level={5} className='text-green-700 text-center'>
          {certificate.certificateNumber}
        </Title>
      </div>

      <Row gutter={16} className='mb-4'>
        <Col span={12}>
          <Statistic
            title='Final Score'
            value={certificate.finalScore}
            suffix='%'
            valueStyle={{ color: '#52c41a', fontSize: '1.5rem' }}
            prefix={<StarOutlined />}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title='Issued Date'
            value={new Date(certificate.issuedAt).toLocaleDateString()}
            valueStyle={{ fontSize: '1.2rem' }}
            prefix={<CalendarOutlined />}
          />
        </Col>
      </Row>

      <div className='flex items-center justify-between mb-4'>
        <Tag color='success' icon={<TrophyOutlined />}>
          Certificate Earned
        </Tag>
        <Text type='secondary' className='text-xs'>
          ID: {certificate.id}
        </Text>
      </div>

      <div className='flex gap-2'>
        <Button
          type='primary'
          icon={<BookOutlined />}
          onClick={handleViewCertificate}
          className='flex-1'
          style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
        >
          View Details
        </Button>
      </div>
    </Card>
  );
};

export default CertificateCard;
