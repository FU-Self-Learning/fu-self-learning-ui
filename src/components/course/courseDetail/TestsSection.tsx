import { Typography, Tabs, Empty, Spin, Badge, Modal } from 'antd';
import { FileTextOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useTests } from '@/hooks/test/useTests';
import { useMyTestResults } from '@/hooks/test/useMyTestResults';
import { useStartTest } from '@/hooks/test/useStartTest';
import { useRouter } from 'next/navigation';
import { saveCurrentAttemptId, isLocalStorageAvailable } from '@/utils/testUtils';
import { TestCard, TestResultCard } from '@/components/test';

const { Title, Text } = Typography;

interface TestsSectionProps {
  courseId: string;
}

const TestsSection = ({ courseId }: TestsSectionProps) => {
  const router = useRouter();
  const { data: tests, isLoading: testsLoading } = useTests(courseId);
  const { data: myResults, isLoading: resultsLoading } = useMyTestResults(
    courseId ? parseInt(courseId) : undefined,
  );

  const startTestMutation = useStartTest();

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

  const tabItems = [
    {
      key: 'available',
      label: (
        <Badge count={tests?.length || 0} showZero size='small'>
          <span>Available Tests</span>
        </Badge>
      ),
      children: (
        <div>
          {testsLoading ? (
            <div className='text-center py-8'>
              <Spin size='large' />
            </div>
          ) : tests && tests.length > 0 ? (
            tests.map((test) => (
              <TestCard
                key={test.id}
                test={test}
                onStartTest={handleStartTest}
                onContinueTest={handleContinueTest}
                userResults={myResults}
              />
            ))
          ) : (
            <Empty
              description='No tests available for this course'
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </div>
      ),
    },
    {
      key: 'results',
      label: (
        <Badge count={myResults?.length || 0} showZero size='small'>
          <span>My Results</span>
        </Badge>
      ),
      children: (
        <div>
          {resultsLoading ? (
            <div className='text-center py-8'>
              <Spin size='large' />
            </div>
          ) : myResults && myResults.length > 0 ? (
            myResults.map((result) => (
              <TestResultCard key={result.id} result={result} courseId={courseId} />
            ))
          ) : (
            <Empty
              description="You haven't taken any tests yet"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className='mb-6'>
        <Title level={4} className='flex items-center gap-2'>
          <FileTextOutlined className='text-blue-500' />
          Course Tests
        </Title>
        <Text type='secondary'>
          Take tests to evaluate your understanding of the course material
        </Text>
      </div>

      <Tabs items={tabItems} defaultActiveKey='available' className='test-tabs' />
    </div>
  );
};

export default TestsSection;
