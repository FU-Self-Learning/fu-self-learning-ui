"use client";

import { Form, Input, DatePicker, Button, Divider, message } from "antd";
import { useEffect, useState } from "react";
import { useProfile, useUpdateProfile } from "@/hooks/auth/useProfile";
import CustomAvartar from "@/components/profile/CustomAvatar";
import dayjs from "dayjs";

const Profile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const { data } = useProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  //   const { mutate: uploadAvatar } = useUploadAvatar();

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

  const handleCancel = () => {
    setIsEdit(false);
    form.resetFields();
  };

  const handleSubmitUpdateProfile = async (values: any) => {
    updateProfile(values);
    setIsEdit(false);
    message.success("Profile updated successfully");
  };

  const handleSubmitUploadAvatar = async (values: FormData) => {
    // uploadAvatar(values);
    setIsEdit(false);
  };

  const handleEdit = () => {
    console.log("Edit button clicked");
    setIsEdit(true);
  };
  return (
    <>
      <div className="relative rounded-2xl bg-white h-full shadow-md">
        <div className="bg-[#f5f3ea] h-[145px] rounded-t-2xl ">
          <div className="absolute top-12 mx-auto left-1/2 -translate-x-1/2 lg:left-12 lg:translate-x-0">
            <CustomAvartar
              avatar={data?.avatar_url}
              isEdit={isEdit}
              onAvatarChange={handleSubmitUploadAvatar}
            />
          </div>
        </div>
        <Form
          form={form}
          layout="vertical"
          className="w-full flex justify-center !mt-[120px] !px-4"
          onFinish={handleSubmitUpdateProfile}
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
                      onClick={handleEdit}
                      className="!flex !justify-center z-5 !items-center !rounded-3xl !px-8 !py-4 !text-md !bg-[#4178a7] !border-[#4178a7] !text-white"
                      loading={isUpdating}
                    >
                      Edit Profile
                    </Button>
                  </>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-[900px]">
                    <Button
                      onClick={handleCancel}
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
      </div>
    </>
  );
};
export default Profile;
