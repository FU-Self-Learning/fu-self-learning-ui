'use client';

import { useChangePass } from '@/hooks/auth/useChangePass';
import { Form, Input, Button } from 'antd';

const ChangePassForm = () => {
  const { mutate: changePassword, isPending } = useChangePass();
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    changePassword(values, {
      onSuccess: () => {
        form.resetFields();
      },
    });
  };

  return (
    <Form
      form={form}
      layout='vertical'
      className='h-full w-full flex justify-center !px-4 !py-12'
      onFinish={handleSubmit}
    >
      <div className='grid grid-cols-1 gap-2 max-w-[900px] w-full'>
        <Form.Item
          name='currentPassword'
          label='Current Password'
          rules={[{ required: true, message: 'Please input your current password!' }]}
        >
          <Input.Password
            className='!px-6 !py-3 !rounded-lg'
            placeholder='Enter your current password'
          />
        </Form.Item>
        <Form.Item
          name='newPassword'
          label='New Password'
          rules={[
            { required: true, message: 'Please input your new password!' },
            { min: 6, message: 'Password must be at least 6 characters!' },
          ]}
        >
          <Input.Password
            className='!px-6 !py-3 !rounded-lg'
            placeholder='Enter your new password'
          />
        </Form.Item>
        <Form.Item
          name='confirmNewPassword'
          label='Confirm New Password'
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Please confirm your new password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password
            className='!px-6 !py-3 !rounded-lg'
            placeholder='Confirm your new password'
          />
        </Form.Item>
        <Form.Item className='!py-8'>
          <div className='flex justify-end'>
            <Button
              type='primary'
              htmlType='submit'
              className='!flex !justify-center !items-center !rounded-2xl !px-8 !py-4 !text-md !bg-[#4178a7] !border-[#4178a7] !text-white'
              loading={isPending}
            >
              Change Password
            </Button>
          </div>
        </Form.Item>
      </div>
    </Form>
  );
};

export default ChangePassForm;
