"use client";

import { Form, Spin, Typography } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ResetPasswordForm } from "@/components/reset-pass/ResetPasswordForm";
import { BannerPublic } from "@/components/common/BannerPublic";
import { useResetPassword } from "@/hooks/auth/useResetPassword";
import { Suspense } from "react";

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { mutate: resetPassword, isPending } = useResetPassword();
  const [form] = Form.useForm();

  const handleSubmit = (values: { password: string; confirmPassword: string }) => {
    if (!token) return;
    console.log('token', token);
    resetPassword(
      { token, password: values.password },
      {
        onSuccess: () => {
          router.push("/login");
        },
      }
    );
  };

  return (
    <div className="flex justify-center min-h-[90vh] bg-gray-200 bg-cover bg-center">
      <div className="flex justify-center bg-white items-center py-2 px-2 h-full w-[1100px] my-auto mx-auto rounded-3xl">
        <BannerPublic />
        <div className="h-full lg:w-1/2 flex flex-col items-center justify-center">
          <div className="w-full max-w-md bg-white px-8 py-4 rounded-2xl">
            <Typography.Title
              level={3}
              className="block text-center mb-6 text-gray-500"
            >
              Reset Password
            </Typography.Title>
            <AnimatePresence mode="wait">
              <motion.div
                key="reset-password"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <ResetPasswordForm
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Spin />}>
      <ResetPassword />
    </Suspense>
  );
}
