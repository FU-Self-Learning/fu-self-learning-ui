'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Steps, Form, Button, Card, Typography, Divider, message, Progress, Alert } from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  EditOutlined,
  FileTextOutlined,
  BookOutlined,
  TrophyOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { useCreateExam } from '@/hooks/exam/useCreateExam';
import { useCreateTopicExam } from '@/hooks/exam/useCreateTopicExam';
import { useCreateFinalExam } from '@/hooks/exam/useCreateFinalExam';
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
  const params = useParams();
  const searchParams = useSearchParams();
  const courseId = params.id as string;
  const examType = searchParams.get('type') || 'practice'; // practice, topic_exam, final_exam
  const topicId = searchParams.get('topicId');

  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [autoGenerate, setAutoGenerate] = useState(false);
  const [autoGenerateCount, setAutoGenerateCount] = useState(5);
  const [generateErrors, setGenerateErrors] = useState<Record<number, string>>({});
  const [hasGeneratedQuestions, setHasGeneratedQuestions] = useState(false);

  const createExamMutation = useCreateExam();
  const createTopicExamMutation = useCreateTopicExam();
  const createFinalExamMutation = useCreateFinalExam();
  const { data: topics = [] } = useTopics(courseId);
  const { generate: generateQuestionsAI, isLoading: isGeneratingQuestions } =
    useGenerateQuestionsAI();
  const { data: course } = useCourseInstructorDetail(courseId);

  // Get the specific topic for topic exam
  const selectedTopic =
    examType === 'topic_exam' ? topics.find((topic) => topic.id === Number(topicId)) : null;

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

  // Get exam type configuration
  const getExamTypeConfig = () => {
    switch (examType) {
      case 'topic_exam':
        return {
          title: 'Create Topic Exam',
          icon: <BookOutlined />,
          description: 'Create an exam for a specific topic',
          defaultDuration: 30,
          defaultPassingScore: 70,
          defaultQuestionCount: 5,
          requireVideoCompletion: true,
          requireAllTopicExamsCompleted: false,
          apiType: 'topic_exam',
        };
      case 'final_exam':
        return {
          title: 'Create Final Exam',
          icon: <TrophyOutlined />,
          description: 'Create a final exam for the entire course',
          defaultDuration: 120,
          defaultPassingScore: 80,
          defaultQuestionCount: 10,
          requireVideoCompletion: false,
          requireAllTopicExamsCompleted: true,
          apiType: 'final_exam',
        };
      default: // practice
        return {
          title: 'Create Practice Test',
          icon: <StarOutlined />,
          description: 'Create a practice test for students',
          defaultDuration: 60,
          defaultPassingScore: 70,
          defaultQuestionCount: 5,
          requireVideoCompletion: false,
          requireAllTopicExamsCompleted: false,
          apiType: 'practice',
        };
    }
  };

  const examConfig = getExamTypeConfig();

  // Auto-save draft functionality
  const saveDraft = useCallback(() => {
    const draftData = {
      formData,
      questions,
      examType,
      topicId,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(
      `exam-draft-${courseId}-${examType}-${topicId || ''}`,
      JSON.stringify(draftData),
    );
  }, [formData, questions, examType, topicId, courseId]);

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(`exam-draft-${courseId}-${examType}-${topicId || ''}`);
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        const draftAge = new Date().getTime() - new Date(draftData.timestamp).getTime();
        const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

        if (draftAge < oneDay) {
          setFormData(draftData.formData || {});
          setQuestions(draftData.questions || []);
          form.setFieldsValue(draftData.formData);
        } else {
          localStorage.removeItem(`exam-draft-${courseId}-${examType}-${topicId || ''}`);
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, [courseId, examType, topicId, form, setQuestions]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(saveDraft, 30000);
    return () => clearInterval(interval);
  }, [saveDraft]);

  const calculateProgress = () => {
    const totalSteps = 3;
    const currentProgress = currentStep + 1;
    return Math.round((currentProgress / totalSteps) * 100);
  };

  const handleRetryGenerate = async (topicId: number) => {
    const topic = topics.find((t) => t.id === topicId);
    if (topic) {
      try {
        const aiQuestions = await generateQuestionsAI(topicId, topic.title, autoGenerateCount);
        setQuestions(aiQuestions);
        setGenerateErrors((prev) => ({ ...prev, [topicId]: '' }));
      } catch (err) {
        setGenerateErrors((prev) => ({
          ...prev,
          [topicId]: extractErrorMessage(err) || 'Failed to generate questions',
        }));
      }
    }
  };

  const steps = [
    {
      title: 'Basic Information',
      description: 'Exam details and settings',
      icon: <EditOutlined />,
    },
    {
      title: 'Questions',
      description: 'Create exam questions',
      icon: <FileTextOutlined />,
    },
    {
      title: 'Review & Publish',
      description: 'Review and create exam',
      icon: <CheckCircleOutlined />,
    },
  ];

  const handleFormValuesChange = (changedValues: any, allValues: any) => {
    setFormData(allValues);
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      try {
        const requiredFields = ['title', 'description', 'duration', 'passingScore'];
        if (examType !== 'topic_exam') {
          requiredFields.push('topicIds');
        }

        await form.validateFields(requiredFields);

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
                errors[topicId] = extractErrorMessage(err) || 'Failed to generate questions';
              }
            }
          }

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

      const baseExamData = {
        ...formData,
        courseId: parseInt(courseId),
        questions: autoGenerate ? [] : validQuestions,
        autoGenerate,
        autoGenerateCount: autoGenerate ? autoGenerateCount : undefined,
      };

      switch (examType) {
        case 'topic_exam':
          await createTopicExamMutation.mutateAsync({
            title: formData.title,
            description: formData.description,
            courseId: parseInt(courseId),
            topicId: parseInt(topicId!),
            duration: formData.duration,
            passingScore: formData.passingScore,
            shuffleQuestions: formData.shuffleQuestions,
            shuffleAnswers: formData.shuffleAnswers,
            requireVideoCompletion: examConfig.requireVideoCompletion,
            autoGenerate,
            autoGenerateCount: autoGenerate ? autoGenerateCount : undefined,
            questions: autoGenerate ? [] : validQuestions,
          });
          break;
        case 'final_exam':
          await createFinalExamMutation.mutateAsync({
            title: formData.title,
            description: formData.description,
            courseId: parseInt(courseId),
            topicIds: formData.topicIds,
            duration: formData.duration,
            passingScore: formData.passingScore,
            shuffleQuestions: formData.shuffleQuestions,
            shuffleAnswers: formData.shuffleAnswers,
            requireAllTopicExamsCompleted: examConfig.requireAllTopicExamsCompleted,
            autoGenerate,
            autoGenerateCount: autoGenerate ? autoGenerateCount : undefined,
            questions: autoGenerate ? [] : validQuestions,
          });
          break;
        default: // practice
          await createExamMutation.mutateAsync({
            ...baseExamData,
            type: 'practice',
          });
          break;
      }

      localStorage.removeItem(`exam-draft-${courseId}-${examType}-${topicId || ''}`);
      router.push(`/instructor/course/${courseId}/exams`);
    } catch (error) {
      console.error('Failed to create exam:', error);
    }
  };

  const handleBackToCourse = () => {
    router.push(`/instructor/course/${courseId}/exams`);
  };

  const handleSaveDraft = () => {
    saveDraft();
    message.success('Draft saved!');
  };

  const clearDraft = () => {
    localStorage.removeItem(`exam-draft-${courseId}-${examType}-${topicId || ''}`);
    setFormData({});
    setQuestions([
      {
        question_text: '',
        correct_answer: [],
        choices: ['', ''],
        topicId: examType === 'topic_exam' ? Number(topicId) : 0,
      },
    ]);
    form.resetFields();
    message.success('Draft cleared!');
  };

  // Validate topic exam requirements
  if (examType === 'topic_exam' && !selectedTopic) {
    return (
      <div className='p-6'>
        <div className='text-center'>
          <Title level={3}>Topic Not Found</Title>
          <Text type='secondary'>The selected topic does not exist.</Text>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 pb-20'>
      {/* Header */}
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
                Back to Exams
              </Button>
              <Divider type='vertical' className='border-white/30' />
              <div>
                <Title level={3} className='text-white mb-0'>
                  {examConfig.icon} {examConfig.title}
                </Title>
                <Text className='text-white/80'>
                  {course?.title}
                  {examType === 'topic_exam' && selectedTopic && ` - ${selectedTopic.title}`}
                </Text>
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
          {/* Sidebar */}
          <div className='lg:col-span-1'>
            <div className='sticky top-6' style={{ zIndex: 10 }}>
              <Card className='shadow-lg border-0 rounded-xl'>
                <div className='space-y-4'>
                  <div className='text-center'>
                    {examConfig.icon}
                    <Title level={4} className='mb-1'>
                      {examConfig.title}
                    </Title>
                    <Text type='secondary'>{examConfig.description}</Text>
                  </div>
                  <Steps
                    direction='vertical'
                    current={currentStep}
                    items={steps}
                    className='mt-6'
                  />
                  <div className='pt-4 border-t'>
                    <Button
                      type='text'
                      size='small'
                      onClick={clearDraft}
                      className='text-gray-500 hover:text-red-500'
                    >
                      Clear Draft
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Main Form */}
          <div className='lg:col-span-3'>
            {/* Exam Type Specific Alerts */}
            {examType === 'topic_exam' && (
              <Alert
                message='Topic Exam Requirements'
                description='Students must complete all video lessons in this topic before they can take this exam.'
                type='info'
                showIcon
                className='!mb-6'
              />
            )}
            {examType === 'final_exam' && (
              <Alert
                message='Final Exam Requirements'
                description='Students must complete all topic exams before they can take the final exam. This exam is required to earn the course certificate.'
                type='info'
                showIcon
                className='!mb-6'
              />
            )}

            <Form
              form={form}
              layout='vertical'
              onValuesChange={handleFormValuesChange}
              initialValues={{
                duration: examConfig.defaultDuration,
                passingScore: examConfig.defaultPassingScore,
                type: examType,
                shuffleQuestions: false,
                shuffleAnswers: false,
                topicIds:
                  examType === 'topic_exam' ? [Number(topicId)] : topics.map((topic) => topic.id),
              }}
            >
              {currentStep === 0 && (
                <ExamBasicInfoForm
                  form={form}
                  formData={formData}
                  topics={examType === 'topic_exam' ? [selectedTopic!] : topics}
                  autoGenerate={autoGenerate}
                  autoGenerateCount={autoGenerateCount}
                  setAutoGenerate={setAutoGenerate}
                  setAutoGenerateCount={setAutoGenerateCount}
                  examType={examType}
                />
              )}
              {currentStep === 1 && (
                <ExamQuestionsStep
                  questions={questions}
                  topics={examType === 'topic_exam' ? [selectedTopic!] : topics}
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
              <Card className='mt-6 shadow-lg border-0 rounded-xl'>
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
                        loading={
                          createExamMutation.isPending ||
                          createTopicExamMutation.isPending ||
                          createFinalExamMutation.isPending
                        }
                        onClick={handleSubmit}
                        icon={<CheckCircleOutlined />}
                        className='rounded-lg bg-gradient-to-r from-green-500 to-blue-500 border-0 hover:shadow-lg transition-all'
                      >
                        Create {examConfig.title}
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
