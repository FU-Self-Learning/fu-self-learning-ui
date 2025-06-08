import { Button, Collapse, Divider, Space } from "antd";
import { LockOutlined, PlayCircleOutlined } from "@ant-design/icons";

const CourseDetailContent = ({ sections }: { sections: any[] }) => {
  const collapseItems = sections.map((section) => ({
    key: section.key,
    label: (
      <div className="flex justify-between w-full">
        <span>{section.title}</span>
        <span className="text-gray-500 text-sm">{section.duration}</span>
      </div>
    ),
    children: section.lessons ? (
      <ul className="text-sm text-gray-600 space-y-1">
        {section.lessons.map((lesson: any, idx: number) => (
          <li
            key={idx}
            className="flex justify-between py-2 border-b border-gray-200"
          >
            <Space>
              <PlayCircleOutlined />
              {lesson.title}
            </Space>
            <span>{lesson.duration}</span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500 text-sm">No lesson detail</p>
    ),
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 h-fit">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Course content</h2>
        <Button type="primary" icon={<LockOutlined />}>
          Enroll Now
        </Button>
      </div>
      <Divider size="small" />
      <Collapse items={collapseItems} defaultActiveKey={["0"]} ghost />
    </div>
  );
};

export default CourseDetailContent;
