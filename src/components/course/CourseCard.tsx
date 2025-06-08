import { CoursesResponse } from "@/providers/auth/types/courseType";
import { Card, Tag, Space, Progress, Button, Avatar, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

const { Paragraph, Text } = Typography;

export default function CourseCard({
  material,
}: {
  material: CoursesResponse;
}) {
  const router = useRouter();

  const handleStartLearning = () => {
    router.push(`/course/${material.id}`);
  };

  return (
    <Card
      hoverable
      className="rounded-lg shadow-sm"
      cover={
        <div className="relative h-40 overflow-hidden">
          <img
            src={material.imageUrl}
            alt={material.title}
            className="object-cover w-full h-full"
          />
        </div>
      }
    >
      <div className="flex items-center gap-2 mb-2">
        <Avatar
          src={material.instructor.avatarUrl}
          icon={!material.instructor.avatarUrl && <UserOutlined />}
          size="small"
        />
        <Text type="secondary" className="text-sm">
          {material.instructor.username}
        </Text>
      </div>

      <h3 className="font-semibold text-base truncate mb-1">
        {material.title}
      </h3>

      <Paragraph type="secondary" ellipsis={{ rows: 2 }} className="text-sm">
        {material.description}
      </Paragraph>

      <div className="mb-2">
        <Space wrap>
          {material.categories?.map((category) => (
            <Tag key={category.id} color="default">
              {category.name}
            </Tag>
          ))}
        </Space>
      </div>

      {material.createdAt && (
        <Text type="secondary" className="text-xs">
          Created at: {dayjs(material.createdAt).format("DD MMM YYYY")}
        </Text>
      )}

      <div className="mt-2">
        <Progress percent={30} size="small" />
      </div>

      <Button block type="primary" className="mt-4" onClick={handleStartLearning}>
        Start Learning
      </Button>
    </Card>
  );
}
