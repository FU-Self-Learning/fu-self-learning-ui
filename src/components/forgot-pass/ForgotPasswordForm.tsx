import { FormInstance, Form, Input, Button } from "antd";
import Link from "next/link";

interface ForgotPasswordFormProps {
  form: FormInstance<any>;
  handleSubmit: (values: { email: string }) => void;
  isPending: boolean;
}

export const ForgotPasswordForm = ({
  form,
  handleSubmit,
  isPending,
}: ForgotPasswordFormProps) => {
  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Please input your email!" },
          { type: "email", message: "Please enter a valid email!" },
        ]}
      >
        <Input
          size="large"
          className="!px-6 !py-3 !rounded-lg"
          placeholder="Enter your email"
        />
      </Form.Item>

      <div className="flex flex-col gap-4">
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={isPending}
          className="!bg-blue-600 hover:!bg-blue-700 !text-white !font-bold !text-lg  !rounded-xl !transition !duration-200 !ease-in-out !shadow-md hover:!shadow-lg !py-6 "
        >
          Send Reset Link
        </Button>
        <div className="text-center">
          <Link
            href="/login"
            className="font-medium text-[#4178a7] hover:text-[#4178a7]/80"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </Form>
  );
};
