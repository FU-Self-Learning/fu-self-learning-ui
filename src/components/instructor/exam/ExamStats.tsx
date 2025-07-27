'use client';

import React from 'react';
import { Card, Typography, Row, Col, Statistic, Progress, Empty } from 'antd';
import {
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { ExamResponse } from '@/types/examType';
import { getExamTypeLabel } from '@/utils/examTypeMapper';

const { Title, Text } = Typography;

interface ExamStatsProps {
  courseId: string;
  exams: ExamResponse[];
}

const ExamStats: React.FC<ExamStatsProps> = ({ courseId, exams }) => {
  console.log(courseId);

  const topicExams = exams.filter((exam) => exam.type === 'topic_exam');
  const finalExam = exams.find((exam) => exam.type === 'final_exam');
  const practiceExams = exams.filter((exam) => exam.type === 'practice');

  const totalExams = exams.length;
  const activeExams = exams.filter((exam) => exam.isActive).length;
  const totalQuestions = exams.reduce((sum, exam) => sum + exam.questionCount, 0);
  const averageDuration =
    totalExams > 0
      ? Math.round(exams.reduce((sum, exam) => sum + exam.duration, 0) / totalExams)
      : 0;
  const averagePassingScore =
    totalExams > 0
      ? Math.round(exams.reduce((sum, exam) => sum + Number(exam.passingScore), 0) / totalExams)
      : 0;

  const examTypeDistribution = {
    topicExams: topicExams.length,
    finalExam: finalExam ? 1 : 0,
    practiceExams: practiceExams.length,
  };

  const getExamTypePercentage = (type: keyof typeof examTypeDistribution) => {
    return totalExams > 0 ? (examTypeDistribution[type] / totalExams) * 100 : 0;
  };

  if (totalExams === 0) {
    return (
      <div className='text-center py-12'>
        <Empty description='No exams created yet' image={Empty.PRESENTED_IMAGE_SIMPLE} />
        <Text type='secondary'>Create exams to see statistics and analytics</Text>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Overview Statistics */}
      <Card title='Exam Overview' className='shadow-sm'>
        <Row gutter={24}>
          <Col span={6}>
            <Statistic
              title='Total Exams'
              value={totalExams}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title='Active Exams'
              value={activeExams}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title='Total Questions'
              value={totalQuestions}
              prefix={<StarOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title='Avg. Duration'
              value={averageDuration}
              suffix='min'
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Col>
        </Row>
      </Card>

      {/* Exam Type Distribution */}
      <Card title='Exam Type Distribution' className='shadow-sm'>
        <Row gutter={24}>
          <Col span={8}>
            <div className='text-center'>
              <div className='mb-2'>
                <Progress
                  type='circle'
                  percent={getExamTypePercentage('topicExams')}
                  format={() => `${topicExams.length}`}
                  strokeColor='#1890ff'
                />
              </div>
              <Title level={5}>{getExamTypeLabel('topic_exam')}</Title>
              <Text type='secondary'>{topicExams.length} exams</Text>
            </div>
          </Col>
          <Col span={8}>
            <div className='text-center'>
              <div className='mb-2'>
                <Progress
                  type='circle'
                  percent={getExamTypePercentage('finalExam')}
                  format={() => `${finalExam ? 1 : 0}`}
                  strokeColor='#52c41a'
                />
              </div>
              <Title level={5}>{getExamTypeLabel('final_exam')}</Title>
              <Text type='secondary'>{finalExam ? '1 exam' : 'Not created'}</Text>
            </div>
          </Col>
          <Col span={8}>
            <div className='text-center'>
              <div className='mb-2'>
                <Progress
                  type='circle'
                  percent={getExamTypePercentage('practiceExams')}
                  format={() => `${practiceExams.length}`}
                  strokeColor='#722ed1'
                />
              </div>
              <Title level={5}>{getExamTypeLabel('practice')}</Title>
              <Text type='secondary'>{practiceExams.length} exams</Text>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Exam Details */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title={getExamTypeLabel('topic_exam')} className='shadow-sm'>
            {topicExams.length > 0 ? (
              <div className='space-y-3'>
                {topicExams.map((exam) => (
                  <div
                    key={exam.id}
                    className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'
                  >
                    <div>
                      <Text strong>{exam.title}</Text>
                      <div className='text-xs text-gray-500'>
                        {exam.questionCount} questions • {exam.duration} min
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='text-sm font-semibold'>{exam.passingScore}%</div>
                      <div className='text-xs text-gray-500'>Passing Score</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty description='No topic exams created' />
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card title={getExamTypeLabel('practice')} className='shadow-sm'>
            {practiceExams.length > 0 ? (
              <div className='space-y-3'>
                {practiceExams.map((exam) => (
                  <div
                    key={exam.id}
                    className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'
                  >
                    <div>
                      <Text strong>{exam.title}</Text>
                      <div className='text-xs text-gray-500'>
                        {exam.questionCount} questions • {exam.duration} min
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='text-sm font-semibold'>{exam.passingScore}%</div>
                      <div className='text-xs text-gray-500'>Passing Score</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty description='No practice tests created' />
            )}
          </Card>
        </Col>
      </Row>

      {/* Final Exam Details */}
      {finalExam && (
        <Card title='Final Exam Details' className='shadow-sm'>
          <div className='flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg'>
            <div>
              <Title level={4} className='mb-2'>
                {finalExam.title}
              </Title>
              <Text type='secondary'>{finalExam.description}</Text>
            </div>
            <div className='text-right'>
              <div className='text-2xl font-bold text-blue-600'>{finalExam.questionCount}</div>
              <div className='text-sm text-gray-500'>Questions</div>
              <div className='text-lg font-semibold text-green-600 mt-1'>
                {finalExam.passingScore}%
              </div>
              <div className='text-sm text-gray-500'>Passing Score</div>
            </div>
          </div>
        </Card>
      )}

      {/* Average Statistics */}
      <Card title='Average Statistics' className='shadow-sm'>
        <Row gutter={24}>
          <Col span={8}>
            <Statistic
              title='Average Passing Score'
              value={averagePassingScore}
              suffix='%'
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title='Average Duration'
              value={averageDuration}
              suffix='min'
              valueStyle={{ color: '#fa8c16' }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title='Average Questions'
              value={totalExams > 0 ? Math.round(totalQuestions / totalExams) : 0}
              valueStyle={{ color: '#722ed1' }}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ExamStats;
