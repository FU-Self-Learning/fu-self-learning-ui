'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Steps,
  Form,
  Button,
  Card,
  Typography,
  Divider,
  message,
  Progress,
  Affix,
  Spin,
  Alert,
} from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  EditOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useUpdateExam } from '@/hooks/exam/useUpdateExam';
import { useExamDetail } from '@/hooks/exam/useExamDetail';
import { useTopics } from '@/hooks/topic/useTopics';
import { useCourseInstructorDetail } from '@/hooks/course/instructor/useCourseInstructorDetail';
import ExamBasicInfoForm from '@/components/test/ExamBasicInfoForm';
import ExamQuestionsStep from '@/components/test/ExamQuestionsStep';
import ExamReviewStep from '@/components/test/ExamReviewStep';
import { useExamQuestions } from '@/hooks/exam/useExamQuestions';
import { ExamResponse } from '@/types/examType';
import { extractErrorMessage } from '@/utils/ErrorHandle';

const { Title, Text } = Typography;

const steps = [
  {
    title: 'Basic Information',
    description: 'Test details and settings',
    icon: <EditOutlined />,
  },
  {
    title: 'Questions',
    description: 'Edit test questions',
    icon: <FileTextOutlined />,
  },
  {
    title: 'Review & Save',
    description: 'Review and update test',
    icon: <CheckCircleOutlined />,
  },
];

export default function EditExamPage() {
  const router = useRouter();
  const { id: courseId, examId } = useParams();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [hasInit, setHasInit] = useState(false);

  const updateExamMutation = useUpdateExam();
  const {
    data: exam,
    isLoading,
    error,
  } = useExamDetail(Number(examId)) as {
    data?: ExamResponse & { topics?: { id: number; title: string }[] };
    isLoading: boolean;
    error: any;
  };
  const { data: topics = [] } = useTopics(courseId as string);
  const { data: course } = useCourseInstructorDetail(courseId as string);

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

  useEffect(() => {
    if (exam && !hasInit) {
      const topicIds = Array.isArray(exam.topics)
        ? exam.topics.map((t) => t.id)
        : exam.topicIds || [];
      const initialValues = {
        title: exam.title,
        description: exam.description,
        duration: exam.duration,
        passingScore: exam.passingScore,
        type: exam.type,
        shuffleQuestions: exam.shuffleQuestions,
        shuffleAnswers: exam.shuffleAnswers,
        topicIds,
      };
      setFormData(initialValues);
      form.setFieldsValue(initialValues);
      setQuestions(
        (exam.questions || []).map((q) => ({
          question_text: q.question_text,
          correct_answer: q.correct_answer,
          choices: q.choices,
          topicId: q.topicId,
        })),
      );
      setHasInit(true);
    }
  }, [exam, form, hasInit, setQuestions]);

  const calculateProgress = () => {
    const basicFields = ['title', 'description', 'type', 'duration', 'passingScore', 'topicIds'];
    const completedFields = basicFields.filter(
      (field) =>
        formData[field] && (Array.isArray(formData[field]) ? formData[field].length > 0 : true),
    ).length;

    const validQuestions = questions.filter(
      (q) =>
        q.question_text?.trim() &&
        q.choices?.length >= 2 &&
        q.choices.every((choice) => choice?.trim()) &&
        q.correct_answer?.length > 0 &&
        q.topicId > 0,
    );

    const totalFields = basicFields.length + questions.length;
    return Math.round(((completedFields + validQuestions.length) / totalFields) * 100);
  };

  const handleFormValuesChange = (_: any, allValues: any) => setFormData(allValues);

  const handleNext = async () => {
    if (currentStep === 0) {
      try {
        await form.validateFields();
        setCurrentStep(1);
      } catch {
        message.error('Please fill in all required fields');
      }
    } else if (currentStep === 1) {
      const hasValidQuestion = questions.some(
        (q) =>
          q.question_text?.trim() &&
          q.choices?.length >= 2 &&
          q.choices.every((choice) => choice?.trim()) &&
          q.correct_answer?.length > 0 &&
          q.topicId > 0,
      );
      if (!hasValidQuestion) return message.error('Please add at least one valid question');
      setCurrentStep(2);
    }
  };

  const handlePrev = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async () => {
    try {
      const validQuestions = questions.filter(
        (q) =>
          q.question_text?.trim() &&
          q.choices?.length >= 2 &&
          q.choices.every((choice) => choice?.trim()) &&
          q.correct_answer?.length > 0 &&
          q.topicId > 0,
      );
      const examData = {
        ...formData,
        courseId: Number(courseId),
        questions: validQuestions,
      };
      await updateExamMutation.mutateAsync({ examId: Number(examId), examData });
      message.success('Exam updated successfully!');
      router.push(`/instructor/course/${courseId}/exam/${examId}`);
    } catch (err) {
      message.error(extractErrorMessage(err) || 'Failed to update exam');
    }
  };

  const handleBackToCourse = () => router.push(`/instructor/course/${courseId}`);

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Spin size='large' />
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Alert
          message='Error loading exam details'
          description='Unable to load exam details. Please try again.'
          type='error'
        />
      </div>
    );
  }

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
                  ✏️ Edit Test
                </Title>
                <Text className='text-white/80'>{course?.title}</Text>
              </div>
            </div>
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

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          <div className='lg:col-span-1'>
            <Affix offsetTop={120}>
              <Card className='shadow-lg border-0 rounded-xl'>
                <Steps direction='vertical' current={currentStep} items={steps} className='mb-6' />
                <Divider />
              </Card>
            </Affix>
          </div>

          <div className='lg:col-span-3'>
            <Form
              form={form}
              layout='vertical'
              onValuesChange={handleFormValuesChange}
              initialValues={formData}
            >
              {currentStep === 0 && (
                <ExamBasicInfoForm
                  form={form}
                  formData={formData}
                  topics={topics}
                  autoGenerate={false}
                  autoGenerateCount={0}
                  setAutoGenerate={() => {}}
                  setAutoGenerateCount={() => {}}
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
                  generateErrors={{}}
                  handleRetryGenerate={() => {}}
                  autoGenerate={false}
                  isGeneratingQuestions={false}
                  formData={formData}
                />
              )}
              {currentStep === 2 && <ExamReviewStep formData={formData} questions={questions} />}

              <Card className='!mt-5 shadow-lg border-0 rounded-xl'>
                <div className='flex justify-between items-center'>
                  {currentStep > 0 && (
                    <Button size='large' onClick={handlePrev} className='rounded-lg'>
                      ← Previous
                    </Button>
                  )}
                  <div className='space-x-3'>
                    {currentStep < steps.length - 1 && (
                      <Button
                        type='primary'
                        size='large'
                        onClick={handleNext}
                        className='rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 border-0 hover:shadow-lg'
                      >
                        Next →
                      </Button>
                    )}
                    {currentStep === steps.length - 1 && (
                      <Button
                        type='primary'
                        size='large'
                        loading={updateExamMutation.isPending}
                        onClick={handleSubmit}
                        icon={<CheckCircleOutlined />}
                        className='rounded-lg bg-gradient-to-r from-green-500 to-blue-500 border-0 hover:shadow-lg'
                      >
                        Save Changes
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
