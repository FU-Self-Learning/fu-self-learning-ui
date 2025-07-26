'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Steps, Form, Button, Card, Typography, Divider, message, Progress, Affix } from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  EditOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useCreateExam } from '@/hooks/exam/useCreateExam';
import { useTopics } from '@/hooks/topic/useTopics';
import { useCourseInstructorDetail } from '@/hooks/course/instructor/useCourseInstructorDetail';
import { useGenerateQuestionsAI } from '@/hooks/exam/useGenerateQuestionsAI';
import { extractErrorMessage } from '@/utils/ErrorHandle';
import ExamBasicInfoForm from '@/components/test/ExamBasicInfoForm';
import ExamQuestionsStep from '@/components/test/ExamQuestionsStep';
import ExamReviewStep from '@/components/test/ExamReviewStep';
import { useExamQuestions } from '@/hooks/exam/useExamQuestions';

const { Title, Text } = Typography;

export default function CreateExamPage() {
  const router = useRouter();
  const { id: courseId } = useParams();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [autoGenerate, setAutoGenerate] = useState(false);
  const [autoGenerateCount, setAutoGenerateCount] = useState(5);
  const [generateErrors, setGenerateErrors] = useState<Record<number, string>>({});
  const [hasGeneratedQuestions, setHasGeneratedQuestions] = useState(false);

  const createExamMutation = useCreateExam();
  const { data: topics = [] } = useTopics(courseId as string);
  const { generate: generateQuestionsAI, isLoading: isGeneratingQuestions } =
    useGenerateQuestionsAI();
  const { data: course } = useCourseInstructorDetail(courseId as string);

  // Sử dụng custom hook quản lý state câu hỏi
  const {
    questions,
    setQuestions,
    addQuestion,
    removeQuestion,
    updateQuestion,
    addChoice,
    removeChoice,
    updateChoice,
    toggleCorrectAnswer,
  } = useExamQuestions();

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

  // Khi đổi topic hoặc số lượng hoặc autoGenerate, reset flag
  useEffect(() => {
    setHasGeneratedQuestions(false);
  }, [formData.topicIds, autoGenerateCount, autoGenerate]);

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
        if (
          autoGenerate &&
          formData.topicIds &&
          formData.topicIds.length > 0 &&
          !hasGeneratedQuestions
        ) {
          setQuestions([]);
          setGenerateErrors({});
          let allQuestions: any[] = [];
          const errors: Record<number, string> = {};
          for (const topicId of formData.topicIds) {
            const topic = topics.find((t) => t.id === topicId);
            if (topic) {
              try {
                const aiQuestions = await generateQuestionsAI(
                  topicId,
                  topic.title,
                  autoGenerateCount,
                );
                allQuestions = [...allQuestions, ...aiQuestions];
              } catch (err) {
                errors[topicId] =
                  extractErrorMessage(err) ||
                  'Failed to generate questions. Please try again later.';
              }
            }
          }
          // Chỉ giữ đúng số lượng autoGenerateCount
          setQuestions(allQuestions.slice(0, autoGenerateCount));
          setGenerateErrors(errors);
          setHasGeneratedQuestions(true);
          if (Object.keys(errors).length > 0) {
            message.error('Some topics failed to generate questions. Please retry.');
            return;
          }
        }
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
        questions: autoGenerate ? [] : validQuestions,
        autoGenerate,
        autoGenerateCount: autoGenerate ? autoGenerateCount : undefined,
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

  // Retry generate cho từng topic
  const handleRetryGenerate = async (topicId: number) => {
    const topic = topics.find((t) => t.id === topicId);
    if (!topic) return;
    try {
      const aiQuestions = await generateQuestionsAI(topicId, topic.title, autoGenerateCount);
      setQuestions((prev) => [...prev, ...aiQuestions]);
      setGenerateErrors((prev) => {
        const newErr = { ...prev };
        delete newErr[topicId];
        return newErr;
      });
      message.success('Generated questions for topic successfully!');
    } catch (err) {
      setGenerateErrors((prev) => ({
        ...prev,
        [topicId]:
          extractErrorMessage(err) || 'Failed to generate questions. Please try again later.',
      }));
    }
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
              {currentStep === 0 && (
                <ExamBasicInfoForm
                  form={form}
                  formData={formData}
                  topics={topics}
                  autoGenerate={autoGenerate}
                  autoGenerateCount={autoGenerateCount}
                  setAutoGenerate={setAutoGenerate}
                  setAutoGenerateCount={setAutoGenerateCount}
                />
              )}
              {currentStep === 1 && (
                <ExamQuestionsStep
                  questions={questions}
                  topics={topics}
                  addQuestion={addQuestion}
                  removeQuestion={removeQuestion}
                  updateQuestion={updateQuestion}
                  addChoice={addChoice}
                  removeChoice={removeChoice}
                  updateChoice={updateChoice}
                  toggleCorrectAnswer={toggleCorrectAnswer}
                  generateErrors={generateErrors}
                  handleRetryGenerate={handleRetryGenerate}
                  autoGenerate={autoGenerate}
                  isGeneratingQuestions={isGeneratingQuestions}
                  formData={formData}
                />
              )}
              {currentStep === 2 && <ExamReviewStep formData={formData} questions={questions} />}

              {/* Navigation */}
              <Card className='!mt-5 shadow-lg border-0 rounded-xl'>
                <div className='flex justify-between items-center'>
                  <div>
                    {currentStep > 0 && (
                      <Button
                        size='large'
                        onClick={handlePrev}
                        className='rounded-lg'
                        disabled={isGeneratingQuestions}
                      >
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
                        disabled={isGeneratingQuestions}
                        loading={isGeneratingQuestions}
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
                        Create Test
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
