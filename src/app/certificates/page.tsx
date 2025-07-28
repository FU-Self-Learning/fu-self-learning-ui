'use client';

import React, { useState } from 'react';
import { Typography, Row, Col, Empty, Spin, Alert, Input, Select, Card, Statistic } from 'antd';
import {
  TrophyOutlined,
  SearchOutlined,
  BookOutlined,
  CalendarOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { useUserCertificates } from '@/hooks/certificate/useCertificates';
import CertificateCard from '@/components/certificate/CertificateCard';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const CertificatesPage: React.FC = () => {
  const { data: certificates, isLoading, error } = useUserCertificates();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('issuedAt');
  const [filterBy, setFilterBy] = useState('all');

  // Filter and sort certificates
  const filteredAndSortedCertificates = React.useMemo(() => {
    if (!certificates) return [];

    let filtered = certificates;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (cert) =>
          cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cert.courseId.toString().includes(searchTerm),
      );
    }

    // Filter by status
    if (filterBy === 'recent') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filtered = filtered.filter((cert) => new Date(cert.issuedAt) >= thirtyDaysAgo);
    }

    // Sort certificates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'issuedAt':
          return new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime();
        case 'finalScore':
          return b.finalScore - a.finalScore;
        case 'courseId':
          return a.courseId - b.courseId;
        default:
          return 0;
      }
    });

    return filtered;
  }, [certificates, searchTerm, sortBy, filterBy]);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spin size='large' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-6'>
        <Alert
          message='Error loading certificates'
          description='There was an error loading your certificates. Please try again later.'
          type='error'
          showIcon
        />
      </div>
    );
  }

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      {/* Header */}
      <div className='text-center mb-8'>
        <TrophyOutlined className='text-6xl text-yellow-500 mb-4' />
        <Title level={1} className='text-green-600 mb-2'>
          My Certificates
        </Title>
        <Text type='secondary' className='text-lg'>
          View and manage all your earned certificates
        </Text>
      </div>

      {/* Statistics */}
      {certificates && certificates.length > 0 && (
        <Row gutter={16} className='mb-8'>
          <Col span={6}>
            <Card>
              <Statistic
                title='Total Certificates'
                value={certificates.length}
                prefix={<TrophyOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title='Average Score'
                value={
                  certificates.reduce((acc, cert) => acc + cert.finalScore, 0) / certificates.length
                }
                suffix='%'
                prefix={<StarOutlined />}
                valueStyle={{ color: '#1890ff' }}
                precision={1}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title='Recent Certificates'
                value={
                  certificates.filter((cert) => {
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return new Date(cert.issuedAt) >= thirtyDaysAgo;
                  }).length
                }
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title='Courses Completed'
                value={new Set(certificates.map((cert) => cert.courseId)).size}
                prefix={<BookOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Search and Filter Controls */}
      <div className='mb-6'>
        <Row gutter={16} align='middle'>
          <Col span={12}>
            <Search
              placeholder='Search by certificate number or course ID...'
              allowClear
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<SearchOutlined />}
              size='large'
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder='Sort by'
              value={sortBy}
              onChange={setSortBy}
              size='large'
              style={{ width: '100%' }}
            >
              <Option value='issuedAt'>Date Issued</Option>
              <Option value='finalScore'>Final Score</Option>
              <Option value='courseId'>Course ID</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Select
              placeholder='Filter by'
              value={filterBy}
              onChange={setFilterBy}
              size='large'
              style={{ width: '100%' }}
            >
              <Option value='all'>All Certificates</Option>
              <Option value='recent'>Recent (30 days)</Option>
            </Select>
          </Col>
        </Row>
      </div>

      {/* Certificates Grid */}
      {filteredAndSortedCertificates.length > 0 ? (
        <Row gutter={[16, 16]}>
          {filteredAndSortedCertificates.map((certificate) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={certificate.id}>
              <CertificateCard certificate={certificate} />
            </Col>
          ))}
        </Row>
      ) : certificates && certificates.length > 0 ? (
        <div className='text-center py-12'>
          <Empty
            description={
              <div>
                <Text type='secondary'>No certificates match your search criteria</Text>
                <br />
                <Text type='secondary'>Try adjusting your search or filter options</Text>
              </div>
            }
          />
        </div>
      ) : (
        <div className='text-center py-12'>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <Title level={4} className='text-gray-600 mb-2'>
                  No Certificates Yet
                </Title>
                <Text type='secondary'>
                  You haven&apos;t earned any certificates yet. Complete courses and pass final
                  exams to earn your first certificate!
                </Text>
              </div>
            }
          />
        </div>
      )}
    </div>
  );
};

export default CertificatesPage;
