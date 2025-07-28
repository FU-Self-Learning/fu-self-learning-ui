import { Button, Collapse, Divider, Empty, Card, Typography, Badge, Space } from 'antd';
import {
  LockOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  TrophyOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
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
  const { data: topicExams, isLoading: isLoadingTopicExams } = useTopicExams(Number(courseId));
  const { data: finalExam, isLoading: isLoadingFinalExam } = useFinalExam(Number(courseId));
  const { data: myResults } = useMyTestResults(Number(courseId));
  const startTestMutation = useStartTest();

  // Calculate topic exam completion status
  const topicExamStatus = useMemo(() => {
    if (!topicExams) return { completed: 0, total: 0, allPassed: false };

    const total = topicExams.length;
    const completed = topicExams.filter((exam) => exam.lastAttempt?.isPassed === true).length;

    return {
      completed,
      total,
      allPassed: completed === total && total > 0,
    };
  }, [topicExams]);

  // Enhanced final exam availability check
  const finalExamAvailability = useMemo(() => {
    if (!finalExam) return { isAvailable: false, reason: 'No final exam exists' };
    if (!isAuthenticated) return { isAvailable: false, reason: 'Not authenticated' };
    if (!enrollmentCheck?.isEnrolled) return { isAvailable: false, reason: 'Not enrolled' };

    // Check if all topic exams are completed and passed
    if (!topicExamStatus.allPassed) {
      return {
        isAvailable: false,
        reason: `Need ${topicExamStatus.total - topicExamStatus.completed} more topic exam(s) to pass`,
      };
    }

    return { isAvailable: true, reason: 'All prerequisites met' };
  }, [finalExam, isAuthenticated, enrollmentCheck, topicExamStatus]);

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

      // If a topic exam was completed, refresh the data
      if (isCompleted) {
        // The parent component will handle invalidating queries
        console.log(`Topic exam ${testId} completed, refreshing data...`);
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

  // Monitor topic exam status changes and update final exam availability
  useEffect(() => {
    if (topicExamStatus.allPassed && finalExam && !finalExamAvailability.isAvailable) {
      console.log('All topic exams passed! Final exam should now be available.');
      // The parent component will handle invalidating the final exam query
    }
  }, [topicExamStatus.allPassed, finalExam, finalExamAvailability.isAvailable]);

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
                          {/* Status badges - enhanced */}
                          {topicExam.currentAttempt && <Badge color='blue' text='In Progress' />}
                          {!topicExam.currentAttempt && topicExam.lastAttempt?.isPassed && (
                            <Badge color='green' text='Passed' />
                          )}
                          {!topicExam.currentAttempt &&
                            topicExam.lastAttempt &&
                            !topicExam.lastAttempt.isPassed && <Badge color='red' text='Failed' />}
                          {!topicExam.currentAttempt && !topicExam.lastAttempt && (
                            <Badge
                              color={topicExam.isAvailable ? 'green' : 'orange'}
                              text={topicExam.isAvailable ? 'Available' : 'Locked'}
                            />
                          )}
                        </div>
                      </div>
                      <div className='ml-4 flex-shrink-0'>
                        {/* Enhanced button logic with better conditions */}
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
                            icon={<CheckCircleOutlined />}
                          >
                            ✓ Passed
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

                    {/* Enhanced result display */}
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
                        {topicExam.lastAttempt.isPassed && (
                          <span className='text-green-600 font-bold'>
                            ✓ Counts toward Final Exam
                          </span>
                        )}
                      </div>
                    )}

                    {/* Progress indicator for topic exam completion */}
                    {topicExam.lastAttempt?.isPassed && (
                      <div className='w-full bg-green-100 rounded-full h-1'>
                        <div className='bg-green-500 h-1 rounded-full' style={{ width: '100%' }} />
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

      {/* Topic Exams Overview */}
      {topicExams && topicExams.length > 0 && (
        <div className='mt-6 pt-6 border-t border-gray-200'>
          <Title level={4} className='mb-4 flex items-center gap-2'>
            <FileTextOutlined className='text-green-500' />
            Topic Exams Overview
          </Title>
          <Card className='bg-green-50 border-green-200'>
            <div className='mb-3'>
              <div className='flex items-center justify-between mb-2'>
                <Text strong>Overall Progress:</Text>
                <Text className='text-sm text-gray-600'>
                  {topicExamStatus.completed} / {topicExamStatus.total} topic exams passed
                </Text>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-3'>
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    topicExamStatus.allPassed ? 'bg-green-500' : 'bg-orange-400'
                  }`}
                  style={{
                    width: `${
                      topicExamStatus.total > 0
                        ? (topicExamStatus.completed / topicExamStatus.total) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Topic Exam Status List */}
            <div className='space-y-2'>
              {topicExams.map((exam) => (
                <div
                  key={exam.id}
                  className='flex items-center justify-between p-2 bg-white rounded border'
                >
                  <div className='flex items-center gap-2'>
                    {exam.lastAttempt?.isPassed ? (
                      <CheckCircleOutlined className='text-green-500' />
                    ) : exam.lastAttempt ? (
                      <ExclamationCircleOutlined className='text-red-500' />
                    ) : (
                      <PlayCircleOutlined className='text-gray-400' />
                    )}
                    <Text className='text-sm'>{exam.title}</Text>
                  </div>
                  <div className='flex items-center gap-2'>
                    {exam.lastAttempt?.isPassed && <Badge color='green' text='Passed' />}
                    {exam.lastAttempt && !exam.lastAttempt.isPassed && (
                      <Badge color='red' text='Failed' />
                    )}
                    {!exam.lastAttempt && <Badge color='orange' text='Not Started' />}
                    {exam.lastAttempt && (
                      <Text className='text-xs text-gray-600'>
                        {formatScore(exam.lastAttempt.score)}%
                      </Text>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Final Exam Status */}
            {finalExam && (
              <div className='mt-4 p-3 bg-white rounded border'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <TrophyOutlined className='text-red-500' />
                    <Text strong>Final Exam Access</Text>
                  </div>
                  <div className='flex items-center gap-2'>
                    {finalExamAvailability.isAvailable ? (
                      <>
                        <Badge color='green' text='Unlocked' />
                        <Text className='text-sm text-green-600'>Ready to start</Text>
                      </>
                    ) : (
                      <>
                        <Badge color='orange' text='Locked' />
                        <Text className='text-sm text-orange-600'>
                          {topicExamStatus.total - topicExamStatus.completed} more to pass
                        </Text>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Final Exam Section */}
      {finalExam && (
        <div className='mt-6 pt-6 border-t border-gray-200'>
          <Title level={4} className='mb-4 flex items-center gap-2'>
            <TrophyOutlined className='text-red-500' />
            Final Exam
            {(isLoadingTopicExams || isLoadingFinalExam) && (
              <span className='text-sm text-gray-500'>Loading...</span>
            )}
          </Title>
          <Card
            className={`p-4 rounded-xl ${
              finalExamAvailability.isAvailable
                ? 'bg-red-50 border-red-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className='flex flex-col gap-3'>
              {/* Header */}
              <div className='flex items-center gap-2'>
                <Title level={5} className='!mb-0 !text-lg font-semibold text-gray-800'>
                  {finalExam.title}
                </Title>
                <Badge
                  color={finalExamAvailability.isAvailable ? 'red' : 'orange'}
                  text={finalExamAvailability.isAvailable ? 'Available' : 'Locked'}
                />

                {/* Status badges for attempt information */}
                {finalExam.currentAttempt && <Badge color='blue' text='In Progress' />}
                {!finalExam.currentAttempt && finalExam.lastAttempt?.isPassed && (
                  <Badge color='green' text='Passed' />
                )}
                {!finalExam.currentAttempt &&
                  finalExam.lastAttempt &&
                  !finalExam.lastAttempt.isPassed && <Badge color='red' text='Failed' />}
                {!finalExam.currentAttempt &&
                  !finalExam.lastAttempt &&
                  finalExamAvailability.isAvailable && (
                    <Badge color='green' text='Ready to Start' />
                  )}
              </div>

              {/* Info Section */}
              <div className='text-sm text-gray-700 space-y-1'>
                <div>
                  <strong>Duration:</strong> {finalExam.duration} min
                </div>
                <div>
                  <strong>Questions:</strong> {finalExam.questionCount}
                </div>
                <div>
                  <strong>Pass:</strong> {finalExam.passingScore}%
                </div>
                {finalExam.lastAttempt && (
                  <div
                    className={`font-medium ${
                      finalExam.lastAttempt.isPassed ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    <strong>Last Attempt:</strong> {finalExam.lastAttempt.score}% -{' '}
                    {finalExam.lastAttempt.isPassed ? 'Passed' : 'Failed'}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className='pt-2'>
                {!isEnrolled ? (
                  <Button
                    type='primary'
                    disabled
                    block
                    icon={<LockOutlined />}
                    className='bg-gray-400 border-gray-400'
                  >
                    Enroll to Access
                  </Button>
                ) : !finalExamAvailability.isAvailable ? (
                  <Button type='default' disabled block icon={<LockOutlined />}>
                    Complete Topic Exams First
                  </Button>
                ) : finalExam.currentAttempt ? (
                  <Button
                    type='primary'
                    block
                    icon={<ClockCircleOutlined />}
                    size='large'
                    onClick={() => handleContinueTest(finalExam.id, finalExam.currentAttempt!.id)}
                    className='bg-blue-600 border-blue-600 hover:bg-blue-700'
                  >
                    Continue Exam
                  </Button>
                ) : finalExam.lastAttempt?.isPassed ? (
                  <Button
                    type='default'
                    disabled
                    block
                    icon={<CheckCircleOutlined />}
                    className='bg-green-100 border-green-300 text-green-700'
                  >
                    ✓ Passed
                  </Button>
                ) : (
                  <Button
                    type='primary'
                    block
                    icon={finalExam.lastAttempt ? <ReloadOutlined /> : <TrophyOutlined />}
                    size='large'
                    onClick={() => handleStartTest(finalExam.id)}
                    className={`${
                      finalExam.lastAttempt
                        ? 'bg-orange-600 border-orange-600 hover:bg-orange-700'
                        : 'bg-red-600 border-red-600 hover:bg-red-700'
                    }`}
                  >
                    {finalExam.lastAttempt ? 'Retry Final Exam' : 'Start Final Exam'}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CourseDetailContent;
