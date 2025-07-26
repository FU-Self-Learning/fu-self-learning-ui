import { useState } from 'react';
import { Card, Button, Typography, Spin, Alert, Divider, Row, Col } from 'antd';
import {
  RobotOutlined,
  BulbOutlined,
  TrophyOutlined,
  BookOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import { useAnswerExplanation } from '@/hooks/test/useAnswerExplanation';
import { TestResultDetail } from '@/types/testType';

const { Title, Text, Paragraph } = Typography;

interface TestAIAnalysisProps {
  resultDetail: TestResultDetail;
}

const TestAIAnalysis = ({ resultDetail }: TestAIAnalysisProps) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);

  const explanationMutation = useAnswerExplanation();

  const handleGetAnalysis = async () => {
    if (hasRequested) return;

    setHasRequested(true);
    setIsLoading(true);

    try {
      // Create comprehensive prompt for the entire test
      const wrongAnswers = resultDetail.answers.filter((answer) => !answer.isCorrect);
      const correctAnswers = resultDetail.answers.filter((answer) => answer.isCorrect);

      const prompt = `
You are an AI teacher specializing in analyzing test results. Please analyze the following test and provide a comprehensive assessment:

**Test Information:**
- Total Questions: ${resultDetail.totalQuestions}
- Correct Answers: ${correctAnswers.length}
- Wrong Answers: ${wrongAnswers.length}
- Score: ${resultDetail.score}%
- Result: ${resultDetail.isPassed ? 'PASSED' : 'FAILED'}

**Wrong Questions:**
${wrongAnswers
  .map(
    (answer, index) => `
${index + 1}. ${answer.questionText}
   - Correct Answer: ${answer.correctAnswer.join(', ')}
   - Selected Answer: ${answer.selectedAnswers.join(', ')}
`,
  )
  .join('\n')}

**Correct Questions:**
${correctAnswers
  .map(
    (answer, index) => `
${index + 1}. ${answer.questionText}
   - Correct Answer: ${answer.correctAnswer.join(', ')}
   - Selected Answer: ${answer.selectedAnswers.join(', ')}
`,
  )
  .join('\n')}

Please return JSON with the following structure:
{
  "overallAssessment": "Overall assessment of the test result",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": ["Weakness 1", "Weakness 2", "Weakness 3"],
  "commonMistakes": "Analysis of common mistakes",
  "improvementSuggestions": ["Improvement suggestion 1", "Improvement suggestion 2", "Improvement suggestion 3"],
  "studyRecommendations": "Specific study recommendations",
  "nextSteps": "Next steps to take"
}

Return only JSON, no additional text.
`;

      // Use mutation to call API
      const result = await explanationMutation.mutateAsync({
        questionText: 'Comprehensive test analysis',
        choices: ['A', 'B', 'C', 'D'],
        correctAnswers: ['A'],
        selectedAnswers: ['A'],
        isCorrect: true,
        topicContext: prompt,
      });

      // Parse result from response
      try {
        const analysisData = JSON.parse(result.explanation);
        setAnalysis(analysisData);
      } catch (parseError) {
        console.log(parseError);
        // Fallback if JSON cannot be parsed
        setAnalysis({
          overallAssessment: result.explanation,
          strengths: ['Basic understanding of the topic'],
          weaknesses: ['Need to improve some aspects'],
          commonMistakes: result.whyCorrect,
          improvementSuggestions: ['Review the material', 'Practice more exercises'],
          studyRecommendations: result.learningTip,
          nextSteps: 'Continue learning and practicing',
        });
      }
    } catch (error) {
      console.error('Failed to get analysis:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      title={
        <div className='flex items-center gap-2'>
          <RobotOutlined className='text-blue-500' />
          <span>AI Comprehensive Analysis</span>
        </div>
      }
      className='shadow-lg border-blue-200 mb-6'
    >
      {!hasRequested && (
        <div className='text-center py-8'>
          <RobotOutlined className='text-4xl text-blue-500 mb-4' />
          <Title level={4}>Would you like AI to analyze the entire test?</Title>
          <Text type='secondary' className='block mb-4'>
            AI will analyze the results, provide strengths/weaknesses assessment and improvement
            suggestions.
          </Text>
          <Button
            type='primary'
            size='large'
            icon={<RobotOutlined />}
            onClick={handleGetAnalysis}
            loading={isLoading}
          >
            Get AI Analysis
          </Button>
        </div>
      )}

      {isLoading && (
        <div className='text-center py-8'>
          <Spin size='large' />
          <div className='mt-4'>
            <Text>AI is analyzing the test...</Text>
          </div>
        </div>
      )}

      {explanationMutation.isError && (
        <Alert
          message='Error generating analysis'
          description='Unable to generate AI analysis at this time. Please try again later.'
          type='error'
          showIcon
        />
      )}

      {analysis && (
        <div className='space-y-6'>
          <Divider>Analysis Results</Divider>

          {/* Overall Assessment */}
          <Card title='Overall Assessment' className='border-blue-200'>
            <Paragraph className='text-gray-700 leading-relaxed text-lg'>
              {analysis.overallAssessment}
            </Paragraph>
          </Card>

          <Row gutter={16}>
            {/* Strengths */}
            <Col span={12}>
              <Card
                title={
                  <div className='flex items-center gap-2 text-green-600'>
                    <TrophyOutlined />
                    <span>Strengths</span>
                  </div>
                }
                className='border-green-200'
              >
                <ul className='space-y-2'>
                  {analysis.strengths?.map((strength: string, index: number) => (
                    <li key={index} className='flex items-start gap-2'>
                      <span className='text-green-500 mt-1'>•</span>
                      <Text>{strength}</Text>
                    </li>
                  ))}
                </ul>
              </Card>
            </Col>

            {/* Weaknesses */}
            <Col span={12}>
              <Card
                title={
                  <div className='flex items-center gap-2 text-red-600'>
                    <BookOutlined />
                    <span>Weaknesses</span>
                  </div>
                }
                className='border-red-200'
              >
                <ul className='space-y-2'>
                  {analysis.weaknesses?.map((weakness: string, index: number) => (
                    <li key={index} className='flex items-start gap-2'>
                      <span className='text-red-500 mt-1'>•</span>
                      <Text>{weakness}</Text>
                    </li>
                  ))}
                </ul>
              </Card>
            </Col>
          </Row>

          {/* Common Mistakes */}
          <Card title='Common Mistakes Analysis' className='border-orange-200'>
            <Paragraph className='text-gray-700 leading-relaxed'>
              {analysis.commonMistakes}
            </Paragraph>
          </Card>

          {/* Improvement Suggestions */}
          <Card
            title={
              <div className='flex items-center gap-2 text-purple-600'>
                <RiseOutlined />
                <span>Improvement Suggestions</span>
              </div>
            }
            className='border-purple-200'
          >
            <ul className='space-y-2'>
              {analysis.improvementSuggestions?.map((suggestion: string, index: number) => (
                <li key={index} className='flex items-start gap-2'>
                  <span className='text-purple-500 mt-1'>•</span>
                  <Text>{suggestion}</Text>
                </li>
              ))}
            </ul>
          </Card>

          {/* Study Recommendations */}
          <Card
            title={
              <div className='flex items-center gap-2 text-yellow-600'>
                <BulbOutlined />
                <span>Study Recommendations</span>
              </div>
            }
            className='border-yellow-200 bg-yellow-50'
          >
            <Paragraph className='text-gray-700 leading-relaxed'>
              {analysis.studyRecommendations}
            </Paragraph>
          </Card>

          {/* Next Steps */}
          <Card title='Next Steps' className='border-green-200 bg-green-50'>
            <Paragraph className='text-gray-700 leading-relaxed'>{analysis.nextSteps}</Paragraph>
          </Card>
        </div>
      )}
    </Card>
  );
};

export default TestAIAnalysis;
