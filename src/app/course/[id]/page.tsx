"use client";

import { useParams } from "next/navigation";
import {
  CourseDetailHeader,
  CourseDetailTabs,
  CourseDetailContent,
} from "@/components/course/courseDetail";
import { courseOverview, tabItems, courseSections } from "./courseData";
import { useCourseDetail } from "@/hooks/course/useCourseDetail";
import { Spin } from "antd";

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: courseDetail, isLoading } = useCourseDetail(id);

  if (isLoading || !courseDetail)
    return <Spin className="flex justify-center items-center h-screen" />;

  return (
    <div className="max-w-screen-xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <CourseDetailHeader
          videoIntroUrl={courseDetail.videoIntroUrl}
          title={courseDetail.title}
          category={courseDetail.categories[0].name}
          stats={courseDetail.topics.length.toString()}
        />
        <CourseDetailTabs
          items={tabItems}
          description={courseOverview.description}
          learningPoints={courseOverview.learningPoints}
        />
      </div>
      <CourseDetailContent sections={courseSections} />
    </div>
  );
};

export default CourseDetail;
