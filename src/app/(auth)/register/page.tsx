"use client";

import { LoginForm } from "@/components/login/LoginForm";
import { RegisterForm } from "@/components/register/RegisterForm";
import { Typography, Button, Divider } from "antd";
import { useState } from "react";
import { GoogleOutlined } from "@ant-design/icons";
import Image from "next/image";
import LoginBanner from "@p/images/Login.png"

export default function LoginPage() {
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(true);
  return (
    <div className="min-h-[88vh] flex bg-[url('/login-bg.jpg')] bg-cover bg-center">
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
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
          <Typography.Title level={3} className="text-center mb-1">
            Welcome Back
          </Typography.Title>
          <Typography.Text className="block text-center mb-6 text-gray-500">
            Let’s explore this exciting platform together!
          </Typography.Text>

          <Button icon={<GoogleOutlined />} block>
            Using Google account
          </Button>
          <Divider>OR</Divider>
          {!isLoginFormVisible ? <LoginForm /> : <RegisterForm />}
          <div className="text-center text-sm mt-4">
            Don’t have an account?{" "}
            <a className="text-blue-500 hover:underline" href="#">
              Sign Up
            </a>
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
  );
}
