import { CoursesResponse } from '@/types/courseType';
import { Card, Tag, Space, Progress, Button, Avatar, Typography, Image, Tooltip } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { isValidWebUrl } from '@/utils/urlValidation';

const { Paragraph, Text } = Typography;
const MAX_TAGS = 1;

export default function CourseCard({ material }: { material: CoursesResponse }) {
  const router = useRouter();

  const handleStartLearning = () => {
    router.push(`/course/${material.id}`);
  };

  return (
    <Card
      hoverable
      className='rounded-lg shadow-sm flex flex-col h-full !min-h-[420px] !max-h-[500px]'
      cover={
        <div className='relative h-40 overflow-hidden'>
          <Image
            src={material.imageUrl}
            alt={material.title}
            preview={false}
            className='object-cover w-full h-full'
          />
        </div>
      }
    >
      <div className='flex flex-col h-full'>
        <div className='flex-grow'>
          <div className='flex items-center gap-2 mb-2'>
            <Avatar
              src={isValidWebUrl(material.instructor.avatarUrl) ? material.instructor.avatarUrl : undefined}
              icon={<UserOutlined />}
              size='small'
            />
            <Text type='secondary' className='text-sm'>
              {material.instructor.username}
            </Text>
          </div>

          <h3 className='font-semibold text-base truncate mb-1'>{material.title}</h3>

          <Paragraph type='secondary' ellipsis={{ rows: 1 }} className='text-sm'>
            {material.description}
          </Paragraph>

          <div className='mb-2'>
            <Space wrap>
              {material.categories?.slice(0, MAX_TAGS).map((category) => (
                <Tag key={category.id} color='default'>
                  {category.name}
                </Tag>
              ))}
              {material.categories && material.categories.length > MAX_TAGS && (
                <Tooltip
                  title={material.categories
                    .slice(MAX_TAGS)
                    .map((cat) => cat.name)
                    .join(', ')}
                  placement='top'
                >
                  <Tag color='default' style={{ cursor: 'pointer' }}>
                    +{material.categories.length - MAX_TAGS} more
                  </Tag>
                </Tooltip>
              )}
            </Space>
          </div>

          {material.createdAt && (
            <Text type='secondary' className='text-xs'>
              Created at: {dayjs(material.createdAt).format('DD MMM YYYY')}
            </Text>
          )}
        </div>

        <div className='mt-4'>
          <Button block type='primary' className='mt-4' onClick={handleStartLearning}>
            Start Learning
          </Button>
        </div>
      </div>
    </Card>
  );
}
