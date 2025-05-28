"use client";

import { LoginForm } from "@/components/login/LoginForm";
import { RegisterForm } from "@/components/register/RegisterForm";
import { Typography, Button, Divider } from "antd";
import { useState } from "react";
import Image from "next/image";
import GoogleIcon from "@p/svgs/google.svg"
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BannerPublic } from "@/components/common/BannerPublic";
import { getGoogleLoginUrl } from "@/shared/api/auth.api";

export default function LoginPage() {
  const router = useRouter();
  const [isLoginFormVisible] = useState<boolean>(true);

  const handleLoginWithGoogle = () => {
      const callbackUrl = `${window.location.origin}/auth/callback`;
      const googleLoginUrl = getGoogleLoginUrl(callbackUrl);
      window.location.href = googleLoginUrl;
    };

  return (
    <div className="flex justify-center min-h-[90vh]  bg-gray-200 bg-cover bg-center">
      <div className="flex justify-center bg-white items-center py-2 px-2 h-full w-[1100px] my-auto mx-auto rounded-3xl">
        <BannerPublic />
        <div className="w-full lg:w-1/2 flex items-center flex-col  justify-center p-6">
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
              onClick={handleLoginWithGoogle}
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