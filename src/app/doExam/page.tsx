"use client"

import React, { useState } from 'react';
import { Progress, Button, Radio, Checkbox, Card, Divider } from 'antd';
import { StarFilled } from '@ant-design/icons';
import SidebarDoExam from './SidebarDoExam';
import { motion } from "framer-motion";


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
  // console.log('answers', answers);

  // remind start
  const [remindQuestions, setRemindQuestions] = useState(false);

  const totalQuestions = questions.length;
  const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE);

  const currentQuestions = questions.slice(pageIndex * QUESTIONS_PER_PAGE, (pageIndex + 1) * QUESTIONS_PER_PAGE);

  const percentComplete = Math.round((Object.keys(answers).length / totalQuestions) * 100);

  // handle choose 1 option
  const handleSingleChange = (questionId: number, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  // handle choose multiple options
  const handleMultipleChange = (questionId: number, values: string[]) => {
    setAnswers({ ...answers, [questionId]: values });
  };

  const handleRemind = () => {
    setRemindQuestions(!remindQuestions);
  };


  return (
    <div className="flex min-h-screen bg-white p-6">
      <SidebarDoExam percentComplete={percentComplete} setPageIndex={setPageIndex} QUESTIONS_PER_PAGE={QUESTIONS_PER_PAGE} pageIndex={pageIndex} answers={answers} questions={questions} />

      <div className="flex-1 px-10 bg-white z-100">
        <div className='bg-[#D9D9D9] p-6 rounded-md shadow-md flex flex-col '>
          <Progress percent={percentComplete} className="mb-5" />
          <Divider />
          <div className="flex flex-col gap-5">
            {currentQuestions.map((question) => (
              <Card key={question.id} className="shadow-sm">


                <motion.div className='flex flex-row justify-between items-start'>
                  <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
                  <StarFilled
                    onClick={handleRemind}
                    style={{ color: 'yellow' }}
                    className="text-yellow-400 border-2 border-yellow-400 rounded-full p-1"
                  />
                </motion.div>

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
                        className="w-full py-2 px-5 mb-2 border border-black rounded-[8px] cursor-pointer"
                      >
                        <Radio value={opt.label}>
                          <span className="font-medium">{opt.label}:</span> {opt.text}
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
                        className='py-2 px-5 border-[1px] border-solid border-black rounded-[8px] cursor-pointer flex items-center gap-2'
                        key={opt.label}
                      >
                        <Checkbox value={opt.label} />
                        <span className="font-medium">{opt.label}:</span> {opt.text}
                      </label>
                    ))}
                  </Checkbox.Group>

                )}

              </Card>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <Button
              className='z-10 !border-solid !border-black !border-t-[2px] !border-l-[2px] !border-b-[4px] !border-r-[4px]'
              disabled={pageIndex === 0}
              onClick={() => setPageIndex(pageIndex - 1)}
            >
              Prev Page
            </Button>
            <Button
              className='z-10 !border-solid !border-black !border-t-[2px] !border-l-[2px] !border-b-[4px] !border-r-[4px]'
              disabled={pageIndex === totalPages - 1}
              onClick={() => setPageIndex(pageIndex + 1)}
            >
              Next Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoExam;
