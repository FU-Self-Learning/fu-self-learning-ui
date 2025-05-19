import React from "react";
import { Badge } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";

type PostProps = {
    imageUrl: string;
    title: string;
    edition: string;
    isbn: string;
    publisher: string;
    solutionCount: number;
};

const PostPage: React.FC<PostProps> = ({
    imageUrl,
    title,
    edition,
    isbn,
    publisher,
    solutionCount,
}) => {
    return (
        <div className="flex gap-4 bg-[#1B1E32] text-white p-4 rounded-xl w-full max-w-md shadow-md">
            <img
                src={imageUrl}
                alt={title}
                className="w-24 h-32 object-cover rounded-lg"
            />
            <div className="flex flex-col justify-between flex-1">
                <div>
                    <h2 className="text-base font-semibold leading-tight">{title}</h2>
                    <div className="text-sm text-gray-400">
                        {edition} · ISBN: {isbn}
                    </div>
                    <div className="text-sm mt-1">{publisher}</div>
                </div>
                <div>
                    <Badge
                        count={`${solutionCount.toLocaleString()} `}
                        showZero
                        style={{ backgroundColor: "#1e40af" }}
                        icon={<CheckCircleFilled style={{ color: "white" }} />}
                    />
                </div>
            </div>
        </div>
    );
};

export default PostPage;
