import { Card, Row, Col, Statistic } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { TestResultDetail } from '@/types/testType';

interface TestAnswersSummaryProps {
  resultDetail: TestResultDetail;
}

const TestAnswersSummary = ({ resultDetail }: TestAnswersSummaryProps) => {
  const wrongAnswers = resultDetail.answers.filter((answer) => !answer.isCorrect);
  const correctAnswers = resultDetail.answers.filter((answer) => answer.isCorrect);

  return (
    <Card className='shadow-xl border-0 !mb-8'>
      <Row gutter={16}>
        <Col span={6}>
          <Statistic
            title='Total Questions'
            value={resultDetail.totalQuestions}
            prefix={<FileTextOutlined className='text-blue-500' />}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title='Correct Answers'
            value={correctAnswers.length}
            valueStyle={{ color: '#52c41a' }}
            prefix={<CheckCircleOutlined className='text-green-500' />}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title='Wrong Answers'
            value={wrongAnswers.length}
            valueStyle={{ color: '#ff4d4f' }}
            prefix={<CloseCircleOutlined className='text-red-500' />}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title='Score'
            value={resultDetail.score || 0}
            suffix='%'
            valueStyle={{ color: resultDetail.isPassed ? '#52c41a' : '#ff4d4f' }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default TestAnswersSummary;
