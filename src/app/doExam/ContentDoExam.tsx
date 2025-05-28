import { Progress, Radio, Checkbox, Card, Divider } from 'antd';
import { StarFilled } from '@ant-design/icons';
import { motion } from 'framer-motion';

type QuestionType = 'single' | 'multiple';

interface QuestionOption {
    label: string;
    text: string;
}

interface Question {
    id: number;
    type: QuestionType;
    question: string;
    options: QuestionOption[];
    answer: string | string[];
}

interface TContentDoExam {
    percentComplete?: number;
    answers?: Record<number, string | string[]>;
    setAnswers?: (answers: Record<number, string | string[]>) => void;
    currentQuestions: Question[];
}


const ContentDoExam = (props: TContentDoExam) => {
    const {
        percentComplete,
        currentQuestions,
        setAnswers = () => { },
        answers = {},
    } = props;

    // handle choose 1 option
    const handleSingleChange = (questionId: number, value: string) => {
        setAnswers({ ...answers, [questionId]: value });
    };

    // handle choose multiple options
    const handleMultipleChange = (questionId: number, values: string[]) => {
        setAnswers({ ...answers, [questionId]: values });
    };

    return (
        <>
            <Progress percent={percentComplete} className="mb-5" />
            <Divider />
            <div className="flex flex-col gap-5">
                {currentQuestions.map((question) => (
                    <Card key={question.id} className="shadow-sm">
                        <motion.div className="flex flex-row justify-between items-start cursor-pointer">
                            <h3 className="text-lg font-semibold mb-4">
                                {question.question}
                            </h3>
                            <StarFilled
                                style={{ color: 'yellow' }}
                                className="text-yellow-400 border-2 border-yellow-400 rounded-full p-1"
                            />
                        </motion.div>
                        {question.type === 'single' ? (
                            <Radio.Group
                                onChange={(e) =>
                                    handleSingleChange(question.id, e.target.value)
                                }
                                value={answers[question.id]}
                                className="flex flex-col gap-3"
                            >
                                {question.options.map((opt) => (
                                    <div
                                        key={opt.label}
                                        onClick={() =>
                                            handleSingleChange(question.id, opt.label)
                                        }
                                        className="w-full py-2 px-5 mb-2 border border-black rounded-[8px] cursor-pointer"
                                    >
                                        <Radio value={opt.label}>
                                            <span className="font-medium">{opt.label}:</span>{' '}
                                            {opt.text}
                                        </Radio>
                                    </div>
                                ))}
                            </Radio.Group>
                        ) : (
                            <Checkbox.Group
                                onChange={(checkedValues) =>
                                    handleMultipleChange(
                                        question.id,
                                        checkedValues as string[]
                                    )
                                }
                                value={answers[question.id] || []}
                                className="flex flex-col gap-3"
                            >
                                {question.options.map((opt) => (
                                    <label
                                        className="py-2 px-5 border-[1px] border-solid border-black rounded-[8px] cursor-pointer flex items-center gap-2"
                                        key={opt.label}
                                    >
                                        <Checkbox value={opt.label} />
                                        <span className="font-medium">{opt.label}:</span>{' '}
                                        {opt.text}
                                    </label>
                                ))}
                            </Checkbox.Group>
                        )}
                    </Card>
                ))}
            </div>
        </>
    );
};

export default ContentDoExam;
