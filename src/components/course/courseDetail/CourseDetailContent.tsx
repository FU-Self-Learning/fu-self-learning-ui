import { Button, Collapse, Divider, Empty, Space } from "antd";
import { LockOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { LessonInTopic, TopicResponse } from "@/types/topicType";
import { formatDuration } from "@/utils/convertTime";
import { createOrder } from "@/shared/api/order.api";
import { useParams } from "next/navigation";

interface CourseDetailContentProps {
  sections: TopicResponse[];
  onLessonSelect: (lesson: LessonInTopic) => void;
  price?: number;
}

const CourseDetailContent = ({ sections, onLessonSelect, price }: CourseDetailContentProps) => {
  const params = useParams();
  let courseId = params?.id;
  if (Array.isArray(courseId)) {
    courseId = courseId[0];
  }

  const handleBuyCourse = async () => {
    if (!courseId) {
      console.error("Course ID not found in URL");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("User token not found. Please login.");
        return;
      }
      const numericCourseId = Number(courseId);
      if (isNaN(numericCourseId)) {
        console.error("Course ID is not a valid number");
        return;
      }
      const order = await createOrder(numericCourseId, Number(price), token);
      if (order?.payUrl) {
        window.location.href = order.payUrl;
      } else {
        console.log("Order created:", order);
      }
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  };

  const collapseItems = sections.sort((a, b) => a.id - b.id).map((section) => ({
    key: section.id.toString(),
    label: (
      <div className="flex justify-between w-full">
        <span>{section.title}</span>
        <span className="text-gray-500 text-sm">
          {formatDuration(section.totalDuration)}
        </span>
      </div>
    ),
    children:
      section.lessons && section.lessons.length > 0 ? (
        <ul className="text-sm text-gray-600 space-y-1">
          {section.lessons
            .sort((a, b) => a.id - b.id)
            .map((lesson: LessonInTopic, idx: number) => (
              <li
                key={idx}
                className="flex justify-between py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-50 px-2 rounded"
                onClick={() => onLessonSelect(lesson)}
              >
                <Space>
                  <PlayCircleOutlined />
                  {lesson.title}
                </Space>
                <span>{formatDuration(lesson.videoDuration)}</span>
              </li>
            ))}
        </ul>
      ) : (
        <Empty description="No lesson detail" />
      ),
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 h-fit">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Course content</h2>
        <Button type="primary" icon={<LockOutlined />} onClick={handleBuyCourse}>
          {price ? `${parseInt(price.toString(), 10)} VND` : "Free"}
        </Button>
      </div>
      <Divider size="small" />
      <Collapse items={collapseItems} defaultActiveKey={["0"]} ghost />
    </div>
  );
};

export default CourseDetailContent;
