"use client";

import {
  Button,
  Form,
  Input,
  Checkbox,
  Space,
} from "antd";
import { useRouter } from "next/navigation";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "@/utils/validation/validationUtils";
import { RegisterPayload } from "@/shared/api/auth.api";
import { useRegister } from "@/hooks/auth/useRegister";

export const RegisterForm = () => {
  const { mutate, isPending } = useRegister();
  const router = useRouter();
  const [form] = Form.useForm();

  const handleSubmit = (values: RegisterPayload) => {
    mutate(values, {
      onSuccess() {
        router.replace("/");
      },
    });
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Space className="justify-between w-full">
        <Form.Item label="Email" name="email" rules={validateEmail}>
          <Input placeholder="you@gmail.com" />
        </Form.Item>

        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: "Please enter your full name" }]}
        >
          <Input placeholder="Nguyen Van A" />
        </Form.Item>
      </Space>

      <Form.Item label="Password" name="password" rules={validatePassword}>
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Confirm Password"
        name="confirmPassword"
        dependencies={["password"]}
        rules={validateConfirmPassword}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Checkbox>
          I agree to the <a href="#">Terms & Conditions</a>
        </Checkbox>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          className="bg-blue-600 hover:bg-blue-700"
          loading={isPending}
        >
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};
