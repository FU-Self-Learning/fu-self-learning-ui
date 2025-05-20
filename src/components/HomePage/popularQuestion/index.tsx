"use client";
import React, { useState } from "react";
import { Collapse, Input, Button } from "antd";
import type { CollapseProps } from "antd";
import { motion } from "framer-motion";

const items: CollapseProps['items'] = [
    {
        key: '1',
        label: 'How do I create a new flashcard?',
        children: (
            <p className="pl-6 text-gray-700 leading-relaxed">
                Simply go to the &quot;Study Bank&quot;, select &quot;Create Flashcard&quot;, and fill in the required information. You can then save and share it with your friends.
            </p>
        ),
    },
    {
        key: '2',
        label: 'Can I study offline?',
        children: (
            <p className="pl-6 text-gray-700 leading-relaxed">
                With an advanced account, you can download study materials and access them without an internet connection.
            </p>
        ),
    },
    {
        key: '3',
        label: 'How can I compete with friends?',
        children: (
            <p className="pl-6 text-gray-700 leading-relaxed">
                Go to the &quot;Group Challenge&quot; section, create a study room, and invite your friends via a link. The scoreboard will update in real time.
            </p>
        ),
    },
    {
        key: '4',
        label: 'How do I upgrade my account?',
        children: (
            <p className="pl-6 text-gray-700 leading-relaxed">
                Click on &quot;Account&quot; in the top right corner, select &quot;Upgrade&quot;, and follow the instructions to complete the payment.
            </p>
        ),
    },
    {
        key: '5',
        label: 'Is my personal data secure?',
        children: (
            <p className="pl-6 text-gray-700 leading-relaxed">
                Yes. We are committed to protecting your information using encryption methods and by complying with data protection regulations.
            </p>
        ),
    },
];


export default function PopularQuestion() {
    const [email, setEmail] = useState("");
    const [question, setQuestion] = useState("");

    const handleSubmit = () => {
        if (!email || !question) {
            alert("Please enter full email and question.");
            return;
        }

        console.log("Email:", email);
        console.log("Câu hỏi:", question);
        setEmail("");
        setQuestion("");
        alert("Your question has been submitted. Thanks!");
    };

    return (
        // bg-[#4682B4]
        <div className="w-full bg-[#4682B4]">
            <div className="w-full -scale-y-100  h-[6px]">
                <div className="">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 800 80"
                        className="w-full mb3"
                        style={{
                            filter: "drop-shadow( 0px 3px rgba(0, 0, 0, 0.4))",
                        }}
                    >
                        <path
                            fill="#4682B4"
                            fillOpacity="1"
                            transform="scale(1, -1) translate(0, -47)"
                            d="M0,40 
     Q10,42 20,41 
     Q30,39 40,40 
     Q50,42 60,41 
     Q70,39 80,40 
     Q90,41 100,40 
     Q110,42 120,40 
     Q130,39 140,41 
     Q150,42 160,40 
     Q170,41 180,40 
     Q190,39 200,40 
     Q210,42 220,40 
     Q230,41 240,39 
     Q250,40 260,41 
     Q270,42 280,40 
     Q290,39 300,41 
     Q310,42 320,40 
     Q330,41 340,39 
     Q350,40 360,41 
     Q370,42 380,40 
     Q390,39 400,41 
     Q410,42 420,40 
     Q430,41 440,39 
     Q450,40 460,41 
     Q470,42 480,40 
     Q490,39 500,41 
     Q510,42 520,40 
     Q530,41 540,39 
     Q550,40 560,41 
     Q570,42 580,40 
     Q590,39 600,41 
     Q610,42 620,40 
     Q630,41 640,39 
     Q650,40 660,41 
     Q670,42 680,40 
     Q690,39 700,41 
     Q710,42 720,40 
     Q730,41 740,39 
     Q750,40 760,41 
     Q770,42 780,40 
     Q790,39 800,41 
     V80 H0 Z"
                        />
                    </svg>
                </div>
            </div>
            <motion.div
                className="max-w-[1000px] mx-auto my-10 "
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <motion.div className="text-[50px] font-bold text-center mb-6 text-black">Frequently Asked Questions</motion.div>
                <div className="bg-white shadow-xl rounded-2xl p-6 grid md:grid-cols-2 gap-8 items-start border-t-[2px] border-l-[2px] border-r-[4px] border-b-[4px] border-solid  border-black">
                    <div>
                        <Collapse
                            items={items}
                            bordered={false}
                            defaultActiveKey={['1']}
                            className="faq-collapse [&_.ant-collapse-item]:border-none [&_.ant-collapse-header]:text-base [&_.ant-collapse-content-box]:pb-4"
                            expandIconPosition="start"
                        />
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-black">Still have questions?</h3>
                        <p className="text-gray-600 text-sm mb-4">Please email us your questions.</p>
                        <div className="flex flex-col  gap-2">
                            <Input
                                type="email"
                                placeholder="Example: quandba154@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="rounded-md"
                            />
                            <Input.TextArea
                                rows={4}
                                placeholder="Enter your question"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                className="rounded-md"
                            />
                            <Button
                                type="primary"
                                onClick={handleSubmit}
                                className="w-20 rounded-md bg-orange-500 hover:bg-orange-600 "
                            >
                                Send
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
            <div className="w-full h-[6px]">
                <div className="">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 800 80"
                        className="w-full mb3"
                        style={{
                            filter: "drop-shadow( 0px 3px rgba(0, 0, 0, 0.4))",
                        }}
                    >
                        <path
                            fill="#4682B4"
                            fillOpacity="1"
                            transform="scale(1, -1) translate(0, -47)"
                            d="M0,40 
     Q10,42 20,41 
     Q30,39 40,40 
     Q50,42 60,41 
     Q70,39 80,40 
     Q90,41 100,40 
     Q110,42 120,40 
     Q130,39 140,41 
     Q150,42 160,40 
     Q170,41 180,40 
     Q190,39 200,40 
     Q210,42 220,40 
     Q230,41 240,39 
     Q250,40 260,41 
     Q270,42 280,40 
     Q290,39 300,41 
     Q310,42 320,40 
     Q330,41 340,39 
     Q350,40 360,41 
     Q370,42 380,40 
     Q390,39 400,41 
     Q410,42 420,40 
     Q430,41 440,39 
     Q450,40 460,41 
     Q470,42 480,40 
     Q490,39 500,41 
     Q510,42 520,40 
     Q530,41 540,39 
     Q550,40 560,41 
     Q570,42 580,40 
     Q590,39 600,41 
     Q610,42 620,40 
     Q630,41 640,39 
     Q650,40 660,41 
     Q670,42 680,40 
     Q690,39 700,41 
     Q710,42 720,40 
     Q730,41 740,39 
     Q750,40 760,41 
     Q770,42 780,40 
     Q790,39 800,41 
     V80 H0 Z"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};


