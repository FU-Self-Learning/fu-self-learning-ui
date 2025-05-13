"use client";

import { LoginForm } from "@/components/login/LoginForm";
import { Typography, Button, Divider } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import Image from "next/image";
import LoginBanner from "@p/images/Login.png"
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  return (
    <div className="min-h-[85vh] bg-[url('/login-bg.jpg')] flex bg-cover bg-center" >
      <div className="relative w-1/2 h-screen ">
        <Image
          src={LoginBanner}
          alt="amt"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 w-1/2 hidden lg:flex items-center ">
          <div className="z-10 p-12 text-white h-full">
            <div className="flex flex-col justify-between h-full">
              <h1 className="text-[50px]">
                Học hiệu quả mà thật thoải mái.
              </h1>
              <h1 className="text-4xl font-bold">
                SoundClient
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md px-8 py-4">
          <Typography.Title level={3} className="text-center">
            Welcome Back
          </Typography.Title>
          <Typography.Text className="block text-center mb-6 text-gray-500">
            Let's explore this exciting platform together!
          </Typography.Text>

          <Button icon={<GoogleOutlined />} block>
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
              <LoginForm />
            </motion.div>
          </AnimatePresence>
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Button
              type="link"
              className="!text-blue-500"
              onClick={() => router.push("/register")}
            >
              Sign Up
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
    </div >
  );
}