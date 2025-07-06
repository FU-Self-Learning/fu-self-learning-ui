'use client';

import React from 'react';
import { Button, Space, Spin } from 'antd';
import { useMyCourseInstructor } from '@/hooks/course/instructor/useMyCourseInstructor';
import CourseCard from '@/components/instructor/CourseCard';
import { useRouter } from 'next/navigation';

const Header = () => (
  <div className='flex justify-between border shadow-md px-12 py-6 hover:shadow-lg transition bg-white w-full'>
    <h1 className='text-2xl font-semibold'>Jump Into Course Creation</h1>
    <Button
      type='primary'
      size='large'
      className='!px-6 !py-5 !text-lg'
      href='/instructor/course/create'
    >
      Create Your Course
    </Button>
  </div>
);

export default function InstructorDashboard() {
  const { data: courses, isLoading } = useMyCourseInstructor();
  const router = useRouter();

  if (isLoading) {
    return <Spin className='flex justify-center items-center h-screen' />;
  }

  const hasCourses = courses && courses.length > 0;

  return (
    <div className='p-6 md:p-10'>
      <Header />

      {!hasCourses ? (
        <>
          <div className='text-xl font-semibold my-20 text-center'>
            Based on your experience, we think these resources will be helpful.
          </div>
          <Space direction='vertical' size={32}>
            <CourseCard
              title='Create an Engaging Course'
              description="Whether you've been teaching for years or are teaching for the first time, you can make an engaging course..."
              imageSrc='https://s.udemycdn.com/instructor/dashboard/engaging-course.jpg'
              link='#'
            />
            <Space size={32}>
              <CourseCard
                title='Video Production Tips'
                description='Learn how to produce high-quality video content for your course, even from home.'
                imageSrc='https://s.udemycdn.com/instructor/dashboard/video-creation.jpg'
                link='#'
              />
              <CourseCard
                title='Build an Audience'
                description='Discover tools to promote your course and grow your student base.'
                imageSrc='https://s.udemycdn.com/instructor/dashboard/build-audience.jpg'
                link='#'
              />
            </Space>
          </Space>
        </>
      ) : (
        <>
          <div className='text-xl font-semibold my-10'>Your Courses</div>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
            {courses.map((course: any) => (
              <CourseCard
                key={course.id}
                title={course.title}
                description={course.description}
                imageSrc={course.imageUrl}
                link={`/instructor/course/${course.id}`}
                actions={[
                  <Button
                    key='edit'
                    type='link'
                    size='large'
                    className='!font-semibold !text-black hover:!text-blue-600'
                    onClick={() => router.push(`/instructor/course/${course.id}`)}
                  >
                    View Details
                  </Button>,
                  <Button
                    key='stats'
                    type='link'
                    size='large'
                    className='!font-semibold !text-black hover:!text-blue-600'
                    onClick={() => router.push(`/instructor/course/stats/${course.id}`)}
                  >
                    Stats
                  </Button>,
                ]}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
