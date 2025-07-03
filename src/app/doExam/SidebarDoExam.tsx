'use client';

import { Statistic, Button, Progress, Typography, Space, Tooltip } from 'antd';
import { StarFilled } from '@ant-design/icons';
import { notification } from 'antd';
import dayjs from 'dayjs';

const { Text } = Typography;

interface TSidebarDoExam {
  percentComplete?: number;
  setPageIndex?: (pageIndex: number) => void;
  pageIndex?: number;
  QUESTIONS_PER_PAGE?: number;
  answers?: Record<number, string | string[]>;
  questions?: Array<{
    id: number;
    type: 'single' | 'multiple';
    question: string;
    options: Array<{ label: string; text: string }>;
    answer: string | string[];
  }>;
  markedQuestions?: number[];
}

export default function SidebarDoExam(props: TSidebarDoExam) {
  const {
    QUESTIONS_PER_PAGE = 2,
    percentComplete = 0,
    setPageIndex = () => {},
    pageIndex = 0,
    answers = {},
    questions = [],
    markedQuestions = [],
  } = props;

  const handleSummit = () => {
    if (percentComplete < 100) {
      notification.warning({
        message: 'Incomplete',
        description: 'You must answer all questions before submitting.',
        placement: 'topRight',
      });
      return;
    }
  };

  return (
    <div className='w-80 flex flex-col justify-between bg-white p-6 shadow-lg'>
      <div>
        <div className='mb-8'>
          <Statistic.Timer
            title={
              <Text strong className='text-lg'>
                Time Remaining
              </Text>
            }
            value={dayjs().add(15, 'minute').valueOf()}
            onFinish={() => {
              console.log('HET GIƠ NUII BAI DIIIII');
            }}
            format='mm:ss'
            type='countdown'
            className='text-center'
          />
        </div>

        <div className='mb-8'>
          <Text strong className='text-lg block mb-2'>
            Progress
          </Text>
          <Progress
            percent={percentComplete}
            status='active'
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
          <Text type='secondary' className='block text-center mt-2'>
            {Object.keys(answers).length} of {questions.length} questions answered
          </Text>
        </div>

        <div className='mb-6'>
          <Text strong className='text-lg block mb-4'>
            Question Navigation
          </Text>
          <div className='grid grid-cols-4 gap-3'>
            {questions.map((q, idx) => {
              const questionPage = Math.floor(idx / QUESTIONS_PER_PAGE);
              const isCurrentPage = questionPage === pageIndex;
              const isAnswered = Array.isArray(answers[q.id])
                ? answers[q.id].length > 0
                : !!answers[q.id];
              const isMarked = markedQuestions.includes(q.id);

              return (
                <Tooltip key={q.id} title={`Question ${q.id}`} placement='top'>
                  <Button
                    shape='circle'
                    type={isAnswered ? 'primary' : 'default'}
                    className={`
                                            relative
                                            ${isCurrentPage ? 'ring-2 ring-blue-500' : ''}
                                            ${isMarked ? '!bg-yellow-400 !border-yellow-400 hover:!bg-yellow-500' : ''}
                                            ${isAnswered && !isMarked ? '!bg-blue-500 !border-blue-500 hover:!bg-blue-600' : ''}
                                        `}
                    onClick={() => setPageIndex(questionPage)}
                  >
                    {q.id}
                    {isMarked && (
                      <StarFilled className='absolute -top-1 -right-1 text-yellow-500 text-xs' />
                    )}
                  </Button>
                </Tooltip>
              );
            })}
          </div>
        </div>

        <div className='mb-6'>
          <Text strong className='text-lg block mb-2'>
            Legend
          </Text>
          <Space direction='vertical' className='w-full'>
            <div className='flex items-center gap-2'>
              <div className='w-4 h-4 rounded-full bg-blue-500'></div>
              <Text>Answered</Text>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-4 h-4 rounded-full bg-yellow-400'></div>
              <Text>Marked</Text>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-4 h-4 rounded-full bg-gray-200'></div>
              <Text>Unanswered</Text>
            </div>
          </Space>
        </div>
      </div>

      <Button
        type='primary'
        size='large'
        className='!bg-green-500 hover:!bg-green-600 !border-none !h-12 !text-lg'
        onClick={handleSummit}
      >
        Submit Exam
      </Button>
    </div>
  );
}
