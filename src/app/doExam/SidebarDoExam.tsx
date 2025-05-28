"use client";

import { Statistic, Button } from "antd";
import dayjs from "dayjs";
import { message } from 'antd';



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
}



export default function SidebarDoExam(props: TSidebarDoExam) {
    const { QUESTIONS_PER_PAGE = 2, percentComplete = 0, setPageIndex = () => { }, pageIndex = 0, answers = {}, questions } = props;


    const handleSummit = () => {
        if (percentComplete < 100) {
            message.warning("You must answer all questions before submitting.");
            return;
        }
        console.log("summit");
    };
    return (
        <div className="w-1/6 flex flex-col text-center justify-between bg-[#D9D9D9] p-4 rounded-lg shadow ">
            <div>
                <div className=" p-4 mt-4 bg-[#D9D9D9] rounded-xl shadow-lg transition-transform duration-300 hover:scale-105 border-solid border-black border-l-2 border-t-2 border-r-4 border-b-4">
                    <Statistic.Countdown
                        title={<span className="text-3xl text-gray-700 font-bold">Time left</span>}
                        value={dayjs().add(15, 'minute')}
                        onFinish={() => {
                            console.log("HET GIƠ NUII BAI DIIIII");
                        }}
                        format="H:mm:ss"
                        valueStyle={{
                            fontWeight: 600,
                            fontSize: 30,
                            color: "#0A092D",
                        }}
                    />
                </div>
                <h2 className="text-center text-2xl font-bold mb-4 text-blue-500 animate-fade-in tracking-wide relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bottom-[-4px] after:left-1/2 after:bg-blue-400 after:transition-all after:duration-500 hover:after:w-full hover:after:left-0">
                    Index question
                </h2>

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
            <Button
                className="!text-sm !font-bold text-white tracking-wide uppercase shadow-sm hover:shadow-md transition-all duration-200 !border-solid border-black !border-t-2 border-l-2 !border-b-4 !border-r-4"
                type="primary"
                onClick={handleSummit}
            >
                Summit
            </Button>

        </div>
    )
}