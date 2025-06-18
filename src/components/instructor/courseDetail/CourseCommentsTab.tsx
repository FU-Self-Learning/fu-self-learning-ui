"use client";

import { Avatar, List, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";

interface CourseCommentsTabProps {
  courseId: string;
}

export const CourseCommentsTab = ({ courseId }: CourseCommentsTabProps) => {
  return (
    <div>
      <div className="mb-6">
        <Typography.Title level={3}>Course Comments</Typography.Title>
      </div>
      <List
        className="bg-white rounded-lg"
        itemLayout="horizontal"
        dataSource={[]}
        renderItem={(item) => (
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