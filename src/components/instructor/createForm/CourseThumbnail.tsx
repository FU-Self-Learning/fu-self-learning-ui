import { Form, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { CreateCourseRequest } from "@/types/courseType";

export const CourseThumbnail = ({
  onNext,
  onBack,
  initialData,
}: {
  onNext: (data: CreateCourseRequest) => void;
  onBack: () => void;
  initialData?: Partial<CreateCourseRequest>;
}) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: CreateCourseRequest) => {
    onNext(values);
  };
  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-6">Add Course Thumbnail</h2>
      <p className="text-gray-600 mb-8">Add your course thumbnail.</p>

      <Form form={form} onFinish={handleSubmit} initialValues={initialData}>
        <Form.Item
          name="image"
          label="Course Thumbnail"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          rules={[
            { required: true, message: "Please upload course thumbnail" },
          ]}
        >
          <Upload
            listType="picture"
            maxCount={1}
            beforeUpload={() => false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Upload Thumbnail</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="video"
          label="Video Thumbnail"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          rules={[{ required: true, message: "Please upload video thumbnail" }]}
        >
          <Upload
            listType="picture"
            maxCount={1}
            beforeUpload={() => false}
            accept="video/*"
          >
            <Button icon={<UploadOutlined />}>Upload Video Thumbnail</Button>
          </Upload>
        </Form.Item>

        <div className="flex justify-between mt-8">
          <Button size="middle" onClick={onBack}>
            Back
          </Button>
          <Form.Item>
            <Button type="primary" size="middle" htmlType="submit">
              Continue to Course Document
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};
