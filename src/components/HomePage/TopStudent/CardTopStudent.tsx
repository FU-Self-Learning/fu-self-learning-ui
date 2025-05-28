import React from "react";
import { ShareAltOutlined } from "@ant-design/icons";

type Props = {
    name: string;
    role: string;
    image: string;
};

const CardTopStudent = ({ name, role, image }: Props) => {
    return (
        <div className="bg-gradient-to-t from-orange-400 to-yellow-300 rounded-lg overflow-hidden text-white shadow-lg hover:scale-105 transition-all">
            <div className="relative ">
                <img src={image} alt={name} className="w-full h-80 object-cover" />
                <div className="absolute cursor-pointer bottom-2 right-2 bg-orange-600 p-2 rounded-full text-white text-xl border-[3px] border-solid border-white">
                    <ShareAltOutlined />
                </div>
            </div>
            <div className="p-4 bg-orange-600">
                <h3 className="text-xl font-bold">{name}</h3>
                <p className="text-sm">{role}</p>
            </div>
        </div>
    );
};

export default CardTopStudent;
