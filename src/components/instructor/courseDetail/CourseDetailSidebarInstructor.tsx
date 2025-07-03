'use client';

import { Image, Layout, Menu, Tooltip } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

interface CourseDetailSidebarInstructorProps {
  items: { key: string; label: string }[];
  imageUrl: string;
  courseId: string;
  activeTab: string;
  onTabChange: (key: string) => void;
}

const { Sider } = Layout;

export const CourseDetailSidebarInstructor = ({
  items,
  imageUrl,
  courseId,
  activeTab,
  onTabChange,
}: CourseDetailSidebarInstructorProps) => {
  const router = useRouter();
  return (
    <Sider
      width={300}
      style={{
        background: '#fff',
        borderRight: '1px solid #f0f0f0',
      }}
    >
      <div className='p-4'>
        <div
          className='mb-4 rounded overflow-hidden cursor-pointer relative group'
          onClick={() => router.push(`/course/${courseId}`)}
          title='View detail course'
          style={{ width: '100%', height: '170px' }}
        >
          <Image
            src={imageUrl}
            alt='Course cover'
            className='object-cover rounded-lg'
            preview={false}
          />
          <div className='absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition duration-300' />
          <div className='absolute inset-0 flex items-center justify-center'>
            <Tooltip title='View detail course'>
              <PlayCircleOutlined
                className='text-5xl opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-300 rounded-full'
                style={{ fontSize: 48 }}
              />
            </Tooltip>
          </div>
        </div>
        <Menu
          mode='inline'
          selectedKeys={[activeTab]}
          items={items}
          onClick={({ key }) => onTabChange(key)}
        />
      </div>
    </Sider>
  );
};
