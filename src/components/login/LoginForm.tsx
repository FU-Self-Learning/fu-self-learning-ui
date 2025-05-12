"use client";

import { Button, Form, Input, Checkbox } from "antd";
import { useLogin } from "@/hooks/auth/useLogin";
import {
  validateEmail,
  validatePassword,
} from "@/utils/validation/validationUtils";
import { useRouter } from "next/navigation";
import { LoginPayload } from "@/shared/api/auth.api";

export const LoginForm = () => {
  const { mutate, isPending } = useLogin();
  const router = useRouter();
  const [form] = Form.useForm();

  const handleSubmit = (values: LoginPayload) => {
    mutate(values, {
      onSuccess() {
        router.replace("/");
      },
    });
  };

  return (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Email" name="email" rules={validateEmail}>
            <Input placeholder="tripconnect@trip.vn" />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={validatePassword}>
            <Input.Password/>
          </Form.Item>

          <div className="flex justify-between items-center mb-4">
            <Checkbox>Remember me</Checkbox>
            <a className="text-sm text-blue-500 hover:underline" href="#">
              Forgot password?
            </a>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="bg-blue-600 hover:bg-blue-700"
              loading={isPending}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
  );
};
