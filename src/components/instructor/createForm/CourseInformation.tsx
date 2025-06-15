import { CategoryCourse, CreateCourseRequest } from "@/types/courseType";
import { Form, Input, Button, Select } from "antd";

export const CourseInformation = ({
  onNext,
  initialData,
  categories,
}: {
  onNext: (data: CreateCourseRequest) => void;
  initialData?: Partial<CreateCourseRequest>;
  categories: CategoryCourse[];
}) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: CreateCourseRequest) => {
    onNext(values);
  };

  return (
    <Form
      form={form}
      initialValues={initialData}
      layout="vertical"
      onFinish={handleSubmit}
      className="w-full"
    >
      <Form.Item
        name="title"
        label="Course Title"
        rules={[{ required: true, message: "Please enter course title" }]}
      >
        <Input placeholder="Enter course title" size="large" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Course Description"
        rules={[{ required: true, message: "Please enter course description" }]}
      >
        <Input.TextArea
          placeholder="Enter course description"
          rows={4}
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="categoryIds"
        label="Category"
        rules={[
          { required: true, message: "Please select at least one category" },
        ]}
      >
        <Select
          mode="multiple"
          placeholder="Select course categories"
          size="large"
          maxTagCount={3}
          maxTagTextLength={10}
          showSearch
          optionFilterProp="children"
        >
          {categories.map((category) => (
            <Select.Option key={category.id} value={category.id}>
              {category.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item className="mt-8">
        <Button type="primary" htmlType="submit" size="large" block>
          Continue to Course Content
        </Button>
      </Form.Item>
    </Form>
  );
};
