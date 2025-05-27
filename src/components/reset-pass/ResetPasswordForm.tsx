"use client";

import { Form, Input, Button } from "antd";
import { FormInstance } from "antd/es/form";

interface ResetPasswordFormProps {
  form: FormInstance;
  handleSubmit: (values: { password: string; confirmPassword: string }) => void;
  isPending: boolean;
}

export const ResetPasswordForm = ({
  form,
  handleSubmit,
  isPending,
}: ResetPasswordFormProps) => {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className="space-y-4"
    >
      <Form.Item
        name="password"
        label="New Password"
        rules={[
          { required: true, message: "Please input your new password!" },
          { min: 6, message: "Password must be at least 6 characters!" },
        ]}
      >
        <Input.Password
          size="large"
          className="!px-6 !py-3 !rounded-lg"
          placeholder="Enter your new password"
        />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="Confirm Password"
        dependencies={["password"]}
        rules={[
          { required: true, message: "Please confirm your password!" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Passwords do not match!"));
            },
          }),
        ]}
      >
        <Input.Password
          size="large"
          className="!px-6 !py-3 !rounded-lg"
          placeholder="Confirm your new password"
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={isPending}
          className="w-full !flex !justify-center !items-center !rounded-2xl !px-8 !py-4 !text-md !bg-[#4178a7] !border-[#4178a7] !text-white"
        >
          Reset Password
        </Button>
      </Form.Item>
    </Form>
  );
}; 