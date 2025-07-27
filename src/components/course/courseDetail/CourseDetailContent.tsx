import { Button, Collapse, Divider, Empty, Card, Typography, Badge } from 'antd';
import {
  LockOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  TrophyOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { LessonInTopic, TopicResponse } from '@/types/topicType';
import { formatDuration } from '@/utils/convertTime';
import { useRouter } from 'next/navigation';
import { useCheckEnrollment } from '@/hooks/enrollment';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/providers/auth/selector/authSelector';
import { useTopicExams } from '@/hooks/test/useTopicExams';
import { useFinalExam } from '@/hooks/test/useFinalExam';
import { useStartTest } from '@/hooks/test/useStartTest';
import { useMyTestResults } from '@/hooks/test/useMyTestResults';
import { saveCurrentAttemptId, isLocalStorageAvailable } from '@/utils/testUtils';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useLessonsVideoProgress } from '@/hooks/video-progress/useLessonsVideoProgress';
import { useMemo } from 'react';

const { Text, Title } = Typography;

interface CourseDetailContentProps {
  sections: TopicResponse[];
  onLessonSelect: (lesson: LessonInTopic) => void;
  courseId: string;
  currentLessonId?: number; // Add current lesson ID prop
}

const CourseDetailContent = ({
  sections,
  onLessonSelect,
  courseId,
  currentLessonId,
}: CourseDetailContentProps) => {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { data: enrollmentCheck, isLoading: isCheckingEnrollment } = useCheckEnrollment(courseId);
  const { data: topicExams } = useTopicExams(Number(courseId));
  const { data: finalExam } = useFinalExam(Number(courseId));
  const { data: myResults } = useMyTestResults(Number(courseId));
  const startTestMutation = useStartTest();

  const handleEnroll = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    const target = `/payment/payment-confirm?courseId=${courseId}`;
    router.push(target);
  };

  const handleStartTest = async (testId: number) => {
    // Check if there's any test in progress
    const testInProgress = myResults?.find((result) => !result.completedAt);

    if (testInProgress) {
      Modal.confirm({
        title: 'Test In Progress',
        icon: <ExclamationCircleOutlined />,
        content: (
          <div>
            <p>
              You have an unfinished test: <strong>{testInProgress.testTitle}</strong>
            </p>
            <p>You must complete or abandon your current test before starting a new one.</p>
          </div>
        ),
        okText: 'Continue Current Test',
        cancelText: 'Cancel',
        onOk() {
          handleContinueTest(testInProgress.testId, testInProgress.id);
        },
        onCancel() {
          // Do nothing, just close modal
        },
      });
      return;
    }

    try {
      const response = await startTestMutation.mutateAsync({ testId });

      if (response && response.id) {
        // Save attempt ID to localStorage for reload recovery
        if (isLocalStorageAvailable()) {
          saveCurrentAttemptId(response.id);
        }

        router.push(`/course/${courseId}/test/${testId}/attempt/${response.id}`);
      } else {
        console.warn('Test started but no attempt ID returned.');
      }
    } catch (error) {
      console.error('Failed to start test:', error);
    }
  };

  const handleContinueTest = (testId: number, attemptId: number) => {
    // Save attempt ID to localStorage for reload recovery
    if (isLocalStorageAvailable()) {
      saveCurrentAttemptId(attemptId);
    }

    router.push(`/course/${courseId}/test/${testId}/attempt/${attemptId}`);
  };

  const isEnrolled = enrollmentCheck?.isEnrolled || false;

  // Get all lessons from all sections for video progress
  const allLessons = useMemo(
    () => sections?.flatMap((section) => section.lessons || []) ?? [],
    [sections],
  );
  const { videoProgressMap } = useLessonsVideoProgress(allLessons);

  const collapseItems = sections
    .sort((a, b) => a.id - b.id)
    .map((section) => {
      // Find topic exam for this section
      const topicExam = topicExams?.find((exam) => exam.topicId === section.id);

      return {
        key: section.id.toString(),
        label: (
          <div className='flex justify-between w-full'>
            <span>{section.title}</span>
            <span className='text-gray-500 text-sm'>{formatDuration(section.totalDuration)}</span>
          </div>
        ),
        children: (
          <div className='space-y-4'>
            {/* Lessons */}
            <div>
              <Title level={5} className='mb-3 flex items-center gap-2'>
                <PlayCircleOutlined className='text-blue-500' />
                Lessons
              </Title>
              {section.lessons && section.lessons.length > 0 ? (
                <ul className='text-sm text-gray-600 space-y-1'>
                  {section.lessons
                    .sort((a, b) => a.id - b.id)
                    .map((lesson: LessonInTopic, idx: number) => {
                      const videoProgress = videoProgressMap.get(lesson.id);
                      const isCompleted = videoProgress?.isCompleted || false;
                      const isCurrentlyWatching = currentLessonId === lesson.id;

                      return (
                        <li
                          key={idx}
                          className={`flex justify-between py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-50 px-2 rounded ${
                            isCurrentlyWatching ? 'bg-blue-50 border-blue-200' : ''
                          }`}
                          onClick={() => onLessonSelect(lesson)}
                        >
                          <div className='flex items-center gap-2 flex-1'>
                            {isCompleted ? (
                              <CheckCircleOutlined className='text-green-500 text-lg' />
                            ) : isCurrentlyWatching ? (
                              <EyeOutlined className='text-blue-500 text-lg' />
                            ) : (
                              <PlayCircleOutlined className='text-gray-400 text-lg' />
                            )}
                            <span
                              className={
                                isCompleted
                                  ? 'text-green-700 font-medium'
                                  : isCurrentlyWatching
                                    ? 'text-blue-700 font-medium'
                                    : 'text-gray-600'
                              }
                            >
                              {lesson.title}
                            </span>
                          </div>
                          <span className='text-gray-500'>
                            {formatDuration(lesson.videoDuration)}
                          </span>
                        </li>
                      );
                    })}
                </ul>
              ) : (
                <Empty
                  description='No lessons available'
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  className='py-4'
                />
              )}
            </div>

            {/* Topic Exam */}
            {topicExam && (
              <div className='border-t pt-4'>
                <Title level={5} className='mb-3 flex items-center gap-2'>
                  <FileTextOutlined className='text-green-500' />
                  Topic Exam
                </Title>
                <Card className='bg-green-50 border-green-200'>
                  <div className='flex justify-between items-start'>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2 mb-2'>
                        <Title level={5} className='!mb-0 truncate'>
                          {topicExam.title}
                        </Title>
                        <Badge
                          color={topicExam.isAvailable ? 'green' : 'orange'}
                          text={topicExam.isAvailable ? 'Available' : 'Locked'}
                        />
                      </div>
                      <Text className='text-gray-600 block mb-3'>{topicExam.description}</Text>
                      <div className='flex flex-wrap gap-4 text-sm text-gray-600'>
                        <span>Duration: {topicExam.duration} min</span>
                        <span>Questions: {topicExam.questionCount}</span>
                        <span>Pass: {topicExam.passingScore}%</span>
                      </div>
                    </div>
                    <div className='ml-4 flex-shrink-0'>
                      <Button
                        type='primary'
                        disabled={!topicExam.isAvailable || !isEnrolled}
                        onClick={() => handleStartTest(topicExam.id)}
                        className='bg-green-600 border-green-600 whitespace-nowrap'
                      >
                        {!isEnrolled
                          ? 'Enroll to Access'
                          : topicExam.isAvailable
                            ? 'Start Exam'
                            : 'Complete Lessons First'}
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        ),
      };
    });

  return (
    <div className='bg-white rounded-lg shadow-sm border p-4 h-fit'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-lg font-medium'>Course content</h2>
        {!isEnrolled && (
          <Button
            type='primary'
            icon={<LockOutlined />}
            onClick={handleEnroll}
            loading={isCheckingEnrollment}
          >
            {!isAuthenticated ? 'Login to Enroll' : 'Enroll'}
          </Button>
        )}
        {isEnrolled && (
          <Button
            type='default'
            icon={<CheckCircleOutlined />}
            disabled
            className='!text-green-600 !border-green-600'
          >
            Enrolled
          </Button>
        )}
      </div>
      <Divider size='small' />

      {/* Topics with lessons and topic exams */}
      <Collapse items={collapseItems} defaultActiveKey={['0']} ghost />

      {/* Final Exam Section */}
      {finalExam && (
        <div className='mt-6 pt-6 border-t border-gray-200'>
          <Title level={4} className='mb-4 flex items-center gap-2'>
            <TrophyOutlined className='text-red-500' />
            Final Exam
          </Title>
          <Card className='bg-red-50 border-red-200'>
            <div className='flex justify-between items-start'>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2 mb-2'>
                  <Title level={5} className='!mb-0 truncate'>
                    {finalExam.title}
                  </Title>
                  <Badge
                    color={finalExam.isAvailable ? 'red' : 'orange'}
                    text={finalExam.isAvailable ? 'Available' : 'Complete Topic Exams First'}
                  />
                </div>
                <Text className='text-gray-600 block mb-3'>{finalExam.description}</Text>
                <div className='flex flex-wrap gap-4 text-sm text-gray-600'>
                  <span>Duration: {finalExam.duration} min</span>
                  <span>Questions: {finalExam.questionCount}</span>
                  <span>Pass: {finalExam.passingScore}%</span>
                </div>
                {!finalExam.isAvailable && (
                  <div className='mt-3'>
                    <Text className='text-sm text-orange-600'>
                      Progress: {finalExam.completedTopicExams}/{finalExam.totalTopicExams} topic
                      exams completed
                    </Text>
                  </div>
                )}
              </div>
              <div className='ml-4 flex-shrink-0'>
                <Button
                  type='primary'
                  disabled={!finalExam.isAvailable || !isEnrolled}
                  onClick={() => handleStartTest(finalExam.id)}
                  className='bg-red-600 border-red-600 whitespace-nowrap'
                >
                  {!isEnrolled
                    ? 'Enroll to Access'
                    : finalExam.isAvailable
                      ? 'Start Final Exam'
                      : 'Complete Topic Exams First'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CourseDetailContent;
