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


const PopularQuestion: React.FC = () => {
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
        <motion.div
            className="max-w-[1000px] mx-auto my-10"
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
    );
};

export default PopularQuestion;
