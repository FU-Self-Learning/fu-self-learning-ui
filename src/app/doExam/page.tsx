"use client"

import React, { useState } from 'react';
import { Button, Radio, Checkbox, Card, Divider, Typography, Alert } from 'antd';
import { StarFilled, StarOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import SidebarDoExam from './SidebarDoExam';
import { motion } from "framer-motion";

const { Title, Text } = Typography;

const questions = [
  {
    id: 1,
    type: 'single',
    question: 'Question 1: What is your last name?',
    options: [
      { label: 'A', text: 'NGUYÊN' },
      { label: 'B', text: 'LÊ' },
      { label: 'C', text: 'TRẦN' },
      { label: 'D', text: 'PHẠM' },
    ],
    answer: 'A',
  },
  {
    id: 2,
    type: 'multiple',
    question: 'Question 2: Which of the following are fruits?',
    options: [
      { label: 'A', text: 'Apple' },
      { label: 'B', text: 'Carrot' },
      { label: 'C', text: 'Banana' },
      { label: 'D', text: 'Potato' },
    ],
    answer: ['A', 'C'],
  },
  {
    id: 3,
    type: 'multiple',
    question: 'Question 3: Which of these are colors?',
    options: [
      { label: 'A', text: 'Red' },
      { label: 'B', text: 'Blue' },
      { label: 'C', text: 'Chair' },
      { label: 'D', text: 'Green' },
    ],
    answer: ['A', 'B', 'D'],
  },
  {
    id: 4,
    type: 'single',
    question: 'Question 4: What is 2 + 2?',
    options: [
      { label: 'A', text: '3' },
      { label: 'B', text: '4' },
      { label: 'C', text: '5' },
      { label: 'D', text: '22' },
    ],
    answer: 'B',
  },
  {
    id: 5,
    type: 'single',
    question: 'Question 5: Which language is used in web development?',
    options: [
      { label: 'A', text: 'Python' },
      { label: 'B', text: 'JavaScript' },
      { label: 'C', text: 'C++' },
      { label: 'D', text: 'Java' },
    ],
    answer: 'B',
  },
  {
    id: 6,
    type: 'single',
    question: 'Question 6: What color is the sky on a clear day?',
    options: [
      { label: 'A', text: 'Red' },
      { label: 'B', text: 'Blue' },
      { label: 'C', text: 'Green' },
      { label: 'D', text: 'Yellow' },
    ],
    answer: 'B',
  },
  {
    id: 7,
    type: 'multiple',
    question: 'Question 7: Which are programming languages?',
    options: [
      { label: 'A', text: 'HTML' },
      { label: 'B', text: 'JavaScript' },
      { label: 'C', text: 'CSS' },
      { label: 'D', text: 'Python' },
    ],
    answer: ['B', 'D'],
  },
  {
    id: 8,
    type: 'multiple',
    question: 'Question 8: Which are animals?',
    options: [
      { label: 'A', text: 'Dog' },
      { label: 'B', text: 'Car' },
      { label: 'C', text: 'Cat' },
      { label: 'D', text: 'Chair' },
    ],
    answer: ['A', 'C'],
  },
  {
    id: 9,
    type: 'single',
    question: 'Question 9: What is the capital of France?',
    options: [
      { label: 'A', text: 'London' },
      { label: 'B', text: 'Berlin' },
      { label: 'C', text: 'Paris' },
      { label: 'D', text: 'Rome' },
    ],
    answer: 'C',
  },
  {
    id: 10,
    type: 'single',
    question: 'Question 10: Which planet is known as the Red Planet?',
    options: [
      { label: 'A', text: 'Earth' },
      { label: 'B', text: 'Mars' },
      { label: 'C', text: 'Jupiter' },
      { label: 'D', text: 'Venus' },
    ],
    answer: 'B',
  },
  {
    id: 11,
    type: 'multiple',
    question: 'Question 11: Which of the following are vegetables?',
    options: [
      { label: 'A', text: 'Carrot' },
      { label: 'B', text: 'Apple' },
      { label: 'C', text: 'Spinach' },
      { label: 'D', text: 'Mango' },
    ],
    answer: ['A', 'C'],
  },
  {
    id: 12,
    type: 'multiple',
    question: 'Question 12: Select the continents.',
    options: [
      { label: 'A', text: 'Asia' },
      { label: 'B', text: 'Pacific' },
      { label: 'C', text: 'Africa' },
      { label: 'D', text: 'Europe' },
    ],
    answer: ['A', 'C', 'D'],
  },
  {
    id: 13,
    type: 'single',
    question: 'Question 13: What is the boiling point of water?',
    options: [
      { label: 'A', text: '50°C' },
      { label: 'B', text: '100°C' },
      { label: 'C', text: '150°C' },
      { label: 'D', text: '200°C' },
    ],
    answer: 'B',
  },
  {
    id: 14,
    type: 'single',
    question: 'Question 14: What is the capital of Japan?',
    options: [
      { label: 'A', text: 'Kyoto' },
      { label: 'B', text: 'Osaka' },
      { label: 'C', text: 'Tokyo' },
      { label: 'D', text: 'Hiroshima' },
    ],
    answer: 'C',
  },
  {
    id: 15,
    type: 'multiple',
    question: 'Question 15: Which are mammals?',
    options: [
      { label: 'A', text: 'Whale' },
      { label: 'B', text: 'Shark' },
      { label: 'C', text: 'Elephant' },
      { label: 'D', text: 'Lizard' },
    ],
    answer: ['A', 'C'],
  },
];

const QUESTIONS_PER_PAGE = 2;

const DoExam = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [markedQuestions, setMarkedQuestions] = useState<number[]>([]);

  const totalQuestions = questions.length;
  const percentComplete = Math.round((Object.keys(answers).length / totalQuestions) * 100);

  const handleSingleChange = (questionId: number, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleMultipleChange = (questionId: number, values: string[]) => {
    setAnswers({ ...answers, [questionId]: values });
  };

  const handleRemind = (questionId: number) => {
    setMarkedQuestions(prev => {
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId);
      }
      return [...prev, questionId];
    });
  };

  const currentQuestions = questions.slice(
    pageIndex * QUESTIONS_PER_PAGE,
    (pageIndex + 1) * QUESTIONS_PER_PAGE
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarDoExam
        percentComplete={percentComplete}
        setPageIndex={setPageIndex}
        QUESTIONS_PER_PAGE={QUESTIONS_PER_PAGE}
        pageIndex={pageIndex}
        answers={answers}
        questions={questions}
        markedQuestions={markedQuestions}
      />

      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Alert
              message={
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <ClockCircleOutlined className="text-xl" />
                    <Text strong>Time Remaining: 15:00</Text>
                  </div>
                  <div className="flex items-center gap-4">
                    <CheckCircleOutlined className="text-xl" />
                    <Text strong>Progress: {percentComplete}%</Text>
                  </div>
                </div>
              }
              type="info"
              showIcon={false}
              className="!bg-blue-50 !border-blue-200"
            />
          </div>

          <div className="flex flex-col gap-6">
            {currentQuestions.map((question) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className={`shadow-md hover:shadow-lg transition-shadow duration-300
                    ${markedQuestions.includes(question.id) ? 'border-yellow-400 bg-yellow-50' : ''}`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <Title level={4} className="!mb-2">
                        Question {question.id}
                      </Title>
                      <Text className="text-lg">{question.question}</Text>
                    </div>
                    <Button
                      type="text"
                      icon={markedQuestions.includes(question.id) ?
                        <StarFilled className="text-yellow-500" /> :
                        <StarOutlined className="text-gray-400" />
                      }
                      onClick={() => handleRemind(question.id)}
                      className={`!p-2 hover:!bg-yellow-50 !rounded-full transition-colors
                        ${markedQuestions.includes(question.id) ? '!text-yellow-500' : '!text-gray-400'}`}
                    />
                  </div>

                  <Divider className="!my-4" />

                  {question.type === 'single' ? (
                    <Radio.Group
                      onChange={(e) => handleSingleChange(question.id, e.target.value)}
                      value={answers[question.id]}
                      className="flex flex-col gap-3"
                    >
                      {question.options.map((opt) => (
                        <div
                          key={opt.label}
                          onClick={() => handleSingleChange(question.id, opt.label)}
                          className="w-full p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <Radio value={opt.label}>
                            <span className="font-medium text-blue-600">{opt.label}:</span> {opt.text}
                          </Radio>
                        </div>
                      ))}
                    </Radio.Group>
                  ) : (
                    <Checkbox.Group
                      onChange={(checkedValues) => handleMultipleChange(question.id, checkedValues)}
                      value={answers[question.id] || []}
                      className="flex flex-col gap-3"
                    >
                      {question.options.map((opt) => (
                        <label
                          key={opt.label}
                          className="w-full p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                          <Checkbox value={opt.label} />
                          <span className="font-medium text-blue-600">{opt.label}:</span> {opt.text}
                        </label>
                      ))}
                    </Checkbox.Group>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex justify-between">
            <Button
              size="large"
              onClick={() => setPageIndex(prev => Math.max(0, prev - 1))}
              disabled={pageIndex === 0}
            >
              Previous
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={() => setPageIndex(prev => Math.min(Math.ceil(totalQuestions / QUESTIONS_PER_PAGE) - 1, prev + 1))}
              disabled={pageIndex === Math.ceil(totalQuestions / QUESTIONS_PER_PAGE) - 1}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoExam;
