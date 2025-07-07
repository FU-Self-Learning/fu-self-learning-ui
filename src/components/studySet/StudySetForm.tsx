import React from 'react';
import { Modal, Form, Input, Select, Switch, Button } from 'antd';
import { useCreateStudySet } from '@/hooks/study-set/useCreateStudySet';
// import { useUpdateStudySet } from '@/hooks/study-set/useUpdateStudySet';

interface StudySetFormProps {
  open: boolean;
  onClose: () => void;
  // studySet?: any; // Nếu muốn dùng cho update
}

const StudySetForm: React.FC<StudySetFormProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const { mutate: createStudySet, isPending } = useCreateStudySet();
  // const { mutate: updateStudySet, isPending: isUpdating } = useUpdateStudySet();

  // const isEdit = !!studySet;

  const handleFinish = (values: any) => {
    createStudySet(values, {
      onSuccess: () => {
        form.resetFields();
        onClose();
      },
    });
  };

  return (
    <Modal open={open} onCancel={onClose} title='Create Study Set' footer={null} destroyOnHidden>
      <Form form={form} layout='vertical' onFinish={handleFinish}>
        <Form.Item
          label='Name'
          name='name'
          rules={[{ required: true, message: 'Please enter name' }]}
        >
          <Input placeholder='Study set name' />
        </Form.Item>
        <Form.Item label='Description' name='description'>
          <Input.TextArea rows={2} placeholder='Description (optional)' />
        </Form.Item>
        <Form.Item label='Tags' name='tags'>
          <Select mode='tags' placeholder='Add tags' />
        </Form.Item>
        <Form.Item label='Public' name='isPublic' valuePropName='checked'>
          <Switch />
        </Form.Item>
        <Form.Item
          label='Type'
          name='type'
          rules={[{ required: true, message: 'Please select type' }]}
        >
          <Select placeholder='Select type'>
            <Select.Option value='course'>Course</Select.Option>
            <Select.Option value='multi-course'>Multi-course</Select.Option>
            <Select.Option value='random'>Random</Select.Option>
            <Select.Option value='custom'>Custom</Select.Option>
          </Select>
        </Form.Item>
        {/* Tùy theo type, hiển thị các trường phù hợp (courseId, courseIds, limit, flashcardIds) */}
        {/* ... */}
        <div className='flex justify-end gap-2 mt-4'>
          <Button onClick={onClose}>Cancel</Button>
          <Button type='primary' htmlType='submit' loading={isPending}>
            Create
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default StudySetForm;
