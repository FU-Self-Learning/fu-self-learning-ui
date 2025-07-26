'use client';

import { useState } from 'react';
import { Spin } from 'antd';
import CourseCard from '@/components/course/CourseCard';
import { useCourses } from '@/hooks/course/useCourses';
import CourseHeader from '@/components/course/CourseHeader';


export default function CoursePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const { data: courses, isLoading } = useCourses();

  if (isLoading || !courses) {
    return <Spin className='h-screen flex justify-center items-center' />;
  }

  const allCategories = Array.from(
    new Set(courses.flatMap((course) => course.categories?.map((cat) => cat.name) || [])),
  );

  const filteredCourses = courses.filter((course) => {
    const matchCategory = selectedCategory
      ? course.categories?.some((cat) => cat.name === selectedCategory)
      : true;
    const matchSearch = search.trim()
      ? course.title?.toLowerCase().includes(search.trim().toLowerCase()) ||
        course.description?.toLowerCase().includes(search.trim().toLowerCase())
      : true;
    return matchCategory && matchSearch;
  });

  return (
    <div>
      <CourseHeader
        total={filteredCourses.length}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        allCategories={allCategories}
        onSearch={setSearch}
      />
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {filteredCourses?.map((item) => (
          <CourseCard key={item.id} material={item} />
        ))}
      </div>
    </div>
  );
}
