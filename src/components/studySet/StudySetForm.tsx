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

  // State to track isPublic
  const [isPublic, setIsPublic] = React.useState(true);

  // Reset form when modal opens
  React.useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue({ isPublic: true });
      setIsPublic(true);
    }
  }, [open, form]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title='Create Study Set'
      footer={null}
      destroyOnHidden={true}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={handleFinish}
        initialValues={{ isPublic: true }}
      >
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
          <Switch
            checked={isPublic}
            onChange={(checked) => {
              setIsPublic(checked);
              form.setFieldsValue({ isPublic: checked });
            }}
          />
        </Form.Item>
        {!isPublic && (
          <Form.Item
            label='Password'
            name='password'
            rules={[{ required: true, message: 'Please enter password for private set' }]}
          >
            <Input.Password placeholder='Password' />
          </Form.Item>
        )}
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
