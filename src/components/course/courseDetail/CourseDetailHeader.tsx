import { Button, Tag } from 'antd';
import VideoPlayerWithOverlay from '@/components/common/VideoPlayerWithOverlay';
import {
  ArrowLeftOutlined,
  BookOutlined,
  ClockCircleOutlined,
  StarFilled,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { formatDuration } from '@/utils/convertTime';

interface CourseDetailHeaderProps {
  videoIntroUrl: string;
  title: string;
  category: string;
  stats: CourseStatsProps;
  isThumbnail: boolean;
}

const CourseDetailHeader = ({
  videoIntroUrl,
  title,
  category,
  stats,
  isThumbnail,
}: CourseDetailHeaderProps) => {
  const router = useRouter();
  const { totalLessons, totalDuration, rating, reviewCount } = stats;
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
      <VideoPlayerWithOverlay src={videoIntroUrl} height='h-[400px]' isThumbnail={isThumbnail} />
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
