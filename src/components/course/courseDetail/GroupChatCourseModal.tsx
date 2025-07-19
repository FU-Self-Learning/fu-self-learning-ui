import React, { useState } from 'react';
import { Modal, List, Spin, Avatar, Progress, Checkbox, Button, Collapse, Alert } from 'antd';
import { fetchFollowerUsers } from '@/shared/api/user.api';
import { FollowRelationship } from '@/types/followType';
import { createGroupChat } from '@/shared/api/groupchat.api';

interface GroupChatCourseModalProps {
  visible: boolean;
  onClose: () => void;
  loading: boolean;
  courses: any[];
}


const GroupChatCourseModal: React.FC<GroupChatCourseModalProps> = ({ visible, onClose, loading, courses }) => {
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [userLoading, setUserLoading] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [groupName, setGroupName] = useState('');

  const fetchUsers = async () => {
    try {
      setUserLoading(true);
      setError(null);
      const followerUsers = await fetchFollowerUsers();
      setUsers(followerUsers.map(u => ({
        ...u,
        id: typeof u.id === 'string' ? parseInt(u.id, 10) : u.id,
      })));
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error instanceof Error ? error.message : 'Failed to load users');
    } finally {
      setUserLoading(false);
    }
  };

  const handleCourseExpand = async (courseId: string) => {
    if (expandedCourseId === courseId) {
      setExpandedCourseId(null);
      setUsers([]);
      setSelectedUserIds([]);
      setError(null);
    } else {
      setExpandedCourseId(courseId);
      setSelectedUserIds([]);
      await fetchUsers();
    }
  };

  const handleUserSelect = (userId: string, checked: boolean) => {
    setSelectedUserIds(prev => checked ? [...prev, userId] : prev.filter(id => id !== userId));
  };

  const handleCreateGroupChat = async (course: any) => {
    try {
      await createGroupChat({
        name: groupName,
        courseId: typeof course.id === 'string' ? parseInt(course.id, 10) : course.id,
        memberIds: selectedUserIds.map(id => typeof id === 'string' ? parseInt(id, 10) : id),
      });
      setExpandedCourseId(null);
      setUsers([]);
      setSelectedUserIds([]);
      setError(null);
    } catch (error) {
      setError('Failed to create group chat');
    }
  };

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
            const isExpanded = expandedCourseId === course.id;
            return (
              <>
                <List.Item
                  key={item.id}
                  style={{ cursor: 'pointer', flexDirection: 'column', alignItems: 'stretch' }}
                  onClick={e => {
                    if (e.target instanceof HTMLElement && (e.target.tagName === 'INPUT' || e.target.tagName === 'LABEL')) return;
                    handleCourseExpand(course.id);
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <List.Item.Meta
                      avatar={<Avatar shape="square" size={64} src={course.imageUrl} />}
                      title={<span style={{ fontWeight: 500 }}>{course.title}</span>}
                      description={
                        <>
                          <div>Instructor: <b>{course.instructor?.username}</b></div>
                          <div>Description: {course.description}</div>
                          <div>Enrollment Date: {new Date(item.enrolledAt).toLocaleDateString('vi-VN')}</div>
                        </>
                      }
                    />
                    <div style={{ minWidth: 120, textAlign: 'center' }}>
                      <div>Progress</div>
                      <Progress percent={parseFloat(item.progress)} size="small" />
                    </div>
                  </div>
                  {isExpanded && (
                    <div style={{ background: '#fafafa', margin: '16px 0', padding: '16px', borderRadius: 8 }}>
                      <div style={{ marginBottom: 8, fontWeight: 500 }}>User List</div>
                      {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 8 }} />}
                      {userLoading ? <Spin /> : (
                        <List
                          dataSource={users}
                          renderItem={user => (
                            <List.Item
                              key={user.id}
                              style={{ cursor: 'pointer' }}
                              onClick={e => {
                                e.stopPropagation();
                                handleUserSelect(user.id, !selectedUserIds.includes(user.id));
                              }}
                            >
                              <List.Item.Meta
                                avatar={<Avatar src={user.avatarUrl && user.avatarUrl.trim() !== '' ? user.avatarUrl : undefined} />}
                                title={user.username}
                              />
                              <Checkbox
                                checked={selectedUserIds.includes(user.id)}
                                onChange={e => handleUserSelect(user.id, e.target.checked)}
                                onClick={e => e.stopPropagation()}
                              />
                            </List.Item>
                          )}
                          locale={{ emptyText: 'No users found.' }}
                        />
                      )}
                      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                        <input
                          type="text"
                          placeholder="Enter Group Name"
                          value={groupName}
                          onChange={e => setGroupName(e.target.value)}
                          style={{ flex: 1, padding: '6px 12px', borderRadius: 4, border: '1px solid #d9d9d9' }}
                          disabled={selectedUserIds.length === 0}
                        />
                        <Button
                          type="default"
                          disabled={selectedUserIds.length === 0}
                          onClick={() => handleCreateGroupChat(course)}
                        >
                          Create Group
                        </Button>
                      </div>
                    </div>
                  )}
                </List.Item>
              </>
            );
          }}
          locale={{ emptyText: 'You have not enrolled in any course.' }}
        />
      )}
    </Modal>
  );
};

export default GroupChatCourseModal;
