import { Typography, Badge, Button, Card, Input, Checkbox, Select } from 'antd';
import {
  MinusCircleOutlined,
  PlusOutlined,
  FileTextOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import React, { useRef } from 'react';
import { useGenerateQuestionsByTopic } from '@/hooks/exam/useGenerateQuestionsByTopic';
import { message } from 'antd';
import { extractErrorMessage } from '@/utils/ErrorHandle';

const { Text, Title } = Typography;

export interface QuestionEditorProps {
  questions: any[];
  topics: any[];
  addQuestion: () => void;
  removeQuestion: (index: number) => void;
  updateQuestion: (index: number, field: string | null, value: any) => void;
  addChoice: (questionIndex: number) => void;
  removeChoice: (questionIndex: number, choiceIndex: number) => void;
  updateChoice: (questionIndex: number, choiceIndex: number, value: string) => void;
  toggleCorrectAnswer: (questionIndex: number, choice: string, checked: boolean) => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  questions,
  topics,
  addQuestion,
  removeQuestion,
  updateQuestion,
  addChoice,
  removeChoice,
  updateChoice,
  toggleCorrectAnswer,
}) => {
  const { generate, isLoading } = useGenerateQuestionsByTopic();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Generate AI cho 1 câu hỏi theo topic đã chọn
  const handleGenerateAI = async (qIndex: number) => {
    const topicId = questions[qIndex].topicId;
    if (!topicId) {
      message.error('Please select a topic first!');
      return;
    }
    try {
      const aiQuestions = await generate(topicId, 1);
      console.log(aiQuestions);

      if (aiQuestions && aiQuestions.length > 0) {
        updateQuestion(qIndex, null, aiQuestions[0]);
        message.success('Generated question with AI!');
      } else {
        message.error('AI did not return any question.');
      }
    } catch (err) {
      message.error(extractErrorMessage(err) || 'Failed to generate question with AI.');
    }
  };

  // Scroll to bottom when add question
  const handleAddQuestion = () => {
    addQuestion();
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className='space-y-6 mt-5'>
      <Card className='shadow-lg border-0 rounded-xl overflow-hidden'>
        <div className='text-white'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center'>
                <FileTextOutlined className='text-2xl text-white' />
              </div>
              <div>
                <Title level={3} className='text-white mb-0'>
                  Questions <Badge count={questions.length} className='ml-2' />
                </Title>
                <Text className='text-white/80'>Create engaging questions for your test</Text>
              </div>
            </div>
            <Button
              type='primary'
              size='large'
              icon={<PlusOutlined />}
              onClick={handleAddQuestion}
              style={{
                background: 'linear-gradient(90deg, #4f8cff 0%, #6ee7b7 100%)',
                border: 'none',
                color: '#fff',
                fontWeight: 500,
                minWidth: 140,
                borderRadius: 8,
              }}
              className='hover:opacity-90 transition-all'
            >
              Add Question
            </Button>
          </div>
        </div>
      </Card>
      <div className='space-y-6 mt-5'>
        {questions.map((question, qIndex) => (
          <Card
            key={qIndex}
            className='shadow-lg border-0 rounded-xl overflow-hidden hover:shadow-xl transition-shadow !mt-3'
          >
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center space-x-3'>
                <div className='w-10 h-10 rounded-lg flex items-center justify-center'>
                  <Text className='text-white font-bold'>{qIndex + 1}</Text>
                </div>
                <Title level={5} className='mb-0'>
                  Question {qIndex + 1}
                </Title>
              </div>
              {questions.length > 1 && (
                <Button
                  type='text'
                  danger
                  icon={<MinusCircleOutlined />}
                  onClick={() => removeQuestion(qIndex)}
                  className='hover:bg-red-50 rounded-lg'
                >
                  Remove
                </Button>
              )}
            </div>
            <div className='space-y-4'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                <div>
                  <Text strong className='text-gray-700 block mb-2'>
                    Question Text
                  </Text>
                  <TextArea
                    placeholder='Enter your question here...'
                    value={question.question_text}
                    onChange={(e) => updateQuestion(qIndex, 'question_text', e.target.value)}
                    rows={3}
                    className='rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors'
                  />
                </div>
                <div>
                  <Text strong className='text-gray-700 block mb-2'>
                    Related Topic
                  </Text>
                  <Select
                    value={question.topicId || undefined}
                    placeholder='Select topic'
                    onChange={(value) => updateQuestion(qIndex, 'topicId', value)}
                    className='w-full rounded-lg'
                    size='large'
                    options={topics.map((topic) => ({
                      label: topic.title,
                      value: topic.id,
                    }))}
                  />
                  <div className='flex justify-start mt-2'>
                    <Button
                      type='primary'
                      icon={<BulbOutlined />}
                      loading={isLoading}
                      onClick={() => handleGenerateAI(qIndex)}
                      disabled={!question.topicId}
                      style={{
                        background: 'linear-gradient(90deg, #4f8cff 0%, #6ee7b7 100%)',
                        border: 'none',
                        color: '#fff',
                        fontWeight: 500,
                        minWidth: 140,
                        opacity: question.topicId ? 1 : 0.6,
                        boxShadow: '0 2px 8px rgba(79,140,255,0.08)',
                        borderRadius: 8,
                      }}
                      className='hover:opacity-90 transition-all'
                    >
                      Generate with AI
                    </Button>
                  </div>
                </div>
              </div>
              <div>
                <div className='flex justify-between items-center mb-3'>
                  <Text strong className='text-gray-700'>
                    Answer Choices
                  </Text>
                  <Button
                    type='dashed'
                    size='small'
                    icon={<PlusOutlined />}
                    onClick={() => addChoice(qIndex)}
                    className='rounded-lg hover:border-blue-400 hover:text-blue-500 transition-colors'
                  >
                    Add Choice
                  </Button>
                </div>
                <div className='space-y-3'>
                  {question.choices.map((choice: string, cIndex: number) => (
                    <div
                      key={cIndex}
                      className='flex gap-3 items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
                    >
                      <div className='flex items-center mt-1'>
                        <div className='w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3'>
                          {String.fromCharCode(65 + cIndex)}
                        </div>
                        <Checkbox
                          checked={question.correct_answer.includes(choice) && choice.trim() !== ''}
                          onChange={(e) => toggleCorrectAnswer(qIndex, choice, e.target.checked)}
                          disabled={choice.trim() === ''}
                          className='mr-3'
                        />
                      </div>
                      <Input
                        placeholder={`Choice ${String.fromCharCode(65 + cIndex)}`}
                        value={choice}
                        onChange={(e) => updateChoice(qIndex, cIndex, e.target.value)}
                        className='flex-1 rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors'
                        status={choice.trim() === '' ? 'warning' : undefined}
                      />
                      {question.choices.length > 2 && (
                        <Button
                          type='text'
                          danger
                          size='small'
                          icon={<MinusCircleOutlined />}
                          onClick={() => removeChoice(qIndex, cIndex)}
                          className='hover:bg-red-50 rounded-lg'
                        />
                      )}
                    </div>
                  ))}
                </div>
                {question.correct_answer.length === 0 && question.question_text && (
                  <Text type='danger' className='text-sm block mt-2'>
                    ⚠️ Please select at least one correct answer
                  </Text>
                )}
              </div>
            </div>
          </Card>
        ))}
        {/* Nút Add Question ở cuối danh sách */}
        <div className='flex justify-end mt-8'>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={handleAddQuestion}
            style={{
              background: 'linear-gradient(90deg, #4f8cff 0%, #6ee7b7 100%)',
              border: 'none',
              color: '#fff',
              fontWeight: 500,
              minWidth: 160,
              borderRadius: 8,
            }}
            className='hover:opacity-90 transition-all'
          >
            Add Question
          </Button>
        </div>
        <div ref={bottomRef} />
      </div>
      {/* Floating Action Button nếu nhiều câu hỏi */}
      {questions.length > 3 && (
        <Button
          type='primary'
          shape='circle'
          icon={<PlusOutlined />}
          size='large'
          onClick={handleAddQuestion}
          style={{
            position: 'fixed',
            bottom: 40,
            right: 40,
            zIndex: 1000,
            background: 'linear-gradient(90deg, #4f8cff 0%, #6ee7b7 100%)',
            border: 'none',
            boxShadow: '0 2px 8px rgba(79,140,255,0.18)',
          }}
        />
      )}
    </div>
  );
};

export default QuestionEditor;
