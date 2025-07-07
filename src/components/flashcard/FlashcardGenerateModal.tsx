import { Modal, Form, Select, Input, Button, message } from 'antd';
import { useGenerateFlashcards } from '@/hooks/flashcard/useGenerateFlashcards';
import { FlashcardGenerateRequest } from '@/types/flashcardType';

interface FlashcardGenerateModalProps {
  open: boolean;
  onClose: () => void;
}

const FlashcardGenerateModal: React.FC<FlashcardGenerateModalProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const { mutate: generateFlashcards, isPending } = useGenerateFlashcards();

  const handleFinish = (values: FlashcardGenerateRequest) => {
    if (!values.generation_source || !values.generation_source_id) {
      message.error('Please select a source and ID');
      return;
    }
    generateFlashcards(
      {
        generation_source: values.generation_source,
        generation_source_id: values.generation_source_id,
        prompt: values.prompt,
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
    <Modal open={open} onCancel={onClose} title='Auto-generate Flashcards' footer={null}>
      <Form form={form} layout='vertical' onFinish={handleFinish}>
        <Form.Item
          label='Source'
          name='generation_source'
          rules={[{ required: true, message: 'Please select a source' }]}
        >
          <Select placeholder='Select source'>
            <Select.Option value='lesson'>Lesson</Select.Option>
            <Select.Option value='topic'>Topic</Select.Option>
            <Select.Option value='course'>Course</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label='Source ID'
          name='generation_source_id'
          rules={[{ required: true, message: 'Please enter source ID' }]}
        >
          <Input placeholder='Enter lesson/topic/course ID' type='number' min={1} />
        </Form.Item>
        <Form.Item label='Prompt' name='prompt'>
          <Input.TextArea rows={2} placeholder='Prompt for AI (optional)' />
        </Form.Item>
        <div className='flex justify-end gap-2 mt-4'>
          <Button onClick={onClose}>Cancel</Button>
          <Button type='primary' htmlType='submit' loading={isPending}>
            Generate
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default FlashcardGenerateModal;
