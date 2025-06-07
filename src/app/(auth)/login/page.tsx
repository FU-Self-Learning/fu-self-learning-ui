"use client";

import { LoginForm } from "@/components/login/LoginForm";
import GoogleIcon from "@p/svgs/google.svg"
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Typography, Button, Divider } from "antd";
import { BannerPublic } from "@/components/common/BannerPublic";
import { useActivateAccount } from "@/hooks/auth/useActiveAccount";
import { useEffect } from "react";
import { getGoogleLoginUrl } from "@/shared/api/auth.api";

export default function LoginPage() {

  const router = useRouter();
  const { mutate: activateAccount } = useActivateAccount();

  const handleLoginWithGoogle = () => {
    const callbackUrl = `${window.location.origin}/auth/callback`;
    const googleLoginUrl = getGoogleLoginUrl(callbackUrl);
    window.location.href = googleLoginUrl;
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const activateToken = searchParams.get('activateToken');

    if (activateToken) {
      activateAccount(activateToken);
      router.replace('/login');
    }
  }, []);
  return (
    <div className="flex justify-center min-h-[90vh]  bg-gray-200 bg-cover bg-center">
      <div className="flex justify-center bg-white items-center py-2 px-2 h-full w-[1100px] my-auto mx-auto rounded-3xl">
        <BannerPublic />
        <div className="h-full lg:w-1/2 flex flex-col items-center justify-center ">
          <div className="w-full max-w-md bg-white px-8 py-4 rounded-2xl">
            <Typography.Title level={3} className="block text-center mb-6 text-gray-500">
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
                <LoginForm />
              </motion.div>
            </AnimatePresence>
            <div className="text-center text-sm text-gray-400">
              Dont have an account?
              <Button
                type="link"
                className="!text-blue-500 hover:underline hover:decoration-blue-500 !p-1"
                onClick={() => router.push("/register")}
              >
                Sign Up
              </Button>
            </div>
            <div className="text-center text-xs text-gray-400 mt-2">
              By signing in, you agree to our
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