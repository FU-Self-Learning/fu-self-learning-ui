'use client';

import { useState } from 'react';
import { Spin } from 'antd';
import StatusFilter from '@/components/course/StatusFilter';
import CourseHeader from '@/components/course/CourseHeader';
import EnrolledCourseCard from '@/components/course/EnrolledCourseCard';
import { useMyEnrolledCourses } from '@/hooks/enrollment/useEnrollment';

const statusFilters = ['All Status', 'Not Started', 'In Progress', 'Completed'];

export default function MyLearningPage() {
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const { data: enrolledCourses, isLoading } = useMyEnrolledCourses();

  if (isLoading || !enrolledCourses) {
    return <Spin className='h-screen flex justify-center items-center' />;
  }

  const allCategories = Array.from(
    new Set(
      enrolledCourses.flatMap(
        (enrollment) => enrollment.course.categories?.map((cat) => cat.name) || [],
      ),
    ),
  );

  const filteredByCategory = selectedCategory
    ? enrolledCourses.filter((enrollment) =>
        enrollment.course.categories?.some((cat) => cat.name === selectedCategory),
      )
    : enrolledCourses;

  const filteredBySearch = searchValue.trim()
    ? filteredByCategory.filter(
        (enrollment) =>
          enrollment.course.title.toLowerCase().includes(searchValue.trim().toLowerCase()) ||
          enrollment.course.description?.toLowerCase().includes(searchValue.trim().toLowerCase()),
      )
    : filteredByCategory;

  const getEnrollmentStatus = (enrollment: any) => {
    if (enrollment.completedAt) return 'completed';
    if (enrollment.progress > 0) return 'in_progress';
    return 'not_started';
  };

  const finalFilteredCourses =
    selectedStatus === 'All Status'
      ? filteredBySearch
      : filteredBySearch.filter((enrollment) => {
          const status = getEnrollmentStatus(enrollment);
          if (selectedStatus === 'Not Started') return status === 'not_started';
          if (selectedStatus === 'In Progress') return status === 'in_progress';
          if (selectedStatus === 'Completed') return status === 'completed';
          return true;
        });

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>My Learning</h1>
        <p className='text-gray-600'>Continue your learning journey with your enrolled courses</p>
      </div>

      <CourseHeader
        total={finalFilteredCourses.length}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        allCategories={allCategories}
        onSearch={setSearchValue}
      />
      <StatusFilter
        statusFilters={statusFilters}
        selectedStatus={selectedStatus}
        onChange={setSelectedStatus}
      />

      {finalFilteredCourses.length === 0 ? (
        <div className='text-center py-12'>
          <div className='text-gray-500'>
            <svg
              className='mx-auto h-12 w-12 text-gray-400 mb-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
              />
            </svg>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>No courses found</h3>
            <p className='text-gray-500'>
              You haven&apos;t enrolled in any courses yet. Start learning today!
            </p>
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {finalFilteredCourses?.map((enrollment) => (
            <EnrolledCourseCard
              key={`${enrollment.id}-${enrollment.course.id}`}
              enrollment={enrollment}
            />
          ))}
        </div>
      )}
    </div>
  );
}
