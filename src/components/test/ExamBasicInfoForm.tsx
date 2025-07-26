import { Form, Input, InputNumber, Select, Switch, Card, Typography } from 'antd';
import {
  BookOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  BulbOutlined,
  StarOutlined,
} from '@ant-design/icons';
import React from 'react';

const { Title, Text } = Typography;
const { TextArea } = Input;

export interface ExamBasicInfoFormProps {
  form: any;
  formData: any;
  topics: any[];
  autoGenerate: boolean;
  autoGenerateCount: number;
  setAutoGenerate: (v: boolean) => void;
  setAutoGenerateCount: (v: number) => void;
}

const ExamBasicInfoForm: React.FC<ExamBasicInfoFormProps> = ({
  topics,
  autoGenerate,
  autoGenerateCount,
  setAutoGenerate,
  setAutoGenerateCount,
}) => (
  <div className='space-y-6'>
    <Card
      className='shadow-lg border-0 rounded-xl overflow-hidden'
      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
    >
      <div className='text-white'>
        <div className='flex items-center space-x-3 mb-4'>
          <div className='w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center'>
            <BookOutlined className='text-2xl text-white' />
          </div>
          <div>
            <Title level={3} className='text-white mb-0'>
              Test Information
            </Title>
            <Text className='text-white/80'>Configure your test settings and requirements</Text>
          </div>
        </div>
      </div>
    </Card>
    <Card className='shadow-lg border-0 rounded-xl'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Form.Item
          name='title'
          label={
            <Text strong className='text-gray-700'>
              Test Title
            </Text>
          }
          rules={[{ required: true, message: 'Please enter test title' }]}
        >
          <Input
            placeholder='Enter test title'
            size='large'
            className='rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors'
          />
        </Form.Item>
        <Form.Item
          name='type'
          label={
            <Text strong className='text-gray-700'>
              Test Type
            </Text>
          }
          rules={[{ required: true, message: 'Please select test type' }]}
        >
          <Select
            size='large'
            placeholder='Select test type'
            className='rounded-lg'
            options={[
              { label: '🎯 Practice', value: 'practice' },
              { label: '📝 Quiz', value: 'quiz' },
              { label: '📋 Midterm', value: 'midterm' },
              { label: '🎓 Final', value: 'final' },
            ]}
          />
        </Form.Item>
        <Form.Item
          name='duration'
          label={
            <div className='flex items-center space-x-2'>
              <ClockCircleOutlined className='text-blue-500' />
              <Text strong className='text-gray-700'>
                Duration (minutes)
              </Text>
            </div>
          }
          rules={[{ required: true, message: 'Please enter duration' }]}
        >
          <InputNumber
            min={1}
            max={300}
            size='large'
            className='w-full rounded-lg'
            placeholder='60'
          />
        </Form.Item>
        <Form.Item
          name='passingScore'
          label={
            <div className='flex items-center space-x-2'>
              <TrophyOutlined className='text-green-500' />
              <Text strong className='text-gray-700'>
                Passing Score (%)
              </Text>
            </div>
          }
          rules={[{ required: true, message: 'Please enter passing score' }]}
        >
          <InputNumber
            min={0}
            max={100}
            size='large'
            className='w-full rounded-lg'
            placeholder='70'
          />
        </Form.Item>
      </div>
      <Form.Item
        name='description'
        label={
          <Text strong className='text-gray-700'>
            Description
          </Text>
        }
        rules={[{ required: true, message: 'Please enter description' }]}
      >
        <TextArea
          rows={4}
          placeholder='Enter test description...'
          size='large'
          className='rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors'
        />
      </Form.Item>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Form.Item
          name='topicIds'
          label={
            <Text strong className='text-gray-700'>
              Related Topics
            </Text>
          }
          rules={[{ required: true, message: 'Please select at least one topic' }]}
        >
          <Select
            mode='multiple'
            size='large'
            placeholder='Select topics'
            className='rounded-lg'
            options={topics.map((topic) => ({ label: topic.title, value: topic.id }))}
          />
        </Form.Item>
        <div className='space-y-4'>
          <div className='p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200'>
            <Form.Item
              label={
                <span>
                  <BulbOutlined className='text-purple-500' /> Auto-generate Questions (AI)
                </span>
              }
              className='mb-2'
            >
              <Switch checked={autoGenerate} onChange={setAutoGenerate} />
              {autoGenerate && (
                <div className='mt-2 flex items-center gap-2'>
                  <span>Number of questions:</span>
                  <InputNumber
                    min={1}
                    max={100}
                    value={autoGenerateCount}
                    onChange={(v) => setAutoGenerateCount(v ?? 1)}
                  />
                </div>
              )}
            </Form.Item>
            <Form.Item name='shuffleQuestions' valuePropName='checked' className='mb-2'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <BulbOutlined className='text-purple-500' />
                  <Text strong className='text-gray-700'>
                    Shuffle Questions
                  </Text>
                </div>
                <Switch />
              </div>
            </Form.Item>
            <Form.Item name='shuffleAnswers' valuePropName='checked' className='mb-0'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <StarOutlined className='text-purple-500' />
                  <Text strong className='text-gray-700'>
                    Shuffle Answers
                  </Text>
                </div>
                <Switch />
              </div>
            </Form.Item>
          </div>
        </div>
      </div>
    </Card>
  </div>
);

export default ExamBasicInfoForm;
