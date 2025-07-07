// FlashcardLearnView.tsx
import React, { useState } from 'react';
import { Card, Button, Progress, Typography, Space } from 'antd';
import { LeftOutlined, RightOutlined, RetweetOutlined, CloseOutlined } from '@ant-design/icons';
import ReactCardFlip from 'react-card-flip';

interface Props {
  flashcards: Array<{ id: number; front_text: string; back_text: string }>;
  onExit: () => void;
}

const CARD_WIDTH = 560;
const CARD_HEIGHT = 340;
const CARD_FONT = '!text-xl sm:!text-2xl';

const FlashcardLearnView: React.FC<Props> = ({ flashcards, onExit }) => {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className='text-center my-12'>
        <Typography.Text type='secondary'>No flashcards to learn.</Typography.Text>
      </div>
    );
  }

  const handleNext = () => {
    if (index < flashcards.length - 1) {
      setIndex(index + 1);
      setFlipped(false);
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex(index - 1);
      setFlipped(false);
    }
  };

  const handleFlip = () => setFlipped(!flipped);

  const progress = Math.round(((index + 1) / flashcards.length) * 100);

  const cardStyle = {
    minHeight: CARD_HEIGHT,
    textAlign: 'center' as const,
    padding: '40px',
    width: CARD_WIDTH,
    maxWidth: '100%',
    margin: '0 auto',
    border: '2px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div className='flex flex-col items-center justify-center px-4 py-8 max-w-2xl mx-auto'>
      <div className='w-full max-w-lg mb-6'>
        <Progress percent={progress} showInfo size='small' strokeColor='#1890ff' />
      </div>

      <ReactCardFlip isFlipped={flipped} flipDirection='horizontal'>
        <Card
          key='front'
          hoverable
          onClick={handleFlip}
          className={`w-[${CARD_WIDTH}px] min-h-[${CARD_HEIGHT}px] rounded-lg shadow cursor-pointer transition-transform duration-300 bg-white ${CARD_FONT}`}
          style={{ ...cardStyle }}
        >
          {flashcards[index].front_text}
        </Card>

        <Card
          key='back'
          hoverable
          onClick={handleFlip}
          className={`w-[${CARD_WIDTH}px] min-h-[${CARD_HEIGHT}px] rounded-lg shadow cursor-pointer transition-transform duration-300 bg-blue-50 ${CARD_FONT}`}
          style={{ ...cardStyle }}
        >
          {flashcards[index].back_text}
        </Card>
      </ReactCardFlip>

      <Space className='mt-6 flex-wrap justify-center'>
        <Button icon={<LeftOutlined />} onClick={handlePrev} disabled={index === 0}>
          Previous
        </Button>
        <Button type='primary' icon={<RetweetOutlined />} onClick={handleFlip}>
          Flip Card
        </Button>
        <Button
          icon={<RightOutlined />}
          onClick={handleNext}
          disabled={index === flashcards.length - 1}
        >
          Next
        </Button>
        <Button type='default' danger icon={<CloseOutlined />} onClick={onExit}>
          Exit
        </Button>
      </Space>

      <Typography.Text type='secondary' className='mt-4'>
        Card {index + 1} / {flashcards.length}
      </Typography.Text>
    </div>
  );
};

export default FlashcardLearnView;
