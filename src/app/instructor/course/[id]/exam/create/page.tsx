'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Steps,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Button,
  Card,
  Typography,
  Divider,
  message,
  Checkbox,
  Progress,
  Affix,
  Badge,
  Tag,
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  CheckCircleOutlined,
  EditOutlined,
  FileTextOutlined,
  BookOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  BulbOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { useCreateExam } from '@/hooks/exam/useCreateExam';
import { useTopics } from '@/hooks/topic/useTopics';
import { useCourseInstructorDetail } from '@/hooks/course/instructor/useCourseInstructorDetail';
import { ExamQuestionFormData } from '@/types/examType';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function CreateExamPage() {
  const router = useRouter();
  const { id: courseId } = useParams();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [questions, setQuestions] = useState<ExamQuestionFormData[]>([
    {
      question_text: '',
      correct_answer: [],
      choices: ['', ''],
      topicId: 0,
    },
  ]);

  const createExamMutation = useCreateExam();
  const { data: topics = [] } = useTopics(courseId as string);
  const { data: course } = useCourseInstructorDetail(courseId as string);

  // Auto-save draft functionality
  const saveDraft = useCallback(() => {
    const draftData = {
      formData,
      questions,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(`exam-draft-${courseId}`, JSON.stringify(draftData));
  }, [formData, questions, courseId]);

  // Load draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(`exam-draft-${courseId}`);
    if (savedDraft) {
      try {
        const { formData: savedFormData, questions: savedQuestions } = JSON.parse(savedDraft);
        if (savedFormData && Object.keys(savedFormData).length > 0) {
          setFormData(savedFormData);
          form.setFieldsValue(savedFormData);
        }
        if (savedQuestions && savedQuestions.length > 0) {
          setQuestions(savedQuestions);
        }
        message.info('Draft loaded successfully');
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, [courseId, form]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(saveDraft, 30000);
    return () => clearInterval(interval);
  }, [saveDraft]);

  // Calculate form completion percentage
  const calculateProgress = () => {
    let totalFields = 0;
    let completedFields = 0;

    // Basic info fields
    const basicFields = ['title', 'description', 'type', 'duration', 'passingScore', 'topicIds'];
    totalFields += basicFields.length;
    basicFields.forEach((field) => {
      if (formData[field] && (Array.isArray(formData[field]) ? formData[field].length > 0 : true)) {
        completedFields++;
      }
    });

    // Questions validation
    const validQuestions = questions.filter(
      (q) =>
        q.question_text.trim() &&
        q.choices.length >= 2 &&
        q.choices.every((choice) => choice.trim()) &&
        q.correct_answer.length > 0 &&
        q.topicId > 0,
    );

    totalFields += questions.length;
    completedFields += validQuestions.length;

    return Math.round((completedFields / totalFields) * 100);
  };

  const steps = [
    {
      title: 'Basic Information',
      description: 'Test details and settings',
      icon: <EditOutlined />,
    },
    {
      title: 'Questions',
      description: 'Create test questions',
      icon: <FileTextOutlined />,
    },
    {
      title: 'Review & Publish',
      description: 'Review and create test',
      icon: <CheckCircleOutlined />,
    },
  ];

  const handleFormValuesChange = (changedValues: any, allValues: any) => {
    setFormData(allValues);
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      try {
        await form.validateFields([
          'title',
          'description',
          'type',
          'duration',
          'passingScore',
          'topicIds',
        ]);
        setCurrentStep(1);
      } catch (error) {
        console.log(error);
        message.error('Please fill in all required fields');
      }
    } else if (currentStep === 1) {
      const validQuestions = questions.filter(
        (q) =>
          q.question_text.trim() &&
          q.choices.length >= 2 &&
          q.choices.every((choice) => choice.trim()) &&
          q.correct_answer.length > 0 &&
          q.topicId > 0,
      );

      if (validQuestions.length === 0) {
        message.error('Please add at least one valid question');
        return;
      }
      setCurrentStep(2);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      const validQuestions = questions.filter(
        (q) =>
          q.question_text.trim() &&
          q.choices.length >= 2 &&
          q.choices.every((choice) => choice.trim()) &&
          q.correct_answer.length > 0 &&
          q.topicId > 0,
      );

      const examData = {
        ...formData,
        courseId: parseInt(courseId as string),
        questions: validQuestions,
      };

      await createExamMutation.mutateAsync(examData);
      localStorage.removeItem(`exam-draft-${courseId}`);
      router.push(`/instructor/course/${courseId}`);
    } catch (error) {
      console.error('Failed to create test:', error);
    }
  };

  const handleBackToCourse = () => {
    router.push(`/instructor/course/${courseId}`);
  };

  const handleSaveDraft = () => {
    saveDraft();
    message.success('Draft saved!');
  };

  const clearDraft = () => {
    localStorage.removeItem(`exam-draft-${courseId}`);
    setFormData({});
    setQuestions([
      {
        question_text: '',
        correct_answer: [],
        choices: ['', ''],
        topicId: 0,
      },
    ]);
    form.resetFields();
    message.success('Draft cleared!');
  };

  // Question management functions
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: '',
        correct_answer: [],
        choices: ['', ''],
        topicId: 0,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
    }
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const addChoice = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].choices.push('');
    setQuestions(newQuestions);
  };

  const removeChoice = (questionIndex: number, choiceIndex: number) => {
    if (questions[questionIndex].choices.length > 2) {
      const newQuestions = [...questions];
      const removedChoice = newQuestions[questionIndex].choices[choiceIndex];
      newQuestions[questionIndex].choices.splice(choiceIndex, 1);
      newQuestions[questionIndex].correct_answer = newQuestions[
        questionIndex
      ].correct_answer.filter((answer) => answer !== removedChoice);
      setQuestions(newQuestions);
    }
  };

  const updateChoice = (questionIndex: number, choiceIndex: number, value: string) => {
    const newQuestions = [...questions];
    const oldChoice = newQuestions[questionIndex].choices[choiceIndex];
    newQuestions[questionIndex].choices[choiceIndex] = value;

    // Update correct answers if this choice was selected
    if (newQuestions[questionIndex].correct_answer.includes(oldChoice)) {
      const correctAnswerIndex = newQuestions[questionIndex].correct_answer.indexOf(oldChoice);
      newQuestions[questionIndex].correct_answer[correctAnswerIndex] = value;
    }

    setQuestions(newQuestions);
  };

  const toggleCorrectAnswer = (questionIndex: number, choice: string, checked: boolean) => {
    const newQuestions = [...questions];
    if (checked) {
      if (!newQuestions[questionIndex].correct_answer.includes(choice)) {
        newQuestions[questionIndex].correct_answer.push(choice);
      }
    } else {
      newQuestions[questionIndex].correct_answer = newQuestions[
        questionIndex
      ].correct_answer.filter((answer) => answer !== choice);
    }
    setQuestions(newQuestions);
  };

  const renderBasicInfo = () => (
    <div className='space-y-6'>
      <Card
        className='shadow-lg border-0 rounded-xl overflow-hidden'
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
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
              options={topics.map((topic) => ({
                label: topic.title,
                value: topic.id,
              }))}
            />
          </Form.Item>

          <div className='space-y-4'>
            <div className='p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200'>
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

  const renderQuestions = () => (
    <div className='space-y-6'>
      <Card className='shadow-lg border-0 rounded-xl overflow-hidden'>
        <div className='text-white'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center'>
                <FileTextOutlined className='text-2xl text-white' />
              </div>
              <div>
                <Title level={3} className='text-white mb-0'>
                  Questions <Badge count={questions.length} className='ml-2' />
                </Title>
                <Text className='text-white/80'>Create engaging questions for your test</Text>
              </div>
            </div>
            <Button
              type='primary'
              size='large'
              icon={<PlusOutlined />}
              onClick={addQuestion}
              className='bg-white/20 border-white/30 hover:bg-white/30 transition-all'
            >
              Add Question
            </Button>
          </div>
        </div>
      </Card>

      <div className='space-y-6 mt-5'>
        {questions.map((question, qIndex) => (
          <Card
            key={qIndex}
            className='shadow-lg border-0 rounded-xl overflow-hidden hover:shadow-xl transition-shadow'
          >
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center space-x-3'>
                <div className='w-10 h-10 rounded-lg flex items-center justify-center'>
                  <Text className='text-white font-bold'>{qIndex + 1}</Text>
                </div>
                <Title level={5} className='mb-0'>
                  Question {qIndex + 1}
                </Title>
              </div>
              {questions.length > 1 && (
                <Button
                  type='text'
                  danger
                  icon={<MinusCircleOutlined />}
                  onClick={() => removeQuestion(qIndex)}
                  className='hover:bg-red-50 rounded-lg'
                >
                  Remove
                </Button>
              )}
            </div>

            <div className='space-y-4'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                <div>
                  <Text strong className='text-gray-700 block mb-2'>
                    Question Text
                  </Text>
                  <TextArea
                    placeholder='Enter your question here...'
                    value={question.question_text}
                    onChange={(e) => updateQuestion(qIndex, 'question_text', e.target.value)}
                    rows={3}
                    className='rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors'
                  />
                </div>
                <div>
                  <Text strong className='text-gray-700 block mb-2'>
                    Related Topic
                  </Text>
                  <Select
                    value={question.topicId || undefined}
                    placeholder='Select topic'
                    onChange={(value) => updateQuestion(qIndex, 'topicId', value)}
                    className='w-full rounded-lg'
                    size='large'
                    options={topics.map((topic) => ({
                      label: topic.title,
                      value: topic.id,
                    }))}
                  />
                </div>
              </div>

              <div>
                <div className='flex justify-between items-center mb-3'>
                  <Text strong className='text-gray-700'>
                    Answer Choices
                  </Text>
                  <Button
                    type='dashed'
                    size='small'
                    icon={<PlusOutlined />}
                    onClick={() => addChoice(qIndex)}
                    className='rounded-lg hover:border-blue-400 hover:text-blue-500 transition-colors'
                  >
                    Add Choice
                  </Button>
                </div>
                <div className='space-y-3'>
                  {question.choices.map((choice, cIndex) => (
                    <div
                      key={cIndex}
                      className='flex gap-3 items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
                    >
                      <div className='flex items-center mt-1'>
                        <div className='w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3'>
                          {String.fromCharCode(65 + cIndex)}
                        </div>
                        <Checkbox
                          checked={question.correct_answer.includes(choice) && choice.trim() !== ''}
                          onChange={(e) => toggleCorrectAnswer(qIndex, choice, e.target.checked)}
                          disabled={choice.trim() === ''}
                          className='mr-3'
                        />
                      </div>
                      <Input
                        placeholder={`Choice ${String.fromCharCode(65 + cIndex)}`}
                        value={choice}
                        onChange={(e) => updateChoice(qIndex, cIndex, e.target.value)}
                        className='flex-1 rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors'
                        status={choice.trim() === '' ? 'warning' : undefined}
                      />
                      {question.choices.length > 2 && (
                        <Button
                          type='text'
                          danger
                          size='small'
                          icon={<MinusCircleOutlined />}
                          onClick={() => removeChoice(qIndex, cIndex)}
                          className='hover:bg-red-50 rounded-lg'
                        />
                      )}
                    </div>
                  ))}
                </div>
                {question.correct_answer.length === 0 && question.question_text && (
                  <Text type='danger' className='text-sm block mt-2'>
                    ⚠️ Please select at least one correct answer
                  </Text>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderReview = () => {
    const validQuestions = questions.filter(
      (q) =>
        q.question_text.trim() &&
        q.choices.length >= 2 &&
        q.choices.every((choice) => choice.trim()) &&
        q.correct_answer.length > 0 &&
        q.topicId > 0,
    );

    return (
      <div className='space-y-6'>
        <Card
          className='shadow-lg border-0 rounded-xl overflow-hidden'
          style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          }}
        >
          <div className='text-white'>
            <div className='flex items-center space-x-3'>
              <div className='w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center'>
                <CheckCircleOutlined className='text-2xl text-white' />
              </div>
              <div>
                <Title level={3} className='text-white mb-0'>
                  Review & Publish
                </Title>
                <Text className='text-white/80'>Review your test before publishing</Text>
              </div>
            </div>
          </div>
        </Card>

        <Card className='shadow-lg border-0 rounded-xl'>
          <Title level={4} className='text-gray-800 mb-4'>
            📋 Test Summary
          </Title>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
            <div className='p-3 bg-blue-50 rounded-lg'>
              <Text strong className='text-blue-700'>
                Title:
              </Text>
              <div className='text-gray-800 mt-1'>{formData.title}</div>
            </div>
            <div className='p-3 bg-purple-50 rounded-lg'>
              <Text strong className='text-purple-700'>
                Type:
              </Text>
              <Tag color='purple' className='ml-2 capitalize'>
                {formData.type}
              </Tag>
            </div>
            <div className='p-3 bg-green-50 rounded-lg'>
              <Text strong className='text-green-700'>
                Duration:
              </Text>
              <div className='text-gray-800 mt-1'>{formData.duration} minutes</div>
            </div>
            <div className='p-3 bg-orange-50 rounded-lg'>
              <Text strong className='text-orange-700'>
                Passing Score:
              </Text>
              <div className='text-gray-800 mt-1'>{formData.passingScore}%</div>
            </div>
          </div>

          <div className='p-4 bg-gray-50 rounded-lg mb-4'>
            <Text strong className='text-gray-700'>
              Description:
            </Text>
            <Paragraph className='mt-2 mb-0 text-gray-600'>{formData.description}</Paragraph>
          </div>

          <div className='flex flex-wrap gap-2 mb-4'>
            <Text strong className='text-gray-700'>
              Settings:
            </Text>
            <Tag color={formData.shuffleQuestions ? 'blue' : 'default'}>
              🔀 Shuffle Questions: {formData.shuffleQuestions ? 'Yes' : 'No'}
            </Tag>
            <Tag color={formData.shuffleAnswers ? 'blue' : 'default'}>
              🎲 Shuffle Answers: {formData.shuffleAnswers ? 'Yes' : 'No'}
            </Tag>
          </div>
        </Card>

        <Card className='shadow-lg border-0 rounded-xl'>
          <Title level={4} className='text-gray-800 mb-4'>
            ❓ Questions Preview
            <Badge count={validQuestions.length} className='ml-2' />
          </Title>
          {validQuestions.map((question, index) => (
            <Card key={index} size='small' className='mb-4 border border-gray-200 rounded-lg'>
              <div className='mb-3'>
                <Text strong className='text-blue-600'>
                  Q{index + 1}:
                </Text>
                <Text className='ml-2 text-gray-800'>{question.question_text}</Text>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                {question.choices.map((choice, cIndex) => (
                  <div key={cIndex} className='flex items-center space-x-2'>
                    <div className='w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold'>
                      {String.fromCharCode(65 + cIndex)}
                    </div>
                    <Text
                      className={
                        question.correct_answer.includes(choice)
                          ? 'text-green-600 font-medium'
                          : 'text-gray-600'
                      }
                    >
                      {choice}
                      {question.correct_answer.includes(choice) && ' ✅'}
                    </Text>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </Card>
      </div>
    );
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50'>
      <div
        className='bg-white shadow-lg border-b'
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 10,
        }}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-20'>
            <div className='flex items-center space-x-4'>
              <Button
                type='text'
                icon={<ArrowLeftOutlined />}
                onClick={handleBackToCourse}
                className='text-white hover:bg-white/10 border-white/30 rounded-lg'
              >
                Back to Course
              </Button>
              <Divider type='vertical' className='border-white/30' />
              <div>
                <Title level={3} className='text-white mb-0'>
                  ✨ Create New Test
                </Title>
                <Text className='text-white/80'>{course?.title}</Text>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Button
                type='default'
                icon={<SaveOutlined />}
                onClick={handleSaveDraft}
                className='bg-white/10 text-white border-white/30 hover:bg-white/20 rounded-lg'
              >
                Save Draft
              </Button>
              <div className='!text-white text-right'>
                <Progress
                  percent={calculateProgress()}
                  size={{ height: 8, width: 120 }}
                  strokeColor='#ffffff'
                  trailColor='rgba(255,255,255,0.3)'
                  showInfo={false}
                />
                <div className='text-white/80 text-sm'>{calculateProgress()}% Complete</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Sidebar with Steps */}
          <div className='lg:col-span-1'>
            <Affix offsetTop={120}>
              <Card className='shadow-lg border-0 rounded-xl'>
                <Steps direction='vertical' current={currentStep} items={steps} className='mb-6' />
                <Divider />
                <div className='space-y-3'>
                  <Button
                    block
                    onClick={handleSaveDraft}
                    className='rounded-lg bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 transition-colors'
                  >
                    💾 Save Draft
                  </Button>
                  <Button
                    block
                    danger
                    type='text'
                    onClick={clearDraft}
                    className='rounded-lg hover:bg-red-50 transition-colors'
                  >
                    🗑️ Clear Draft
                  </Button>
                </div>
              </Card>
            </Affix>
          </div>

          {/* Main Content */}
          <div className='lg:col-span-3'>
            <Form
              form={form}
              layout='vertical'
              onValuesChange={handleFormValuesChange}
              initialValues={{
                duration: 60,
                passingScore: 70,
                type: 'practice',
                shuffleQuestions: false,
                shuffleAnswers: false,
                topicIds: [],
              }}
            >
              {currentStep === 0 && renderBasicInfo()}
              {currentStep === 1 && renderQuestions()}
              {currentStep === 2 && renderReview()}

              {/* Navigation */}
              <Card className='!mt-5 shadow-lg border-0 rounded-xl'>
                <div className='flex justify-between items-center'>
                  <div>
                    {currentStep > 0 && (
                      <Button size='large' onClick={handlePrev} className='rounded-lg'>
                        ← Previous
                      </Button>
                    )}
                  </div>
                  <div className='space-x-3'>
                    {currentStep < steps.length - 1 && (
                      <Button
                        type='primary'
                        size='large'
                        onClick={handleNext}
                        className='rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 border-0 hover:shadow-lg transition-all'
                      >
                        Next →
                      </Button>
                    )}
                    {currentStep === steps.length - 1 && (
                      <Button
                        type='primary'
                        size='large'
                        loading={createExamMutation.isPending}
                        onClick={handleSubmit}
                        icon={<CheckCircleOutlined />}
                        className='rounded-lg bg-gradient-to-r from-green-500 to-blue-500 border-0 hover:shadow-lg transition-all'
                      >
                        🚀 Create Test
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
