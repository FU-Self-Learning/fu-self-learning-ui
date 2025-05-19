

import Card from "./Card";


export const keys = [
    {
        value: "1",
        lable: "FlashCard",
    },
    {
        value: "2",
        lable: "Social Media",
    },
    {
        value: "3",
        lable: "Study Area",
    },
];
export default function ProductSection() {
    return (
        <div className="flex flex-col items-center bg-[#0A092D] w-full h-auto font-bold ">
            <h1 className="">Provide support tools</h1>
            <div className="flex gap-4">
                {keys.map((item, index: number) => (
                    <div className="px-2 py-1 border-2 border-solid border-black rounded-sm cursor-pointer" key={index}>{item.lable}</div>
                ))}
            </div>
            <Card />
        </div>
    );
}


//D4D6D9