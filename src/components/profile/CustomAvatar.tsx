import { CameraFilled, UserOutlined } from '@ant-design/icons';
import { Avatar, Upload } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';

// import { ACCEPTED_IMAGE_TYPES, FILE_TYPE, MAX_IMAGE_FILE_SIZE_KB } from '@app/constants/file';
// import { validateFile, ValidateFileParams } from '@app/helpers/fileValidation';
// import {
//   NotificationTypeEnum,
//   openNotificationWithIcon,
// } from '@app/services/notification/notificationService';

interface Props {
  avatar?: string;
  isEdit?: boolean;
  onAvatarChange: (formdata: FormData) => void;
}

const CustomAvartar = ({ avatar, isEdit, onAvatarChange }: Props) => {
  const handleChangeImage = (info: UploadChangeParam) => {
    const file = info.fileList[0]?.originFileObj;
    if (!file) return;
    // const paramValid = {
    //   file,
    //   acceptedTypes: ACCEPTED_IMAGE_TYPES,
    //   maxSizeKB: MAX_IMAGE_FILE_SIZE_KB,
    //   type: FILE_TYPE.IMAGE,
    // };
    // const { isValid, errorMessageKey, errorMessageParams } = validateFile(paramValid);
      // if (!isValid) {
      //   const msgKey = errorMessageKey ?? 'PROFILE.AVATAR_UPLOAD_ERROR';
      return;
    const formdata = new FormData();
    // formdata.append('avatar', file);
    onAvatarChange(formdata);
  };
  return (
    <div className='relative'>
      <Avatar
        className='relative md:!w-[180px] !w-[150px] md:!h-[180px] !h-[150px] !max-w-[900px]'
        src={avatar}
        icon={<UserOutlined className='md:!text-[180px] !text-[150px]' />}
      />

      {isEdit && (
        <Upload
          key={avatar}
          showUploadList={false}
          beforeUpload={() => false}
          onChange={handleChangeImage}
          accept='image/*'
        >
          <div className='absolute bottom-0 right-2 cursor-pointer'>
            <div className='flex items-center justify-center bg-[#4178a7] rounded-full !p-2'>
              <CameraFilled style={{ color: '#fff', fontSize: '24px' }} />
            </div>
          </div>
        </Upload>
      )}
    </div>
  );
};

export default CustomAvartar;
