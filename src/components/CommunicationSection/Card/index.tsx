"'use client'"

import Image from 'next/image';


type CardProps = {
    name: string;
    email: string;
    content: string;
    avt: string;
};

export default function Card({ name, email, content, avt }: CardProps) {
    return (
        <div className="flex flex-col bg-white rounded-xl p-4 h-full border-solid border-black border-l-[2px] border-t-[2px] border-b-[4px] border-r-[4px]">
            <div className="flex flex-row gap-3 items-center mb-4">
                <Image src={avt} alt="avatar" width={40} height={40} />
                <div className="text-black">
                    <h2 className="font-semibold">{name}</h2>
                    <p className="text-sm text-gray-500">{email}</p>
                </div>
            </div>
            <div className="w-full max-w-[500px] h-[80px]">
                <span className="text-black break-words">
                    {content}
                </span>
            </div>
        </div>
    );
}
