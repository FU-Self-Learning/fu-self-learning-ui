import React from 'react';
import { Modal, List, Spin, Avatar, Progress } from 'antd';

interface GroupChatCourseModalProps {
  visible: boolean;
  onClose: () => void;
  loading: boolean;
  courses: any[];
}

const GroupChatCourseModal: React.FC<GroupChatCourseModalProps> = ({ visible, onClose, loading, courses }) => {
  return (
    <Modal
      title="My Enrolled Courses"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      {loading ? (
        <Spin />
      ) : (
        <List
          dataSource={courses}
          renderItem={item => {
            const course = item.course;
            return (
              <List.Item key={item.id} style={{ alignItems: 'center' }}>
                <List.Item.Meta
                  avatar={<Avatar shape="square" size={64} src={course.imageUrl} />}
                  title={<span style={{ fontWeight: 500 }}>{course.title}</span>}
                  description={
                    <>
                      <div>Giảng viên: <b>{course.instructor?.username}</b></div>
                      <div>Mô tả: {course.description}</div>
                      <div>Ngày đăng ký: {new Date(item.enrolledAt).toLocaleDateString('vi-VN')}</div>
                    </>
                  }
                />
                <div style={{ minWidth: 120, textAlign: 'center' }}>
                  <div>Tiến độ</div>
                  <Progress percent={parseFloat(item.progress)} size="small" />
                </div>
              </List.Item>
            );
          }}
          locale={{ emptyText: 'Bạn chưa đăng ký khoá học nào.' }}
        />
      )}
    </Modal>
  );
};

export default GroupChatCourseModal;
