import { Modal, Form, Input, Select, Button, message } from 'antd';
import { useCreateFlashcard } from '@/hooks/flashcard/useCreateFlashcard';
// import { useUpdateFlashcard } from '@/hooks/flashcard/useUpdateFlashcard';
// import { useLessons, useTopics } from '@/hooks/lesson-topic'; // giả định có hook lấy lesson/topic

interface FlashcardFormProps {
  open: boolean;
  onClose: () => void;
  // flashcard?: any; // Nếu muốn dùng cho update
}

const FlashcardForm: React.FC<FlashcardFormProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const { mutate: createFlashcard, isPending } = useCreateFlashcard();
  // const { mutate: updateFlashcard, isPending: isUpdating } = useUpdateFlashcard();
  // const { data: lessons } = useLessons();
  // const { data: topics } = useTopics();

  // const isEdit = !!flashcard;

  const handleFinish = (values: any) => {
    if (!values.lessonId && !values.topicId) {
      message.error('Please select either a lesson or a topic');
      return;
    }
    createFlashcard(
      {
        ...values,
        is_auto_generated: false,
        generation_source: 'manual',
      },
      {
        onSuccess: () => {
          form.resetFields();
          onClose();
        },
      },
    );
  };

  return (
    <Modal open={open} onCancel={onClose} title='Create Flashcard' footer={null}>
      <Form form={form} layout='vertical' onFinish={handleFinish}>
        <Form.Item label='Lesson' name='lessonId'>
          <Select placeholder='Select lesson (optional)'>
            {/* {lessons?.map((l: any) => (
              <Select.Option key={l.id} value={l.id}>{l.title}</Select.Option>
            ))} */}
          </Select>
        </Form.Item>
        <Form.Item label='Topic' name='topicId'>
          <Select placeholder='Select topic (optional)'>
            {/* {topics?.map((t: any) => (
              <Select.Option key={t.id} value={t.id}>{t.title}</Select.Option>
            ))} */}
          </Select>
        </Form.Item>
        <Form.Item
          label='Front Text'
          name='front_text'
          rules={[{ required: true, message: 'Please enter the front text' }]}
        >
          <Input.TextArea rows={2} placeholder='Question or prompt...' />
        </Form.Item>
        <Form.Item
          label='Back Text'
          name='back_text'
          rules={[{ required: true, message: 'Please enter the back text' }]}
        >
          <Input.TextArea rows={3} placeholder='Answer or explanation...' />
        </Form.Item>
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

export default FlashcardForm;
