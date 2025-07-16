'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Switch,
  Button,
  Row,
  Col,
  Tag,
  message,
  Typography,
  Alert,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useUpdateStudySet } from '@/hooks/study-set/useUpdateStudySet';
import { useCreateStudySet } from '@/hooks/study-set/useCreateStudySet';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface StudySetCreateFormProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  onCancel: () => void;
  studySet?: any; // For edit mode
}

interface FlashCard {
  id: string;
  front_text: string;
  back_text: string;
}

interface StudySetFormData {
  name: string;
  description: string;
  tags: string[];
  isPublic: boolean;
  password?: string;
}

const StudySetCreateForm: React.FC<StudySetCreateFormProps> = ({
  currentStep,
  onStepChange,
  onCancel,
  studySet,
}) => {
  const [form] = Form.useForm();
  const { mutate: createStudySet, isPending } = useCreateStudySet();
  const { mutate: updateStudySet, isPending: isUpdating } = useUpdateStudySet();
  const router = useRouter();

  const isEdit = !!studySet;

  // Centralized state management for all form data
  const [formData, setFormData] = useState<StudySetFormData>({
    name: '',
    description: '',
    tags: [],
    isPublic: true,
    password: '',
  });

  const [flashcards, setFlashcards] = useState<FlashCard[]>([
    { id: '1', front_text: '', back_text: '' },
    { id: '2', front_text: '', back_text: '' },
  ]);

  // Initialize form values and state
  useEffect(() => {
    if (studySet) {
      const initialData = {
        name: studySet.name || '',
        description: studySet.description || '',
        tags: studySet.tags || [],
        isPublic: studySet.isPublic ?? true,
        password: studySet.password || '',
      };

      setFormData(initialData);
      form.setFieldsValue(initialData);

      if (studySet.flashcards && studySet.flashcards.length > 0) {
        setFlashcards(studySet.flashcards);
      }
    } else {
      // Set default values for new study set
      const defaultData = {
        name: '',
        description: '',
        tags: [],
        isPublic: true,
        password: '',
      };
      setFormData(defaultData);
      form.setFieldsValue(defaultData);
    }
  }, [studySet, form]);

  // Update form data in state whenever form values change
  const updateFormData = (changedFields: Partial<StudySetFormData>) => {
    setFormData((prev) => ({ ...prev, ...changedFields }));
  };

  // Save current step data before moving to next/previous step
  const saveCurrentStepData = () => {
    const currentFormData = form.getFieldsValue();
    updateFormData(currentFormData);
  };

  // Step 1: Basic Information
  const renderBasicInfo = () => (
    <Card title='Basic Information' className='mb-4'>
      <Form
        form={form}
        layout='vertical'
        initialValues={formData}
        onValuesChange={(changedValues) => updateFormData(changedValues)}
      >
        <Row gutter={[16, 0]}>
          <Col span={24}>
            <Form.Item
              label='Study Set Title'
              name='name'
              rules={[{ required: true, message: 'Please enter study set name' }]}
            >
              <Input placeholder="Enter a title, like 'Biology - Chapter 1'" size='large' />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label='Description' name='description'>
              <TextArea rows={3} placeholder='Add a description...' showCount maxLength={500} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label='Tags' name='tags'>
              <Select
                mode='tags'
                placeholder='Add tags to help others find your set'
                tokenSeparators={[',']}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label='Visibility' name='isPublic' valuePropName='checked'>
              <div>
                <Switch
                  checked={formData.isPublic}
                  onChange={(checked) => {
                    updateFormData({ isPublic: checked });
                    form.setFieldsValue({ isPublic: checked });
                  }}
                  checkedChildren='Public'
                  unCheckedChildren='Private'
                />
                <div className='mt-2'>
                  <Text type='secondary' className='text-sm'>
                    {formData.isPublic
                      ? 'Anyone can see this study set'
                      : 'Only you can see this study set'}
                  </Text>
                </div>
              </div>
            </Form.Item>
          </Col>

          {!formData.isPublic && (
            <Col span={24}>
              <Form.Item
                label='Password (Optional)'
                name='password'
                help='Set a password for others to access your private study set'
              >
                <Input.Password placeholder='Enter password' />
              </Form.Item>
            </Col>
          )}
        </Row>

        <div className='flex justify-end gap-2 mt-6'>
          <Button onClick={onCancel} size='large'>
            Cancel
          </Button>
          <Button
            type='primary'
            size='large'
            onClick={() => {
              form.validateFields(['name']).then(() => {
                saveCurrentStepData();
                onStepChange(1);
              });
            }}
          >
            Continue
          </Button>
        </div>
      </Form>
    </Card>
  );

  // Step 2: Study Cards
  const renderStudyCards = () => {
    const addFlashCard = () => {
      const newCard: FlashCard = {
        id: Date.now().toString(),
        front_text: '',
        back_text: '',
      };
      setFlashcards([...flashcards, newCard]);
    };

    const removeFlashCard = (id: string) => {
      if (flashcards.length > 2) {
        setFlashcards(flashcards.filter((card) => card.id !== id));
      } else {
        message.warning('You need at least 2 cards');
      }
    };

    const updateFlashCard = (id: string, field: 'front_text' | 'back_text', value: string) => {
      setFlashcards(
        flashcards.map((card) => (card.id === id ? { ...card, [field]: value } : card)),
      );
    };

    return (
      <Card title='Study Cards' className='mb-4'>
        <Alert
          message='Create your flashcards'
          description='Add terms and definitions. You need at least 2 cards to create a study set.'
          type='info'
          showIcon
          className='mb-4'
        />

        <div className='space-y-4'>
          {flashcards.map((card, index) => (
            <Card
              key={card.id}
              size='small'
              className='border-l-4 border-l-blue-500'
              title={`Card ${index + 1}`}
              extra={
                flashcards.length > 2 && (
                  <Button
                    type='text'
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeFlashCard(card.id)}
                  />
                )
              }
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Text strong>Front (Term)</Text>
                  <TextArea
                    value={card.front_text}
                    onChange={(e) => updateFlashCard(card.id, 'front_text', e.target.value)}
                    placeholder='Enter term'
                    rows={3}
                    className='mt-1'
                  />
                </Col>
                <Col span={12}>
                  <Text strong>Back (Definition)</Text>
                  <TextArea
                    value={card.back_text}
                    onChange={(e) => updateFlashCard(card.id, 'back_text', e.target.value)}
                    placeholder='Enter definition'
                    rows={3}
                    className='mt-1'
                  />
                </Col>
              </Row>
            </Card>
          ))}
        </div>

        <Button
          type='dashed'
          onClick={addFlashCard}
          icon={<PlusOutlined />}
          size='large'
          className='w-full mt-4'
        >
          Add Card
        </Button>

        <div className='flex justify-between mt-6'>
          <Button
            size='large'
            onClick={() => {
              // Save flashcard data before going back
              onStepChange(0);
            }}
          >
            Back
          </Button>
          <div className='space-x-2'>
            <Button onClick={onCancel} size='large'>
              Cancel
            </Button>
            <Button
              type='primary'
              size='large'
              onClick={() => {
                // Save flashcard data before proceeding
                onStepChange(2);
              }}
              disabled={
                flashcards.filter((card) => card.front_text.trim() && card.back_text.trim())
                  .length < 2
              }
            >
              Continue
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  // Step 3: Settings & Review
  const renderSettingsReview = () => {
    const handleSubmit = () => {
      // Use saved form data instead of getting from form directly
      const validCards = flashcards.filter(
        (card) => card.front_text.trim() && card.back_text.trim(),
      );

      const finalData = {
        ...formData,
        flashcards: validCards,
      };

      if (isEdit) {
        updateStudySet(
          { id: studySet.id, ...finalData },
          {
            onSuccess: () => {
              message.success('Study set updated successfully!');
              router.push('/my-study-sets');
            },
            onError: () => {
              message.error('Failed to update study set');
            },
          },
        );
      } else {
        createStudySet(finalData, {
          onSuccess: () => {
            router.push('/my-study-sets');
          },
        });
      }
    };

    const validCards = flashcards.filter((card) => card.front_text.trim() && card.back_text.trim());

    return (
      <Card title='Review & Create' className='mb-4'>
        <div className='space-y-6'>
          {/* Summary */}
          <div>
            <Title level={4}>Study Set Summary</Title>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text strong>Title:</Text>
                  <div>{formData.name}</div>
                </Col>
                <Col span={12}>
                  <Text strong>Cards:</Text>
                  <div>{validCards.length} cards</div>
                </Col>
                <Col span={12}>
                  <Text strong>Visibility:</Text>
                  <div>
                    <Tag color={formData.isPublic ? 'green' : 'orange'}>
                      {formData.isPublic ? 'Public' : 'Private'}
                    </Tag>
                  </div>
                </Col>
                <Col span={12}>
                  <Text strong>Tags:</Text>
                  <div>
                    {formData.tags && formData.tags.length > 0
                      ? formData.tags.map((tag: string) => <Tag key={tag}>{tag}</Tag>)
                      : 'No tags'}
                  </div>
                </Col>
                {!formData.isPublic && formData.password && (
                  <Col span={24}>
                    <Text strong>Password Protection:</Text>
                    <div>✓ Password protected</div>
                  </Col>
                )}
              </Row>
            </div>
          </div>

          {/* Preview Cards */}
          <div>
            <Title level={4}>Card Preview</Title>
            <div className='max-h-60 overflow-y-auto'>
              {validCards.slice(0, 3).map((card, index) => (
                <Card key={card.id} size='small' className='mb-2'>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Text strong>#{index + 1} Front:</Text>
                      <div className='text-sm'>{card.front_text}</div>
                    </Col>
                    <Col span={12}>
                      <Text strong>Back:</Text>
                      <div className='text-sm'>{card.back_text}</div>
                    </Col>
                  </Row>
                </Card>
              ))}
              {validCards.length > 3 && (
                <Text type='secondary'>... and {validCards.length - 3} more cards</Text>
              )}
            </div>
          </div>
        </div>

        <div className='flex justify-between mt-6'>
          <Button
            size='large'
            onClick={() => {
              // Go back to step 1 (cards)
              onStepChange(1);
            }}
          >
            Back
          </Button>
          <div className='space-x-2'>
            <Button onClick={onCancel} size='large'>
              Cancel
            </Button>
            <Button
              type='primary'
              size='large'
              loading={isPending || isUpdating}
              onClick={handleSubmit}
            >
              {isEdit ? 'Update Study Set' : 'Create Study Set'}
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderBasicInfo();
      case 1:
        return renderStudyCards();
      case 2:
        return renderSettingsReview();
      default:
        return renderBasicInfo();
    }
  };

  return <div>{renderStepContent()}</div>;
};

export default StudySetCreateForm;
