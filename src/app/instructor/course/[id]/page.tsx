'use client';

import { Layout, Spin } from 'antd';
import { useParams } from 'next/navigation';
import { useCourseInstructorDetail } from '@/hooks/course/instructor/useCourseInstructorDetail';
import { CourseDetailSidebarInstructor } from '@/components/instructor/courseDetail/CourseDetailSidebarInstructor';
import { CourseDetailsTab } from '@/components/instructor/courseDetail/CourseDetailsTab';
import { CourseTopicsTab } from '@/components/instructor/courseDetail/topic/CourseTopicsTab';
import { CourseCommentsTab } from '@/components/instructor/courseDetail/CourseCommentsTab';
import { useState } from 'react';

const { Content } = Layout;

export default function CourseDetailPage() {
  const { id } = useParams();
  const { data: course, isLoading } = useCourseInstructorDetail(id as string);
  const [activeTab, setActiveTab] = useState('1');

  if (isLoading) return <Spin className='flex justify-center items-center h-screen' />;
  if (!course) return <div>Course not found</div>;

  const items = [
    { key: '1', label: 'Details' },
    { key: '2', label: 'Topics' },
    { key: '3', label: 'Comments' },
  ];

  const handleSave = async (values: any) => {
    try {
      // TODO: Implement save logic here
      console.log('Saving values:', values);
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case '1':
        return <CourseDetailsTab course={course} onSave={handleSave} />;
      case '2':
        return <CourseTopicsTab courseId={course.id} />;
      case '3':
        return <CourseCommentsTab courseId={course.id} />;
      default:
        return null;
    }
  };

  return (
    <Layout style={{ minHeight: '80vh' }} className='course-detail-page'>
      <CourseDetailSidebarInstructor
        items={items}
        imageUrl={course.imageUrl}
        courseId={course.id}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <Layout>
        <Content
          style={{
            padding: '24px 16px 0 16px',
            background: '#fff',
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}
