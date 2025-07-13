import { Image, Tabs } from 'antd';
import { InstructorCourse } from '@/types/courseType';
import {
  UserOutlined,
  MailOutlined,
  StarOutlined,
  BookOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { isValidWebUrl } from '@/utils/urlValidation';

interface CourseDetailTabsProps {
  description: string;
  learningPoints: string[];
  author: InstructorCourse;
  reviews: string[];
}

interface AuthorCardProps {
  author: InstructorCourse;
}

const AuthorCard = ({ author }: AuthorCardProps) => (
  <div className='flex items-center gap-4 bg-gray-50 p-4 rounded-lg shadow-sm'>
    {isValidWebUrl(author.avatarUrl) ? (
      <Image
        src={author.avatarUrl}
        alt={author.username}
        width={64}
        height={64}
        preview={false}
        className='rounded-full object-cover'
      />
    ) : (
      <div className='w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-white text-xl font-semibold'>
        {author.username.charAt(0).toUpperCase()}
      </div>
    )}

    <div>
      <p className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
        <UserOutlined className='text-gray-400' />
        {author.username}
      </p>
      <p className='text-sm text-gray-500 flex items-center gap-2'>
        <MailOutlined className='text-gray-400' />
        {author.email}
      </p>
    </div>
  </div>
);

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const StatCard = ({ icon, label, value }: StatCardProps) => (
  <div className='bg-gray-50 p-4 rounded-lg shadow-sm'>
    <div className='flex items-center gap-2 text-gray-600 mb-1'>
      {icon}
      <span className='text-sm font-medium'>{label}</span>
    </div>
    <p className='text-lg font-semibold text-gray-800'>{value}</p>
  </div>
);

interface OverviewSectionProps {
  description: string;
  learningPoints: string[];
}

const OverviewSection = ({ description, learningPoints }: OverviewSectionProps) => (
  <div className='border border-gray-200 rounded-lg p-6 bg-white shadow-sm transition-all duration-200 hover:shadow-md'>
    <h2 className='text-lg font-semibold text-gray-900 mb-3'>Description:</h2>
    <p className='text-gray-800 text-base leading-relaxed'>{description}</p>

    <div className='mt-6'>
      <h3 className='text-lg font-semibold text-gray-900 mb-3'>What You&apos;ll Learn</h3>
      <ul className='space-y-2'>
        {learningPoints.map((point, i) => (
          <li key={i} className='flex items-start gap-2 text-sm text-gray-700'>
            <CheckCircleOutlined className='text-green-500 mt-[2px]' />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

interface ReviewsSectionProps {
  reviews: string[];
}

const ReviewsSection = ({ reviews }: ReviewsSectionProps) => (
  <div className='text-gray-700'>
    <p className='mb-2 font-medium'>What students are saying:</p>
    <ul className='text-sm text-gray-600 list-disc pl-5 space-y-1'>
      {reviews.map((review, i) => (
        <li key={i}>&quot;{review}&quot;</li>
      ))}
    </ul>
  </div>
);

const CourseDetailTabs = ({
  description,
  learningPoints,
  author,
  reviews,
}: CourseDetailTabsProps) => {
  const items = [
    {
      key: 'overview',
      label: 'Overview',
      children: <OverviewSection description={description} learningPoints={learningPoints} />,
    },
    {
      key: 'author',
      label: 'Author',
      children: (
        <div className='flex flex-col gap-4'>
          <AuthorCard author={author} />
          <div className='grid grid-cols-2 gap-4'>
            <StatCard icon={<StarOutlined />} label='Rating' value='4.8/5.0' />
            <StatCard icon={<BookOutlined />} label='Courses' value='12' />
          </div>
        </div>
      ),
    },
    {
      key: 'reviews',
      label: 'Reviews',
      children: <ReviewsSection reviews={reviews} />,
    },
  ];

  return <Tabs defaultActiveKey='overview' items={items} className='mt-6' />;
};

export default CourseDetailTabs;
