"use client";

import { Image, Layout, Menu } from "antd";

interface CourseDetailSidebarInstructorProps {
  items: { key: string; label: string }[];
  imageUrl: string;
  courseId: string;
  activeTab: string;
  onTabChange: (key: string) => void;
}

const { Sider } = Layout;

export const CourseDetailSidebarInstructor = ({
  items,
  imageUrl,
  courseId,
  activeTab,
  onTabChange,
}: CourseDetailSidebarInstructorProps) => {
  return (
    <Sider
      width={300}
      style={{
        background: "#fff",
        borderRight: "1px solid #f0f0f0",
      }}
    >
      <div className="p-4">
        <div className="relative w-full h-40 mb-4">
          <Image
            src={imageUrl}
            alt="Course cover"
            className="object-cover rounded-lg"
            width={256}
            height={144}
          />
        </div>
        <Menu
          mode="inline"
          selectedKeys={[activeTab]}
          items={items}
          onClick={({ key }) => onTabChange(key)}
        />
      </div>
    </Sider>
  );
};
