"use client";

import { LoginForm } from "@/components/login/LoginForm";
import { RegisterForm } from "@/components/register/RegisterForm";
import { Typography, Button, Divider } from "antd";
import { useState } from "react";
import { GoogleOutlined } from "@ant-design/icons";

export default function LoginPage() {
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(true);
  return (
    <div className="min-h-[88vh] flex bg-[url('/login-bg.jpg')] bg-cover bg-center">
      <div className="w-1/2 relative hidden lg:flex">
        <div className="absolute inset-0 bg-black opacity-30" />
        <div className="z-10 p-12 text-white self-center">
          <h1 className="text-4xl font-bold mb-4">SoundClient</h1>
          <p className="text-lg mb-1">
            Comprehensive music management solution
          </p>
          <p className="italic text-sm mt-4">
            “Stream music seamlessly – Discover new tracks – Manage your
            playlists from start to finish.”
          </p>
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
