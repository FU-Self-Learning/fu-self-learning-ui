"use client";

import {
  Button,
  Form,
  Input,
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
        <div>
          <label className="flex text-[14px] m-2 font-bold">Email</label>
          <Form.Item name="email" rules={validateEmail}>
            <Input placeholder="you@gmail.com" />
          </Form.Item>
        </div>

        <div>
          <label className="flex text-[14px] m-2 font-bold">Full Name</label>
          <Form.Item
            name="fullName"
            rules={[{ required: true, message: "Please enter your full name" }]}
          >
            <Input placeholder="Nguyen Van A" />
          </Form.Item>
        </div>
      </Space>


      <div>
        <label className="flex text-[14px] m-2 font-bold">Password</label>
        <Form.Item name="password" rules={validatePassword}>
          <Input.Password />
        </Form.Item>
      </div>
      <div>
        <label className="flex text-[14px] m-2 font-bold">Confirm Password</label>
        <Form.Item
          name="confirmPassword"
          dependencies={["password"]}
          rules={validateConfirmPassword}
        >
          <Input.Password />
        </Form.Item>
      </div>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={isPending}
          className="!bg-blue-600 hover:!bg-blue-700 !text-white !font-bold !text-lg  !rounded-xl !transition !duration-200 !ease-in-out !shadow-md hover:!shadow-lg !py-6"
        >
          Register
        </Button>
      </Form.Item>

    </Form>
  );
};
