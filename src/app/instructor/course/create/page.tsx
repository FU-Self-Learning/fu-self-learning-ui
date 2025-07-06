'use client';

import React, { useState } from 'react';
import { Spin, Steps, Radio, Card, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { CourseDocument } from '@/components/instructor/createForm/CourseDocument';
import { CourseInformation } from '@/components/instructor/createForm/CourseInformation';
import { CourseThumbnail } from '@/components/instructor/createForm/CourseThumbnail';
import { PDFCourseGenerator } from '@/components/instructor/createForm/PDFCourseGenerator';
import { useCategories } from '@/hooks/category/useCategories';
import { CreateCourseRequest } from '@/types/courseType';
import { useCreateCourse } from '@/hooks/course/instructor/useCreateCourse';

const steps = [
  {
    title: 'Course Information',
    description: 'Basic course details',
  },
  {
    title: 'Course Thumbnail',
    description: 'Add your thumbnail',
  },
  {
    title: 'Course Document',
    description: 'Add your document',
  },
];

const pdfSteps = [
  {
    title: 'Upload PDF',
    description: 'Upload and generate course',
  },
  {
    title: 'Review & Create',
    description: 'Review generated structure',
  },
];

export default function CreateCourse() {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState<Partial<CreateCourseRequest>>();
  const [creationMode, setCreationMode] = useState<'manual' | 'pdf'>('manual');
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const { mutate: createCourse, isPending: isLoadingCreateCourse } = useCreateCourse();
  const router = useRouter();

  const handleNext = (data: Partial<CreateCourseRequest>) => {
    setFormData({ ...formData, ...data });
    setCurrent(current + 1);
  };

  const handleBack = () => {
    setCurrent(current - 1);
  };

  const handleSubmit = async (data: CreateCourseRequest) => {
    const finalData = { ...formData, ...data };

    const image = finalData.image[0].originFileObj;
    const video = finalData.video[0].originFileObj;
    const document = finalData.document?.[0]?.originFileObj;
    const formDataSubmit = new FormData();
    formDataSubmit.append('title', finalData.title);
    formDataSubmit.append('description', finalData.description);
    if (image) {
      formDataSubmit.append('image', image);
    }
    if (video) {
      formDataSubmit.append('video', video);
    }
    if (document) {
      formDataSubmit.append('document', document);
    }
    finalData.categoryIds.forEach((id) => {
      formDataSubmit.append('categoryIds', id.toString());
    });

    createCourse(formDataSubmit, {
      onSuccess: (response) => {
        // Redirect to course detail page
        router.push(`/instructor/course/${response.id}`);
      },
    });
  };

  const handleModeChange = (mode: 'manual' | 'pdf') => {
    setCreationMode(mode);
    setCurrent(0);
    setFormData(undefined);
  };

  const renderStep = () => {
    if (creationMode === 'pdf') {
      return (
        <PDFCourseGenerator
          onBack={() => setCurrent(0)}
          onSubmit={handleSubmit}
          initialData={formData}
          isLoading={isLoadingCreateCourse}
        />
      );
    }

    switch (current) {
      case 0:
        return (
          <CourseInformation
            onNext={handleNext}
            initialData={formData}
            categories={categories || []}
          />
        );
      case 1:
        return <CourseThumbnail onNext={handleNext} onBack={handleBack} initialData={formData} />;
      case 2:
        return (
          <CourseDocument
            onBack={handleBack}
            onSubmit={handleSubmit}
            initialData={formData}
            isLoading={isLoadingCreateCourse}
          />
        );
      default:
        return null;
    }
  };

  if (isLoadingCategories || !categories) {
    return <Spin className='flex justify-center items-center h-screen' />;
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto'>
        <Card className='mb-6'>
          <Typography.Title level={4} className='mb-4'>
            Choose Creation Method
          </Typography.Title>
          <Radio.Group
            value={creationMode}
            onChange={(e) => handleModeChange(e.target.value)}
            className='w-full'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Radio.Button
                value='manual'
                className='h-24 flex items-center justify-center text-center'
              >
                <div>
                  <div className='font-semibold'>Manual Creation</div>
                  <div className='text-sm text-gray-500'>Create course step by step</div>
                </div>
              </Radio.Button>
              <Radio.Button
                value='pdf'
                className='h-24 flex items-center justify-center text-center'
              >
                <div>
                  <div className='font-semibold'>Generate from PDF</div>
                  <div className='text-sm text-gray-500'>Auto-generate from PDF document</div>
                </div>
              </Radio.Button>
            </div>
          </Radio.Group>
        </Card>

        {/* Steps */}
        {creationMode === 'manual' && (
          <Steps current={current} items={steps} className='!my-8 !px-2' />
        )}
        {creationMode === 'pdf' && (
          <Steps current={current} items={pdfSteps} className='!my-8 !px-2' />
        )}

        <div className='bg-white p-8 rounded-lg shadow-sm'>{renderStep()}</div>
      </div>
    </div>
  );
}
