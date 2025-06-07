import Image from "next/image";
import LoginBanner from "@p/images/Login.png";
import { Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { slogansConstants } from "@/shared/constants/slogansConstants";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const BannerPublic = () => {
    const router = useRouter();
    const [index, setIndex] = useState<number>(0);

    return (
        <div className="relative lg:w-1/2 h-[640px] w-[500px] m-2 rounded-3xl">
            <Image
                src={LoginBanner}
                alt="Login Banner"
                fill
                className="object-cover rounded-4xl"
            />
            <div className="absolute inset-0 w-1/2 hidden lg:flex items-center">
                <div className="z-10 p-12 text-white h-full">
                    <div className="flex flex-col justify-between h-full">
                        <h1 className="text-[22px] lg:text-[45px] font-bold tracking-wide leading-tight">
                            Dive into Knowledge, Emerge into Success.
                        </h1>
                        <Button
                            className="text-[23px] font-extrabold max-w-[180px] text-gradient bg-gradient-to-r !bg-blue-600 px-2 !py-5 rounded-lg shadow-md text-center cursor-pointer"
                            type="primary"
                            onClick={() => router.push("/")}
                        >
                            Get Started
                        </Button>
                        <div className="mt-4 w-[420px] h-[220px] p-6 rounded-2xl shadow-xl backdrop-blur-md bg-white/20 border border-white/30 text-white text-lg flex items-center justify-between transition-all duration-300">
                            <button
                                onClick={() =>
                                    setIndex((prevIndex) =>
                                        prevIndex === 0
                                            ? slogansConstants.length - 1
                                            : prevIndex - 1
                                    )
                                }
                                className="w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-sm bg-white/25 border border-white/40 hover:bg-white/40 hover:scale-110 cursor-pointer transition-all duration-300"
                            >
                                <LeftOutlined className="text-xl" />
                            </button>

                            <div className="flex-1 text-center px-6 font-semibold text-xl leading-relaxed">
                                <motion.div
                                    key="login"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {slogansConstants[index]}
                                </motion.div>
                            </div>

                            <button
                                onClick={() =>
                                    setIndex((prevIndex) =>
                                        prevIndex === slogansConstants.length - 1
                                            ? 0
                                            : prevIndex + 1
                                    )
                                }
                                className="w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-sm bg-white/25 border border-white/40 hover:bg-white/40 hover:scale-110 cursor-pointer transition-all duration-300"
                            >
                                <RightOutlined className="text-xl" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};