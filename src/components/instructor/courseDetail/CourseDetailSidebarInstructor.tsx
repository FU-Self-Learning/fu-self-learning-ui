import { Layout, Menu, Tooltip } from "antd";
import "./CourseDetailSidebarInstructor.css";
import { useRouter } from "next/navigation";
import { PlayCircleOutlined } from "@ant-design/icons";

const { Sider } = Layout;

interface CourseDetailSidebarInstructorProps {
  items: { key: string; label: string }[];
  imageUrl: string;
  courseId: string;
}

export const CourseDetailSidebarInstructor = ({
  items,
  imageUrl,
  courseId,
}: CourseDetailSidebarInstructorProps) => {
  const router = useRouter();

  return (
    <Sider width={250} className="course-detail-sidebar-instructor">
      <div
        className="mb-4 rounded overflow-hidden cursor-pointer relative group"
        onClick={() => router.push(`/course/${courseId}`)}
        title="View detail course"
        style={{ width: "100%", height: "170px" }}
      >
        <img
          src={imageUrl}
          alt="Course Thumbnail"
          className="object-cover w-full h-full block"
          style={{ height: "170px" }}
        />

        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition duration-300" />

        <div className="absolute inset-0 flex items-center justify-center">
          <Tooltip title="View detail course">
            <PlayCircleOutlined
              className="text-5xl opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-300 rounded-full"
              style={{ fontSize: 48 }}
            />
          </Tooltip>
        </div>
      </div>

      <Menu mode="inline" defaultSelectedKeys={["1"]} items={items} />
    </Sider>
  );
};
