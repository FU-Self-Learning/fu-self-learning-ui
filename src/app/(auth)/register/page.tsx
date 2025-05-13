"use client";

import { LoginForm } from "@/components/login/LoginForm";
import { RegisterForm } from "@/components/register/RegisterForm";
import { Typography, Button, Divider } from "antd";
import { useState } from "react";
import Image from "next/image";
import LoginBanner from "@p/images/Login.png"
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { slogansConstants } from "@/shared/constants/slogansConstants";
import GoogleIcon from "@p/svgs/google.svg"
import LogoIcon from "@p/svgs/logo.svg"
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";


export default function LoginPage() {
  const [index, setIndex] = useState<number>(0);
  const router = useRouter();
  const [isLoginFormVisible] = useState<boolean>(true);

  return (
    <div className="flex justify-center h-[660px] min-h-[85vh] bg-gray-200 bg-cover bg-center">
      <div className="flex justify-center bg-white items-center py-2 px-2 h-[670px] w-[1100px] my-auto mx-auto rounded-3xl">
        <div className="relative  lg:w-1/2 h-[640px] w-[500px] m-2 rounded-3xl">
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
                <h1 className="text-[23px] font-extrabold max-w-[180px] text-gradient bg-gradient-to-r bg-blue-600 p-2 rounded-lg shadow-md text-center">
                  Self-Learning
                </h1>
                <div className="mt-4 w-[420px] h-[220px] p-6 rounded-2xl shadow-xl backdrop-blur-md bg-white/20 border border-white/30 text-white text-lg flex items-center justify-between transition-all duration-300">
                  <button
                    onClick={() => setIndex((prevIndex) => (prevIndex === 0 ? slogansConstants.length - 1 : prevIndex - 1))}
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
                    onClick={() => setIndex((prevIndex) => (prevIndex === slogansConstants.length - 1 ? 0 : prevIndex + 1))}
                    className="w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-sm bg-white/25 border border-white/40 hover:bg-white/40 hover:scale-110 cursor-pointer transition-all duration-300"
                  >
                    <RightOutlined className="text-xl" />
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex items-center flex-col  justify-center p-6">
          <div className="w-full flex justify-end mr-10 mb-2">
            <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white shadow-[0_8px_16px_rgba(163,163,163,0.6)]">
              <Image src={LogoIcon} alt="Google Icon" width={30} height={50} />
              <h2 className="text-[20px] font-semibold text-sky-600 tracking-wide">
                SL
              </h2>
            </div>
          </div>
          <div className="w-full max-w-md bg-white p-8 rounded-3xl">
            <Typography.Title level={3} className="text-center mb-1">
              Connect to Platform
            </Typography.Title>
            <Button
              icon={<Image src={GoogleIcon} alt="Google Icon" width={20} height={20} />}
              block
              className="!rounded-3xl !w-full"
              style={{
                padding: '18px 30px',
                border: '2px solid #DCDCDC',
              }}
            >
              Using Google account
            </Button>
            <Divider>OR</Divider>
            <AnimatePresence mode="wait">
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {!isLoginFormVisible ? <LoginForm /> : <RegisterForm />}
              </motion.div>
            </AnimatePresence>
            <div className="text-center text-sm text-gray-400">
              Already have an account?
              <Button
                type="link"
                className="!text-blue-500 hover:underline hover:decoration-blue-500 !p-1"
                onClick={() => router.push("/login")}
              >
                Sign In
              </Button>
            </div>
            <div className="text-center text-xs text-gray-400 mt-2">
              By signing in, you agree to our{" "}
              <a className="underline" href="#">
                Terms & Privacy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}