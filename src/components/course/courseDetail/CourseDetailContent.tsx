import { Button, Collapse, Divider, Empty, Space } from "antd";
import { LockOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { LessonInTopic, TopicResponse } from "@/types/topicType";
import { formatDuration } from "@/utils/convertTime";
import { useRouter } from "next/navigation";


interface CourseDetailContentProps {
  sections: TopicResponse[];
  onLessonSelect: (lesson: LessonInTopic) => void;
  courseId: string;
}

const CourseDetailContent = ({ sections, onLessonSelect, courseId }: CourseDetailContentProps) => {
  const router = useRouter();
  const handleEnroll = () => {
    const target = `/payment/payment-confirm?courseId=${courseId}`;
    router.push(target);
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
        <Button type="primary" icon={<LockOutlined />} onClick={handleEnroll}>
          Enroll
        </Button>
      </div>
      <Divider size="small" />
      <Collapse items={collapseItems} defaultActiveKey={["0"]} ghost />
    </div>
  );
};

export default CourseDetailContent;
