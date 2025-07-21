import { useState } from 'react';
import { ExamQuestionFormData } from '@/types/examType';

export const useExamQuestions = (initialQuestions?: ExamQuestionFormData[]) => {
  const [questions, setQuestions] = useState<ExamQuestionFormData[]>(
    initialQuestions || [
      {
        question_text: '',
        correct_answer: [],
        choices: ['', ''],
        topicId: 0,
      },
    ],
  );

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: '',
        correct_answer: [],
        choices: ['', ''],
        topicId: 0,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
    }
  };

  const updateQuestion = (index: number, field: string | null, value: any) => {
    const newQuestions = [...questions];
    if (field === null) {
      newQuestions[index] = value;
    } else {
      newQuestions[index] = { ...newQuestions[index], [field]: value };
    }
    setQuestions(newQuestions);
  };

  const addChoice = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].choices.push('');
    setQuestions(newQuestions);
  };

  const removeChoice = (questionIndex: number, choiceIndex: number) => {
    if (questions[questionIndex].choices.length > 2) {
      const newQuestions = [...questions];
      const removedChoice = newQuestions[questionIndex].choices[choiceIndex];
      newQuestions[questionIndex].choices.splice(choiceIndex, 1);
      newQuestions[questionIndex].correct_answer = newQuestions[
        questionIndex
      ].correct_answer.filter((answer) => answer !== removedChoice);
      setQuestions(newQuestions);
    }
  };

  const updateChoice = (questionIndex: number, choiceIndex: number, value: string) => {
    const newQuestions = [...questions];
    const oldChoice = newQuestions[questionIndex].choices[choiceIndex];
    newQuestions[questionIndex].choices[choiceIndex] = value;
    // Update correct answers if this choice was selected
    if (newQuestions[questionIndex].correct_answer.includes(oldChoice)) {
      const correctAnswerIndex = newQuestions[questionIndex].correct_answer.indexOf(oldChoice);
      newQuestions[questionIndex].correct_answer[correctAnswerIndex] = value;
    }
    setQuestions(newQuestions);
  };

  const toggleCorrectAnswer = (questionIndex: number, choice: string, checked: boolean) => {
    const newQuestions = [...questions];
    if (checked) {
      if (!newQuestions[questionIndex].correct_answer.includes(choice)) {
        newQuestions[questionIndex].correct_answer.push(choice);
      }
    } else {
      newQuestions[questionIndex].correct_answer = newQuestions[
        questionIndex
      ].correct_answer.filter((answer) => answer !== choice);
    }
    setQuestions(newQuestions);
  };

  return {
    questions,
    setQuestions,
    addQuestion,
    removeQuestion,
    updateQuestion,
    addChoice,
    removeChoice,
    updateChoice,
    toggleCorrectAnswer,
  };
};
