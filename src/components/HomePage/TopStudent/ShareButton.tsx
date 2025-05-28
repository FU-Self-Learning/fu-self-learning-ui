import React, { useState } from "react";
import {
    ShareAltOutlined,
    FacebookFilled,
    TwitterOutlined,
    LinkedinFilled,
} from "@ant-design/icons";

const ShareButton = () => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div
            className="absolute bottom-2 right-2 group"
            onMouseEnter={() => setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}
        >
            <div className="cursor-pointer bg-orange-600 p-2 rounded-full text-white text-xl border-[3px] border-white transition-transform hover:scale-105">
                <ShareAltOutlined />
            </div>
            {showMenu && (
                <div className="absolute -left-16 bottom-0 flex flex-col gap-2 bg-white rounded-xl p-2 shadow-xl transition-all duration-300 z-10">
                    <FacebookFilled className="text-blue-600 hover:scale-110 transition-transform cursor-pointer text-xl" />
                    <TwitterOutlined className="text-blue-400 hover:scale-110 transition-transform cursor-pointer text-xl" />
                    <LinkedinFilled className="text-blue-700 hover:scale-110 transition-transform cursor-pointer text-xl" />
                </div>
            )}
        </div>
    );
};

export default ShareButton;
