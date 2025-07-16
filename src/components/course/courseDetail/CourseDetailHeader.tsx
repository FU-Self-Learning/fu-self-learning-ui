import { Button, Tag, message } from 'antd';
import VideoPlayerWithProgress from '@/components/common/VideoPlayerWithProgress';
import {
  ArrowLeftOutlined,
  BookOutlined,
  ClockCircleOutlined,
  StarFilled,
  LockOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { formatDuration } from '@/utils/convertTime';
import { useCheckEnrollment } from '@/hooks/enrollment';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/providers/auth/selector/authSelector';
import { TopicResponse, LessonInTopic } from '@/types/topicType';

interface CourseDetailHeaderProps {
  videoIntroUrl: string;
  title: string;
  category: string;
  stats: CourseStatsProps;
  isThumbnail: boolean;
  courseId: string;
  selectedLessonIndex?: number;
  onVideoPlay?: () => void;
  currentLesson?: LessonInTopic;
  topics?: TopicResponse[];
  courseTitle?: string;
  currentTopicId?: string;
  currentProgress?: number;
}

const CourseDetailHeader = ({
  videoIntroUrl,
  title,
  category,
  stats,
  isThumbnail,
  courseId,
  selectedLessonIndex,
  onVideoPlay,
  currentLesson,
  topics,
  courseTitle,
  currentTopicId,
  currentProgress = 0,
}: CourseDetailHeaderProps) => {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { data: enrollmentCheck } = useCheckEnrollment(courseId);
  const { totalLessons, totalDuration, rating, reviewCount } = stats;

  const isEnrolled = enrollmentCheck?.isEnrolled || false;

  const canWatchVideo = () => {
    if (isThumbnail) return true;

    if (isEnrolled) return true;

    if (selectedLessonIndex !== undefined && selectedLessonIndex === 0) return true;

    return false;
  };

  const handleVideoAccess = () => {
    if (!canWatchVideo()) {
      if (!isAuthenticated) {
        message.info('Please login and enroll to access this lesson');
        router.push('/login');
      } else {
        message.info('Please enroll in this course to access this lesson');
        router.push(`/payment/payment-confirm?courseId=${courseId}`);
      }
    }
  };

  const shouldShowVideo = canWatchVideo();
  return (
    <>
      <div className='flex items-center justify-start gap-4'>
        <Button
          type='primary'
          icon={<ArrowLeftOutlined />}
          className='mb-2 !bg-white !text-black'
          onClick={() => router.back()}
        />
        <h1 className='text-2xl font-semibold mb-2'>{title}</h1>
        <Tag className='mb-20'>{category}</Tag>
      </div>
      <p className='text-sm text-gray-500 mt-2 mb-5'>
        <CourseStats
          totalLessons={totalLessons}
          totalDuration={totalDuration}
          rating={rating}
          reviewCount={reviewCount}
        />
      </p>

      {shouldShowVideo ? (
        <VideoPlayerWithProgress
          src={videoIntroUrl}
          height='h-[400px]'
          isThumbnail={isThumbnail}
          onVideoPlay={onVideoPlay}
          courseId={courseId}
          lessonId={currentLesson?.id}
          lessonTitle={currentLesson?.title}
          topicId={currentTopicId}
          courseTitle={courseTitle || title}
          topics={topics}
          autoUpdateProgress={!isThumbnail && isEnrolled}
          currentProgress={currentProgress}
        />
      ) : (
        <div className='relative w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center'>
          <div className='text-center'>
            <LockOutlined className='text-6xl text-gray-400 mb-4' />
            <h3 className='text-xl font-semibold text-gray-600 mb-2'>Video Locked</h3>
            <p className='text-gray-500 mb-4'>
              {!isAuthenticated
                ? 'Please login and enroll to access this lesson'
                : 'Please enroll in this course to access this lesson'}
            </p>
            <Button type='primary' size='large' onClick={handleVideoAccess}>
              {!isAuthenticated ? 'Login to Enroll' : 'Enroll Now'}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

interface CourseStatsProps {
  totalLessons: number;
  totalDuration: number;
  rating: number;
  reviewCount: number;
}

const CourseStats = ({ totalLessons, totalDuration, rating, reviewCount }: CourseStatsProps) => {
  return (
    <>
      <span className='inline-flex items-center gap-1 mr-4'>
        <BookOutlined /> {totalLessons} lessons
      </span>
      <span className='inline-flex items-center gap-1 mr-4'>
        <ClockCircleOutlined /> Total duration: {formatDuration(totalDuration)}
      </span>
      <span className='inline-flex items-center gap-1'>
        <StarFilled className='text-yellow-500' />
        {rating} ({reviewCount} reviews)
      </span>
    </>
  );
};

export default CourseDetailHeader;
