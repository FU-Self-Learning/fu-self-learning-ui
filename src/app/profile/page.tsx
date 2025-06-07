"use client";

import { message } from "antd";
import { useState } from "react";
import {
  useProfile,
  useUpdateProfile,
  useUploadAvatar,
} from "@/hooks/auth/useProfile";
import CustomAvartar from "@/components/profile/CustomAvatar";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ChangePassForm from "@/components/profile/ChangePassForm";
const Profile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const { data } = useProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutate: uploadAvatar, isPending: isUploading } = useUploadAvatar();
  const [activeTab, setActiveTab] = useState("profile");

  const handleCancel = () => {
    setIsEdit(false);
  };

  const handleSubmitUpdateProfile = async (values: any) => {
    updateProfile(values);
    setIsEdit(false);
    message.success("Profile updated successfully");
  };

  const handleSubmitUploadAvatar = async (values: FormData) => {
    uploadAvatar(values);
    setIsEdit(false);
  };

  const handleEdit = () => {
    setIsEdit(true);
  };

  const renderBody = () => {
    if (activeTab === "profile") {
      return renderProfileInfo();
    } else if (activeTab === "password") {
      return <ChangePassForm />;
    }
  };

  const renderProfileInfo = () => {
    return (
      <>
        <div className="bg-[#f5f3ea] h-[145px] rounded-t-2xl ">
          <div className="absolute top-12 mx-auto left-1/2 -translate-x-1/2 lg:left-12 lg:translate-x-0">
            <CustomAvartar
              avatar={data?.avatarUrl}
              isEdit={isEdit}
              onAvatarChange={handleSubmitUploadAvatar}
              isUploading={isUploading}
            />
          </div>
        </div>
        <ProfileForm
          data={data}
          isEdit={isEdit}
          isUpdating={isUpdating}
          onCancel={handleCancel}
          onEdit={handleEdit}
          onSubmit={handleSubmitUpdateProfile}
        />
      </>
    );
  }

  return (
    <div className="flex gap-6 p-6">
      <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1">
        <div className="relative rounded-2xl bg-white h-full shadow-md">
          {renderBody()}
        </div>
      </div>
    </div>
  );
};

export default Profile;
