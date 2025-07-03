"use client";

import React, { useState } from "react";
import { Spin, Steps } from "antd";
import { CourseDocument } from "@/components/instructor/createForm/CourseDocument";
import { CourseInformation } from "@/components/instructor/createForm/CourseInformation";
import { CourseThumbnail } from "@/components/instructor/createForm/CourseThumbnail";
import { useCategories } from "@/hooks/category/useCategories";
import { CreateCourseRequest } from "@/types/courseType";
import { useCreateCourse } from "@/hooks/course/useCreateCourse";

const steps = [
  {
    title: "Course Information",
    description: "Basic course details",
  },
  {
    title: "Course Thumbnail",
    description: "Add your thumbnail",
  },
  {
    title: "Course Document",
    description: "Add your document",
  },
];

export default function CreateCourse() {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState<Partial<CreateCourseRequest>>();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const { mutate: createCourse, isPending: isLoadingCreateCourse } =
    useCreateCourse();

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
    formDataSubmit.append("title", finalData.title);
    formDataSubmit.append("description", finalData.description);
    if (image) {
      formDataSubmit.append("image", image);
    }
    if (video) {
      formDataSubmit.append("video", video);
    }
    if (document) {
      formDataSubmit.append("document", document);
    }
    finalData.categoryIds.forEach((id) => {
      formDataSubmit.append("categoryIds", id.toString());
    });
    
    createCourse(formDataSubmit);
  };

  const renderStep = () => {
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
        return (
          <CourseThumbnail
            onNext={handleNext}
            onBack={handleBack}
            initialData={formData}
          />
        );
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
    return <Spin className="flex justify-center items-center h-screen" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        <Steps current={current} items={steps} className="!mb-8" />
        <div className="bg-white p-8 rounded-lg shadow-sm">{renderStep()}</div>
      </div>
    </div>
  );
}
