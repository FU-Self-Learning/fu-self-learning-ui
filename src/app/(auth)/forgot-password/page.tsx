"use client";

import { Form, Button, message, Typography } from "antd";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForgotPassword } from "@/hooks/auth/useForgotPassword";
import { slogansConstants } from "@/shared/constants/slogansConstants";
import { motion, AnimatePresence } from "framer-motion";
import LoginBanner from "@p/images/Login.png";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useState } from "react";
import { ForgotPasswordForm } from "@/components/forgot-pass/ForgotPasswordForm";

const ForgotPassword = () => {
  const router = useRouter();
  const [index, setIndex] = useState<number>(0);
  const { mutate: forgotPassword, isPending } = useForgotPassword();
  const [form] = Form.useForm();

  const handleSubmit = (values: { email: string }) => {
    forgotPassword(values, {
      onSuccess: () => {
        router.push("/login");
      },
    });
  };

  return (
    <div className="flex justify-center min-h-[90vh]  bg-gray-200 bg-cover bg-center">
      <div className="flex justify-center bg-white items-center py-2 px-2 h-full w-[1100px] my-auto mx-auto rounded-3xl">
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
        <div className="h-full lg:w-1/2 flex flex-col items-center justify-center ">
          <div className="w-full max-w-md bg-white px-8 py-4 rounded-2xl">
            <Typography.Title
              level={3}
              className="block text-center mb-6 text-gray-500"
            >
              Forgot Password
            </Typography.Title>
            <AnimatePresence mode="wait">
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <ForgotPasswordForm
                  form={form}
                  handleSubmit={handleSubmit}
                  isPending={isPending}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
