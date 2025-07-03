"use client";

import { Avatar, Button, List, Typography, Space } from "antd";
import { ArrowLeftOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

interface CourseCommentsTabProps {
  courseId: string;
}

export const CourseCommentsTab = ({ courseId }: CourseCommentsTabProps) => {
  const router = useRouter();
  console.log(courseId);

  return (
    <div>
      <Space className="mb-6">
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          className="mb-2 !bg-white !text-black"
          onClick={() => router.back()}
        />
        <Typography.Title level={3}>Course Comments</Typography.Title>
      </Space>
      <List
        className="bg-white rounded-lg"
        itemLayout="horizontal"
        dataSource={[]}
        renderItem={() => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={
                <div className="flex items-center gap-2">
                  <Typography.Text strong>User Name</Typography.Text>
                  <Typography.Text type="secondary" className="text-sm">
                    2 days ago
                  </Typography.Text>
                </div>
              }
              description="Comment content goes here"
            />
          </List.Item>
        )}
      />
    </div>
  );
};
