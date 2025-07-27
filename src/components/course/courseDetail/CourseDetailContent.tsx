import { Button, Collapse, Divider, Empty, Card, Typography, Badge, Space } from 'antd';
import {
  LockOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  TrophyOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useState, useCallback, useEffect } from 'react';
import GroupChatCourseModal from './GroupChatCourseModal';
import { groupChatApi } from '@/shared/api/group-chat.api';

import { LessonInTopic, TopicResponse } from '@/types/topicType';
import { formatDuration } from '@/utils/convertTime';
import { formatScore } from '@/utils/formatScore';
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
import { useLessonsVideoProgress } from '@/hooks/video-progress/useLessonsVideoProgress';
import { useMemo } from 'react';

const { Text, Title } = Typography;

interface CourseDetailContentProps {
  sections: TopicResponse[];
  onLessonSelect: (lesson: LessonInTopic) => void;
  courseId: string;
  currentLessonId?: number; // Add current lesson ID prop
  onTestProgressUpdate?: (testId: number, isCompleted: boolean) => void;
}

const CourseDetailContent = ({
  sections,
  onLessonSelect,
  courseId,
  currentLessonId,
  onTestProgressUpdate,
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

  // Handle test completion - this will be called when user returns from test
  const handleTestCompletion = useCallback(
    (testId: number, isCompleted: boolean) => {
      if (onTestProgressUpdate) {
        onTestProgressUpdate(testId, isCompleted);
      }
    },
    [onTestProgressUpdate],
  );

  // Check for test completion when component mounts or when returning from test
  useEffect(() => {
    // Check if there was a test attempt in localStorage that was cleared
    const wasTestCompleted = sessionStorage.getItem('test-completed');
    if (wasTestCompleted) {
      try {
        const { testId, isCompleted } = JSON.parse(wasTestCompleted);
        handleTestCompletion(testId, isCompleted);
        sessionStorage.removeItem('test-completed');
      } catch (error) {
        console.error('Error parsing test completion data:', error);
        sessionStorage.removeItem('test-completed');
      }
    }
  }, [handleTestCompletion]);

  const isEnrolled = enrollmentCheck?.isEnrolled || false;

  // Get all lessons from all sections for video progress
  const allLessons = useMemo(
    () => sections?.flatMap((section) => section.lessons || []) ?? [],
    [sections],
  );
  const { videoProgressMap } = useLessonsVideoProgress(allLessons);

  const [modalVisible, setModalVisible] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const handleOpenGroupChatModal = async () => {
    setModalVisible(true);
    setLoadingCourses(true);
    try {
      const res = await groupChatApi.getMyEnrolledCourses();
      setCourses(res?.data || []);
    } catch {
      setCourses([]);
    }
    setLoadingCourses(false);
  };

  const collapseItems = sections
    .sort((a, b) => a.id - b.id)
    .map((section) => {
      // Find topic exam for this section
      const topicExam = topicExams?.find((exam) => exam.topicId === section.id);
      console.log(topicExam);

      return {
        key: section.id.toString(),
        label: (
          <div className='flex justify-between w-full'>
            <span>{section.title}</span>
            <span className='text-gray-500 text-sm'>{formatDuration(section.totalDuration)}</span>
          </div>
        ),
        children: (
          <div className='space-y-3'>
            {/* Lessons */}
            <div>
              <Title level={5} className='mb-2 flex items-center gap-2'>
                <PlayCircleOutlined className='text-blue-500' />
                Lessons ({section.lessons?.length || 0})
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
                          className={`flex justify-between py-2 px-3 rounded-lg cursor-pointer transition-colors ${
                            isCurrentlyWatching
                              ? 'bg-blue-50 border border-blue-200'
                              : isCompleted
                                ? 'bg-green-50 border border-green-100'
                                : 'hover:bg-gray-50 border border-transparent'
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
                          <span className='text-gray-500 text-xs flex-shrink-0 ml-2'>
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

            {topicExam && (
              <div className='border-t pt-3'>
                <Title level={5} className='mb-2 flex items-center gap-2'>
                  <FileTextOutlined className='text-green-500' />
                  Topic Exam
                </Title>
                <Card className='bg-green-50 border-green-200 flex flex-col items-center justify-center text-center'>
                  <Space className='flex justify-center items-start' direction='vertical'>
                    <Space direction='horizontal'>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 !mb-0'>
                          {/* Status badges - simplified */}
                          {topicExam.currentAttempt && <Badge color='blue' text='In Progress' />}
                          {!topicExam.currentAttempt && !topicExam.lastAttempt && (
                            <Badge
                              color={topicExam.isAvailable ? 'green' : 'orange'}
                              text={topicExam.isAvailable ? 'Available' : 'Locked'}
                            />
                          )}
                        </div>
                      </div>
                      <div className='ml-4 flex-shrink-0'>
                        {/* Enhanced button logic */}
                        {!isEnrolled ? (
                          <Button
                            type='primary'
                            disabled
                            className='bg-gray-400 border-gray-400 whitespace-nowrap'
                          >
                            Enroll to Access
                          </Button>
                        ) : !topicExam.isAvailable ? (
                          <Button type='default' disabled className='whitespace-nowrap'>
                            Complete Lessons First
                          </Button>
                        ) : topicExam.currentAttempt ? (
                          <Button
                            type='primary'
                            onClick={() =>
                              handleContinueTest(topicExam.id, topicExam.currentAttempt!.id)
                            }
                            className='bg-blue-600 border-blue-600 whitespace-nowrap'
                          >
                            Continue Exam
                          </Button>
                        ) : topicExam.lastAttempt?.isPassed ? (
                          <Button
                            type='default'
                            disabled
                            className='bg-green-100 border-green-300 text-green-700 whitespace-nowrap'
                          >
                            ✓ Completed
                          </Button>
                        ) : (
                          <Button
                            type='primary'
                            onClick={() => handleStartTest(topicExam.id)}
                            className={`whitespace-nowrap ${
                              topicExam.lastAttempt && !topicExam.lastAttempt.isPassed
                                ? 'bg-orange-600 border-orange-600'
                                : 'bg-green-600 border-green-600'
                            }`}
                          >
                            {topicExam.lastAttempt && !topicExam.lastAttempt.isPassed
                              ? 'Retry Exam'
                              : 'Start Exam'}
                          </Button>
                        )}
                      </div>
                    </Space>

                    {topicExam.lastAttempt && (
                      <div
                        className={`inline-flex gap-2 text-sm font-medium ${
                          topicExam.lastAttempt.isPassed ? 'text-green-700' : 'text-red-700'
                        }`}
                      >
                        {topicExam.lastAttempt.isPassed ? (
                          <CheckCircleOutlined className='text-green-500' />
                        ) : (
                          <ExclamationCircleOutlined className='text-red-500' />
                        )}
                        <span>
                          {topicExam.lastAttempt.isPassed ? 'Passed' : 'Failed'} with{' '}
                          {formatScore(topicExam.lastAttempt.score)}%
                        </span>
                      </div>
                    )}
                  </Space>
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
        <div className='flex items-center gap-2'>
          <h2 className='text-lg font-medium'>Course content</h2>
          <span className='text-sm text-gray-500'>({sections.length} topics)</span>
        </div>
        {!isEnrolled && (
          <Button
            type='primary'
            icon={<LockOutlined />}
            onClick={handleEnroll}
            loading={isCheckingEnrollment}
            size='small'
          >
            {!isAuthenticated ? 'Login to Enroll' : 'Enroll'}
          </Button>
        )}
        {isEnrolled && (
          <>
            <Button type='default' onClick={handleOpenGroupChatModal}>
              + Group-chat
            </Button>
            <GroupChatCourseModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              loading={loadingCourses}
              courses={courses}
            />
          </>
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
                    text={finalExam.isAvailable ? 'Available' : 'Locked'}
                  />
                </div>
                <Text className='text-gray-600 block mb-3'>{finalExam.description}</Text>
                <div className='flex flex-wrap gap-4 text-sm text-gray-600'>
                  <span>Duration: {finalExam.duration} min</span>
                  <span>Questions: {finalExam.questionCount}</span>
                  <span>Pass: {finalExam.passingScore}%</span>
                </div>
                {!finalExam.isAvailable && (
                  <div className='mt-3 p-2 bg-orange-50 rounded border border-orange-200'>
                    <Text className='text-sm text-orange-700'>
                      Complete {finalExam.totalTopicExams - finalExam.completedTopicExams} more
                      topic exams to unlock
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
