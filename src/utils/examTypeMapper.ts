export const examTypeLabels: Record<string, string> = {
  practice: 'Practice Test',
  midterm: 'Midterm Exam',
  final: 'Final Exam',
  quiz: 'Quiz',
  topic_exam: 'Topic Exam',
  final_exam: 'Final Exam',
};

export const getExamTypeLabel = (type: string): string => {
  return examTypeLabels[type] || type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ');
};

export const getExamTypeColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    practice: 'blue',
    midterm: 'orange',
    final: 'red',
    quiz: 'green',
    topic_exam: 'purple',
    final_exam: 'red',
  };

  return colorMap[type] || 'default';
};
