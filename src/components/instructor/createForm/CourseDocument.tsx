import { Form, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { CreateCourseRequest } from "@/types/courseType";

export const CourseDocument = ({
  onBack,
  onSubmit,
  initialData,
  isLoading,
}: {
  onBack: () => void;
  onSubmit: (data: CreateCourseRequest) => void;
  initialData?: Partial<CreateCourseRequest>;
  isLoading: boolean;
}) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: CreateCourseRequest) => {
    onSubmit(values);
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-6">Add Course Document</h2>
      <p className="text-gray-600 mb-8">
        Add your course document in PDF format.
      </p>

      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={initialData}
      >
        <Form.Item
          name="document"
          label="Course Document"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          rules={[
            {
              validator: (_, fileList) => {
                if (
                  fileList &&
                  fileList.length > 0 &&
                  fileList[0].type !== "application/pdf"
                ) {
                  return Promise.reject("Only PDF files are allowed");
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Upload
            accept=".pdf"
            maxCount={1}
            beforeUpload={() => false}
            listType="text"
          >
            <Button icon={<UploadOutlined />}>Upload PDF Document</Button>
          </Upload>
        </Form.Item>

        <div className="flex justify-between mt-8">
          <Button size="large" onClick={onBack}>
            Back
          </Button>
          <Form.Item>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={isLoading}
            >
              Submit
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};
