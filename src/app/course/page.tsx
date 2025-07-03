'use client';

import { useState } from 'react';
import { Spin } from 'antd';
import CourseCard from '@/components/course/CourseCard';
import StatusFilter from '@/components/course/StatusFilter';
import { useCourses } from '@/hooks/course/useCourses';
import CourseHeader from '@/components/course/CourseHeader';

const statusFilters = ['All Status', 'Not Started', 'In Progress', 'Completed'];

export default function CoursePage() {
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: courses, isLoading } = useCourses();

  if (isLoading || !courses) {
    return <Spin className='h-screen flex justify-center items-center' />;
  }

  const allCategories = Array.from(
    new Set(courses.flatMap((course) => course.categories?.map((cat) => cat.name) || [])),
  );

  const filteredCourses = selectedCategory
    ? courses.filter((course) => course.categories?.some((cat) => cat.name === selectedCategory))
    : courses;

  return (
    <div>
      <CourseHeader
        total={filteredCourses.length}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        allCategories={allCategories}
      />
      <StatusFilter
        statusFilters={statusFilters}
        selectedStatus={selectedStatus}
        onChange={setSelectedStatus}
      />
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {filteredCourses?.map((item) => (
          <CourseCard key={item.id} material={item} />
        ))}
      </div>
    </div>
  );
}
