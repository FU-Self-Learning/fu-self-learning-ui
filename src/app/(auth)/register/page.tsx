"use client";

import { RegisterForm } from "@/components/register/RegisterForm";
import { Typography, Button, Divider } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  return (
    <div className="min-h-[85vh] flex bg-[url('/login-bg.jpg')] bg-cover bg-center">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md px-8 py-4">
          <Typography.Title level={3} className="text-center">
            Create Account
          </Typography.Title>
          <Typography.Text className="block text-center mb-6 text-gray-500">
            Join us and start your musical journey!
          </Typography.Text>

          <Button icon={<GoogleOutlined />} block>
            Using Google account
          </Button>

          <Divider>OR</Divider>
          <AnimatePresence mode="wait">
            <motion.div
              key="register"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <RegisterForm />
            </motion.div>
          </AnimatePresence>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Button 
              type="link" 
              className="!text-blue-500" 
              onClick={() => router.push("/login")}
            >
              Sign In
            </Button>
          </div>
          <div className="text-center text-xs text-gray-400 mt-2">
            By signing up, you agree to our{" "}
            <a className="underline" href="#">
              Terms & Privacy
            </a>
          </div>
        </div>
      </div>
      <div className="w-1/2 relative hidden lg:flex">
        <div className="absolute inset-0 bg-black opacity-30" />
        <div className="z-10 p-12 text-white self-center">
          <h1 className="text-4xl font-bold mb-4">SoundClient</h1>
          <p className="text-lg mb-1">
            Comprehensive music management solution
          </p>
          <p className="italic text-sm mt-4">
            "Stream music seamlessly – Discover new tracks – Manage your
            playlists from start to finish."
          </p>
        </div>
      </div>
    </div>
  );
}
