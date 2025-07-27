'use client';

import { useState } from 'react';
import { Spin } from 'antd';
import CourseCard from '@/components/course/CourseCard';
import { useCourses } from '@/hooks/course/useCourses';
import CourseHeader from '@/components/course/CourseHeader';

export default function CoursePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const { data: courses, isLoading } = useCourses();

  if (isLoading || !courses) {
    return <Spin className='h-screen flex justify-center items-center' />;
  }

  const allCategories = Array.from(
    new Set(courses.flatMap((course) => course.categories?.map((cat) => cat.name) || [])),
  );

  const activeCourses = courses.filter((course) => course.status === 'active');

  const filteredByCategory = selectedCategory
    ? activeCourses.filter((course) =>
        course.categories?.some((cat) => cat.name === selectedCategory),
      )
    : activeCourses;

  const filteredBySearch = searchValue.trim()
    ? filteredByCategory.filter(
        (course) =>
          course.title.toLowerCase().includes(searchValue.trim().toLowerCase()) ||
          course.description?.toLowerCase().includes(searchValue.trim().toLowerCase()),
      )
    : filteredByCategory;

  return (
    <div>
      <CourseHeader
        total={filteredBySearch.length}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        allCategories={allCategories}
        onSearch={setSearchValue}
      />
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {filteredBySearch?.map((item) => (
          <CourseCard key={item.id} material={item} />
        ))}
      </div>
    </div>
  );
}
