"use client";

import { Input, Layout, Spin, Typography } from "antd";
import { useParams } from "next/navigation";
import { useCourseInstructorDetail } from "@/hooks/course/instructor/useCourseInstructorDetail";
import { CourseDetailSidebarInstructor } from "@/components/instructor/courseDetail/CourseDetailSidebarInstructor";
import { InfoCircleOutlined } from "@ant-design/icons";
import "./InstructorCourseDetail.css";

const { Content } = Layout;

export default function CourseDetailPage() {
  const { id } = useParams();
  const { data: course, isLoading } = useCourseInstructorDetail(id as string);

  if (isLoading)
    return <Spin className="flex justify-center items-center h-screen" />;
  if (!course) return <div>Course not found</div>;

  const items = [
    { key: "1", label: "Details" },
    { key: "2", label: "Statistics" },
    { key: "3", label: "Comments" },
  ];

  return (
    <Layout style={{ minHeight: "80vh" }} className="course-detail-page">
      <CourseDetailSidebarInstructor
        items={items}
        imageUrl={course.imageUrl}
        courseId={course.id}
      />
      <Layout>
        <Content
          style={{
            padding: "24px 16px 0 16px",
            background: "#fff",
          }}
        >
          <Typography.Title level={3}>Video Details</Typography.Title>
          <div className="space-y-6">
            <div>
              <Typography.Text strong className="flex items-center gap-1 mb-2">
                Title (required) <InfoCircleOutlined />
              </Typography.Text>
              <Input
                value={course.title}
                maxLength={100}
                placeholder="Enter video title"
                className="mt-1"
              />
              <div className="text-right text-xs text-gray-500">
                {course.title.length}/100
              </div>
            </div>

            <div>
              <Typography.Text strong className="flex items-center gap-1 mb-2">
                Description <InfoCircleOutlined />
              </Typography.Text>
              <Input.TextArea
                value={course.description}
                rows={4}
                placeholder="Enter video description"
                className="mt-1"
              />
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
