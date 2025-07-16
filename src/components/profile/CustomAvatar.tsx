import { CameraFilled, LoadingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Upload } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { isValidWebUrl } from '@/utils/urlValidation';

interface Props {
  avatar?: string;
  isEdit?: boolean;
  onAvatarChange: (formdata: FormData) => void;
  isUploading?: boolean;
}

const CustomAvartar = ({ avatar, isEdit, onAvatarChange, isUploading }: Props) => {
  const handleChangeImage = (info: UploadChangeParam) => {
    const file = info.fileList[0]?.originFileObj;
    if (!file) return;
    const formdata = new FormData();
    formdata.append('avatar', file);
    onAvatarChange(formdata);
  };
  return (
    <div className='relative'>
      <Avatar
        className='relative md:!w-[180px] !w-[150px] md:!h-[180px] !h-[150px] !max-w-[900px]'
        src={isValidWebUrl(avatar) ? avatar : undefined}
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
      {isUploading && (
        <div className='absolute bottom-0 right-2 cursor-pointer'>
          <div className='flex items-center justify-center bg-[#4178a7] rounded-full !p-2'>
            <LoadingOutlined style={{ color: '#fff', fontSize: '24px' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomAvartar;
