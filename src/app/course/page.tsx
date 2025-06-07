"use client";

import { useState } from "react";
import { Input, Button, Tag, Space, Spin } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  DownOutlined,
} from "@ant-design/icons";
import CourseCard from "@/components/course/CourseCard";
import StatusFilter from "@/components/course/StatusFilter";
import { useCourses } from "@/hooks/course/useCourses";

const statusFilters = ["All Status", "Not Started", "In Progress", "Completed"];

export default function CoursePage() {
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const { data: courses, isLoading } = useCourses();

  if (isLoading || !courses) {
    return <Spin className="h-screen flex justify-center items-center" />;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="text-2xl font-bold flex items-center gap-3">
          <span>All Materials</span>
          <Tag color="default">
            {courses.length}
          </Tag>
        </div>
        <Space wrap>
          <Input
            placeholder="Search..."
            prefix={<SearchOutlined />}
            allowClear
            style={{ width: 200 }}
          />
          <Button icon={<FilterOutlined />}>Add Filter</Button>
          <Button icon={<DownOutlined />}>Sort by</Button>
        </Space>
      </div>
      <StatusFilter
        statusFilters={statusFilters}
        selectedStatus={selectedStatus}
        onChange={setSelectedStatus}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {courses?.map((item) => (
          <CourseCard key={item.id} material={item} />
        ))}
      </div>
    </div>
  );
}
