"use client";

import { Form, Input, DatePicker, Button, Divider } from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";
import { UserInfo } from "@/providers/auth/types/authType";

interface ProfileFormProps {
  data?: UserInfo;
  isEdit: boolean;
  isUpdating: boolean;
  onCancel: () => void;
  onEdit: () => void;
  onSubmit: (values: any) => void;
}

const ProfileForm = ({ data, isEdit, isUpdating, onCancel, onEdit, onSubmit }: ProfileFormProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        username: data.username || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        dob: data.dob ? dayjs(data.dob) : null,
      });
    }
  }, [data, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      className="w-full flex justify-center !mt-[120px] !px-4"
      onFinish={onSubmit}
      initialValues={{
        username: data?.username ?? "",
        email: data?.email ?? "",
        phoneNumber: data?.phoneNumber ?? "",
        dob: data?.dob ? dayjs(data.dob) : null,
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-[900px] w-full">
        <Form.Item name="username" label={"Username"}>
          <Input
            className="!px-6 !py-3 !rounded-lg"
            placeholder={"Username"}
            disabled={!isEdit}
          />
        </Form.Item>
        <Form.Item name="email" label={"Email"}>
          <Input
            className="!px-6 !py-3 !rounded-lg"
            placeholder={"Email"}
            disabled
          />
        </Form.Item>
        <Form.Item name="phoneNumber" label={"Phone Number"}>
          <Input
            className="!px-6 !py-3 !rounded-lg"
            placeholder={"Phone Number"}
            disabled={!isEdit}
          />
        </Form.Item>
        <Form.Item name="dob" label={"Date of Birth"}>
          <DatePicker
            className="!px-6 !py-3 !rounded-lg w-full"
            format="DD/MM/YYYY"
            placeholder={"Date of Birth"}
            disabled={!isEdit}
          />
        </Form.Item>
        <Divider className="md:col-span-2 border-t border-[#E5E5E5]" />
        <Form.Item className="md:col-span-2 border-t border-[#E5E5E5] !py-8">
          <div className="flex justify-end gap-2 !flex-row">
            {!isEdit ? (
              <>
                <Button
                  onClick={onEdit}
                  className="!flex !justify-center z-5 !items-center !rounded-3xl !px-8 !py-4 !text-md !bg-[#4178a7] !border-[#4178a7] !text-white"
                  loading={isUpdating}
                >
                  Edit Profile
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-[900px]">
                <Button
                  onClick={onCancel}
                  className="!flex !justify-center !items-center !rounded-2xl z-5 !px-5 !py-4 !border-[#4178a7] !text-[#4178a7] !text-md hover:!bg-[#4178a7] hover:!text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="!flex !justify-center !items-center !rounded-2xl z-5 !px-8 !py-4 !text-md !bg-[#4178a7]  !border-[#4178a7] !text-white"
                >
                  Save Profile
                </Button>
              </div>
            )}
          </div>
        </Form.Item>
      </div>
    </Form>
  );
};

export default ProfileForm; 