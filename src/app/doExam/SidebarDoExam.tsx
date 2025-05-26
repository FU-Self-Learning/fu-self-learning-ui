"use client";

import { Statistic, Button } from "antd";
import dayjs from "dayjs";


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
    remindQuestions?: Array<{
        id: number;
        type: 'single' | 'multiple';
        question: string;
        options: Array<{ label: string; text: string }>;
        answer: string | string[];
    }>;
}



export default function SidebarDoExam(props: TSidebarDoExam) {
    const { QUESTIONS_PER_PAGE = 2, percentComplete = 0, setPageIndex = () => { }, pageIndex = 0, answers = {}, questions } = props;
    console.log("remindQuestions", props.remindQuestions);


    const handleSummit = () => {
        if (percentComplete < 100) {
            alert("You must answer all questions before submitting.");
        }
        console.log("summit");
    }
    return (
        <div className="w-1/6 flex flex-col justify-between bg-[#D9D9D9] p-4 rounded-lg shadow ">
            <div>
                <div className="p-4 mt-4 bg-[#D9D9D9] rounded-xl">
                    <Statistic.Countdown
                        title="Time left"
                        value={dayjs().add(15, 'minute')}
                        onFinish={() => {
                            console.log("HET GIƠ NUII BAI DIIIII");
                        }}
                        format="mm:ss"
                    />
                </div>
                <h2 className="text-center text-2xl font-bold mb-4 text-blue-500">Index question</h2>
                <div className="grid grid-cols-4 gap-3 mb-4 ">
                    {questions && questions.map((q, idx) => {
                        const questionPage = Math.floor(idx / QUESTIONS_PER_PAGE);
                        const isCurrentPage = questionPage === pageIndex;

                        return (
                            <Button
                                key={q.id}
                                shape="circle"
                                type={
                                    Array.isArray(answers[q.id])
                                        ? answers[q.id].length > 0
                                            ? "primary"
                                            : "default"
                                        : answers[q.id]
                                            ? "primary"
                                            : "default"
                                }
                                className={
                                    isCurrentPage
                                        ? "bg-yellow-400 border-yellow-400 text-white hover:!bg-yellow-500 hover:!border-yellow-500"
                                        : answers[q.id]
                                            ? "bg-blue-500 border-blue-500 text-white hover:!bg-blue-600 hover:!border-blue-600"
                                            : ""
                                }
                                onClick={() => setPageIndex(questionPage)}
                            >
                                {q.id}
                            </Button>
                        );
                    })}

                </div>
            </div>
            <Button className='z-10 text-2xl font-bold text-white' type="primary" onClick={handleSummit}>Summit</Button>
        </div>
    )
}