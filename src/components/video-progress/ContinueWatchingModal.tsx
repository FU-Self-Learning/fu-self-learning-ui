import React from 'react';
import { Modal, Button, Typography } from 'antd';
import { LastWatchedVideo } from '@/types/enrollmentType';

const { Title, Text } = Typography;

interface ContinueWatchingModalProps {
  lastWatchedVideo: LastWatchedVideo | null;
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export const ContinueWatchingModal: React.FC<ContinueWatchingModalProps> = ({
  lastWatchedVideo,
  isOpen,
  onClose,
  onContinue,
}) => {
  if (!lastWatchedVideo) {
    return null;
  }

  return (
    <Modal
      title='Resume Course'
      open={isOpen}
      onCancel={onClose}
      maskClosable={false}
      keyboard={false}
      closable={false}
      footer={[
        <Button key='cancel' size='large' onClick={onClose}>
          Start from Beginning
        </Button>,
        <Button key='continue' type='primary' size='large' onClick={onContinue}>
          Continue from Last Lesson
        </Button>,
      ]}
      centered
    >
      <div style={{ padding: '20px 0' }}>
        <Title level={5}>Would you like to continue where you left off?</Title>
        <div style={{ marginTop: '16px' }}>
          <Text>
            Course: <strong>{lastWatchedVideo.courseTitle}</strong>
          </Text>
          <br />
          <Text>Last watched lesson: {lastWatchedVideo.lessonTitle}</Text>
        </div>

        <div style={{ marginTop: '16px', color: '#666' }}>
          <Text>
            &bull; Click &ldquo;Continue from Last Lesson&rdquo; to resume from where you left off
            <br />
            &bull; Click &ldquo;Start from Beginning&rdquo; to start the course from the first
            lesson
          </Text>
        </div>
      </div>
    </Modal>
  );
};

export default ContinueWatchingModal;
