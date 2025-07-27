'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Modal, message, Spin, Alert, Row, Col } from 'antd';
import { useTestById } from '@/hooks/test/useTestById';
import { useSubmitAnswer } from '@/hooks/test/useSubmitAnswer';
import { useCompleteTest } from '@/hooks/test/useCompleteTest';
import { useTestProgress } from '@/hooks/test/useTestProgress';
import { useHasMounted } from '@/hooks/useHasMounted';
import {
  TestHeader,
  QuestionNavigator,
  QuestionCard,
  TestSubmitModal,
  TestExpiredOverlay,
} from '@/components/test';
import {
  getCurrentAttemptId,
  saveCurrentAttemptId,
  clearCurrentAttemptId,
  convertProgressToAnswers,
  isLocalStorageAvailable,
} from '@/utils/testUtils';

interface QuestionAnswer {
  questionId: number;
  selectedAnswers: string[];
  timeSpent: number;
}

const TestAttemptPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id: courseId, testId, attemptId } = params;
  const hasMounted = useHasMounted();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, QuestionAnswer>>({});
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isTestActive, setIsTestActive] = useState(true);
  const [isRestoringProgress, setIsRestoringProgress] = useState(false);
  const [progressAttemptId, setProgressAttemptId] = useState<number | null>(null);

  const { data: test, isLoading } = useTestById(Number(testId));

  // Use progress hook to restore state on reload (only fetch once on initial load)
  const {
    data: progressData,
    isLoading: isProgressLoading,
    error: progressError,
  } = useTestProgress(progressAttemptId);

  // Check for progress restoration only once when component mounts
  useEffect(() => {
    if (hasMounted && progressAttemptId === null) {
      const storedAttemptId = isLocalStorageAvailable() ? getCurrentAttemptId() : null;

      // Only set if we have stored attemptId and it matches current URL
      if (storedAttemptId && Number(storedAttemptId) === Number(attemptId)) {
        setProgressAttemptId(storedAttemptId);
      } else {
        // Mark as checked but no restoration needed
        setProgressAttemptId(-1);
      }
    }
  }, [hasMounted, attemptId, progressAttemptId]);

  const submitAnswerMutation = useSubmitAnswer();
  const completeTestMutation = useCompleteTest();

  // Save attemptId to localStorage when component mounts (only on client)
  useEffect(() => {
    if (hasMounted && isLocalStorageAvailable() && attemptId) {
      saveCurrentAttemptId(Number(attemptId));
    }
  }, [hasMounted, attemptId]);

  useEffect(() => {
    if (progressData && !isRestoringProgress) {
      setIsRestoringProgress(true);

      // Check if test is expired
      if (progressData.isExpired) {
        Modal.error({
          title: 'Test Time Expired',
          content: 'The test time has expired. You will be redirected to the course page.',
          onOk: () => {
            clearCurrentAttemptId();
            router.push(`/course/${courseId}`);
          },
          maskClosable: false,
          closable: false,
        });
        return;
      }

      // Check if test is not in progress
      if (progressData.status !== 'in_progress') {
        Modal.warning({
          title: 'Test Not Available',
          content: 'This test is no longer available for taking.',
          onOk: () => {
            clearCurrentAttemptId();
            router.push(`/course/${courseId}`);
          },
          maskClosable: false,
          closable: false,
        });
        return;
      }

      // Restore answers
      const restoredAnswers = convertProgressToAnswers(progressData.answers);
      setAnswers(restoredAnswers);

      setTimeLeft(progressData.timeRemaining * 1000); // Convert seconds to milliseconds
      setQuestionStartTime(Date.now());

      message.success('Your previous progress has been restored!');
      setIsRestoringProgress(false);
    }
  }, [progressData, isRestoringProgress, router, courseId]);

  useEffect(() => {
    if (progressError && progressAttemptId && progressAttemptId > 0) {
      console.warn('Failed to restore progress:', progressError);
      // Clear invalid attemptId from localStorage
      clearCurrentAttemptId();
    }
  }, [progressError, progressAttemptId]);

  // Initialize timer when test data is loaded
  useEffect(() => {
    if (test && test.currentAttempt) {
      const startedTime = new Date(test.currentAttempt.startedAt).getTime();
      const duration = test.duration * 60 * 1000; // minutes to ms
      const currentTime = Date.now();

      const elapsed = currentTime - startedTime;
      const remaining = duration - elapsed;

      // If time is already up, redirect to course immediately
      if (remaining <= 0) {
        setIsTestActive(false);
        Modal.error({
          title: 'Test Time Expired',
          content: 'The test time has expired. You will be redirected to the course page.',
          onOk: () => {
            router.push(`/course/${courseId}`);
          },
          maskClosable: false,
          closable: false,
        });
        return;
      }

      setTimeLeft(remaining);
      setQuestionStartTime(currentTime);
    }
  }, [test, router, courseId]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0 || !isTestActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          setIsTestActive(false);
          handleTimeUp();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isTestActive]);

  const handleTimeUp = async () => {
    try {
      // Try to submit the test first
      await completeTestMutation.mutateAsync({
        attemptId: Number(attemptId),
      });

      // Clear attemptId from localStorage
      if (isLocalStorageAvailable()) {
        clearCurrentAttemptId();
      }

      Modal.success({
        title: "Time's Up!",
        content: 'The test time has expired. Your test has been submitted automatically.',
        onOk: () => {
          router.push(`/course/${courseId}`);
        },
        maskClosable: false,
        closable: false,
      });
    } catch (error) {
      console.log(error);
      // Clear attemptId from localStorage even on error
      if (isLocalStorageAvailable()) {
        clearCurrentAttemptId();
      }

      // If submission fails, still redirect to course
      Modal.error({
        title: "Time's Up!",
        content:
          'The test time has expired. There was an issue submitting your test. You will be redirected to the course page.',
        onOk: () => {
          router.push(`/course/${courseId}`);
        },
        maskClosable: false,
        closable: false,
      });
    }
  };

  const getCurrentQuestion = () => {
    if (!test || !test.questions) return null;
    return test.questions[currentQuestionIndex];
  };

  const handleAnswerChange = (questionId: number, selectedAnswers: string[]) => {
    // Don't allow answer changes if test is not active
    if (!isTestActive) return;

    const currentTime = Date.now();
    const timeSpentOnQuestion = currentTime - questionStartTime;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        questionId,
        selectedAnswers,
        timeSpent: timeSpentOnQuestion,
      },
    }));

    // Submit answer immediately
    submitAnswerMutation.mutate({
      attemptId: Number(attemptId),
      questionId,
      selectedAnswers,
      timeSpent: Math.floor(timeSpentOnQuestion / 1000), // Convert to seconds
    });
  };

  const navigateToQuestion = (index: number) => {
    if (index < 0 || !test || !test.questions || index >= test.questions.length) return;

    setCurrentQuestionIndex(index);
    setQuestionStartTime(Date.now());
  };

  const handleCompleteTest = async () => {
    try {
      await completeTestMutation.mutateAsync({
        attemptId: Number(attemptId),
      });

      // Clear attemptId from localStorage when test is completed
      if (isLocalStorageAvailable()) {
        clearCurrentAttemptId();
      }

      // Set completion flag for the course page to detect
      sessionStorage.setItem(
        'test-completed',
        JSON.stringify({
          testId: Number(testId),
          isCompleted: true,
        }),
      );

      // Navigate to results page
      router.push(`/course/${courseId}/test/${testId}/result/${attemptId}`);
    } catch (error) {
      console.log(error);
      message.error('Failed to complete test');
    }
  };

  const getAnsweredQuestionsCount = () => {
    return Object.keys(answers).length;
  };

  const isQuestionAnswered = (questionId: number) => {
    return answers[questionId] && answers[questionId].selectedAnswers.length > 0;
  };

  if (isLoading || isProgressLoading || isRestoringProgress) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center space-y-4'>
          <Spin size='large' />
          <div className='text-gray-600'>
            {hasMounted && isProgressLoading
              ? 'Restoring your progress...'
              : hasMounted && isRestoringProgress
                ? 'Setting up your test...'
                : 'Loading test...'}
          </div>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Alert message='Test not found' type='error' />
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;
  const answeredCount = getAnsweredQuestionsCount();

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'>
      {/* Test Expired Overlay */}
      <TestExpiredOverlay isVisible={!isTestActive} />

      {/* Header */}
      <TestHeader
        testTitle={test.title}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={test.questions.length}
        timeLeft={timeLeft}
        answeredCount={answeredCount}
        progress={progress}
      />

      <div className='max-w-7xl mx-auto px-6 py-8'>
        <Row gutter={32}>
          {/* Question Navigation Sidebar */}
          <Col span={6}>
            <QuestionNavigator
              questions={test.questions}
              currentQuestionIndex={currentQuestionIndex}
              answeredCount={answeredCount}
              isTestActive={isTestActive}
              isQuestionAnswered={isQuestionAnswered}
              onNavigateToQuestion={navigateToQuestion}
              onShowSubmitModal={() => setShowSubmitModal(true)}
            />
          </Col>

          {/* Main Question Area */}
          <Col span={18}>
            {currentQuestion && (
              <QuestionCard
                question={currentQuestion}
                questionIndex={currentQuestionIndex}
                totalQuestions={test.questions.length}
                answers={answers}
                isTestActive={isTestActive}
                onAnswerChange={handleAnswerChange}
                onPrevious={() => navigateToQuestion(currentQuestionIndex - 1)}
                onNext={() => navigateToQuestion(currentQuestionIndex + 1)}
                onSubmit={() => setShowSubmitModal(true)}
                canGoPrevious={currentQuestionIndex > 0}
                canGoNext={currentQuestionIndex < test.questions.length - 1}
              />
            )}
          </Col>
        </Row>
      </div>

      {/* Submit Confirmation Modal */}
      <TestSubmitModal
        isVisible={showSubmitModal}
        isLoading={completeTestMutation.isPending}
        totalQuestions={test.questions.length}
        answeredCount={answeredCount}
        passingScore={test.passingScore}
        onConfirm={handleCompleteTest}
        onCancel={() => setShowSubmitModal(false)}
      />
    </div>
  );
};

export default TestAttemptPage;
