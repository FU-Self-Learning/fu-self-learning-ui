import React, { useState } from 'react';
import { Form, Upload, Button, Card, List, Typography, Progress } from 'antd';
import { useRouter } from 'next/navigation';
import { UploadOutlined, BookOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { CreateCourseRequest } from '@/types/courseType';
import { useGenerateCourseFromPDF } from '@/hooks/course/instructor/useGenerateCourseFromPDF';
import { useCreateCourseWithStructure } from '@/hooks/course/instructor/useCreateCourseWithStructure';
import { GeneratedCourseData } from '@/shared/api/course.api';

interface PDFCourseGeneratorProps {
  onBack: () => void;
  onSubmit: (data: CreateCourseRequest) => void;
  initialData?: Partial<CreateCourseRequest>;
  isLoading: boolean;
}

export const PDFCourseGenerator = ({ onBack }: PDFCourseGeneratorProps) => {
  const [formUpload] = Form.useForm();
  const [formDetails] = Form.useForm();
  const [generatedData, setGeneratedData] = useState<GeneratedCourseData | null>(null);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const { mutate: generateCourse, isPending: isGenerating } = useGenerateCourseFromPDF();
  const { mutate: createCourseWithStructure, isPending: isCreating } =
    useCreateCourseWithStructure();

  const handlePDFUpload = async (file: File) => {
    if (file.type !== 'application/pdf') {
      return false;
    }

    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    generateCourse(file, {
      onSuccess: (data) => {
        clearInterval(progressInterval);
        setProgress(100);
        setGeneratedData(data);
      },
      onError: () => {
        clearInterval(progressInterval);
        setProgress(0);
      },
    });

    return false;
  };

  const handleSubmit = (values: CreateCourseRequest) => {
    if (generatedData) {
      const imageList = Array.isArray(values.image) ? values.image : [];
      const videoList = Array.isArray(values.video) ? values.video : [];
      const documentList = Array.isArray(values.document) ? values.document : [];

      const image = imageList[0]?.originFileObj;
      const video = videoList[0]?.originFileObj;
      const document = documentList[0]?.originFileObj;

      const courseFormData = new FormData();
      courseFormData.append('title', generatedData.course.title);
      courseFormData.append('description', generatedData.course.description);

      if (image) courseFormData.append('image', image);
      if (video) courseFormData.append('video', video);
      if (document) courseFormData.append('document', document);

      generatedData.course.categoryIds.forEach((id) => {
        courseFormData.append('categoryIds', id.toString());
      });

      createCourseWithStructure(
        {
          courseData: courseFormData,
          generatedData,
        },
        {
          onSuccess: (response) => {
            router.push(`/instructor/course/${response.id}`);
          },
        },
      );
    }
  };

  const handleRegenerate = () => {
    setGeneratedData(null);
    setProgress(0);
    formUpload.resetFields();
    formDetails.resetFields();
  };

  return (
    <div className='w-full'>
      <h2 className='text-2xl font-semibold mb-6'>Generate Course from PDF</h2>
      <p className='text-gray-600 mb-8'>
        Upload a PDF document and we&apos;ll automatically generate a course structure with topics
        and lessons.
      </p>

      {!generatedData ? (
        <Card className='mb-6'>
          <Form
            form={formUpload}
            layout='vertical'
            initialValues={{
              document: [],
            }}
          >
            <Form.Item
              name='document'
              label='Upload PDF Document'
              valuePropName='fileList'
              getValueFromEvent={(e) => (Array.isArray(e?.fileList) ? e.fileList : [])}
              rules={[
                {
                  required: true,
                  message: 'Please upload a PDF document',
                },
              ]}
            >
              <Upload
                accept='application/pdf'
                maxCount={1}
                beforeUpload={handlePDFUpload}
                listType='text'
                disabled={isGenerating}
              >
                <Button
                  icon={<UploadOutlined />}
                  size='large'
                  loading={isGenerating}
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Processing PDF...' : 'Upload PDF Document'}
                </Button>
              </Upload>
            </Form.Item>

            {isGenerating && (
              <div className='mt-4'>
                <Progress
                  percent={progress}
                  status={progress === 100 ? 'success' : 'active'}
                  format={(percent) => `${percent}%`}
                />
                <p className='text-sm text-gray-500 mt-2'>
                  Analyzing PDF content and generating course structure...
                </p>
              </div>
            )}
          </Form>
        </Card>
      ) : (
        <div className='space-y-6'>
          <Card>
            <div className='flex justify-between items-center mb-4'>
              <Typography.Title level={4} className='!mb-0'>
                Generated Course Structure
              </Typography.Title>
              <Button onClick={handleRegenerate} type='default'>
                Regenerate
              </Button>
            </div>

            <div className='mb-4'>
              <Typography.Title level={5}>Course Information</Typography.Title>
              <p>
                <strong>Title:</strong> {generatedData.course.title}
              </p>
              <p>
                <strong>Description:</strong> {generatedData.course.description}
              </p>
            </div>

            <Typography.Title level={5}>Topics & Lessons</Typography.Title>
            <List
              dataSource={generatedData.topics}
              renderItem={(topic) => (
                <List.Item>
                  <div className='w-full'>
                    <div className='flex items-center mb-2'>
                      <BookOutlined className='mr-2 text-blue-500' />
                      <Typography.Text strong>{topic.title}</Typography.Text>
                    </div>
                    <Typography.Text type='secondary' className='block mb-2'>
                      {topic.description}
                    </Typography.Text>
                    <List
                      size='small'
                      dataSource={topic.lessons}
                      renderItem={(lesson) => (
                        <List.Item className='!px-0'>
                          <div className='flex items-center'>
                            <PlayCircleOutlined className='mr-2 text-green-500' />
                            <Typography.Text>{lesson.title}</Typography.Text>
                          </div>
                        </List.Item>
                      )}
                    />
                  </div>
                </List.Item>
              )}
            />
          </Card>

          <Form
            form={formDetails}
            onFinish={handleSubmit}
            layout='vertical'
            initialValues={{
              image: [],
              video: [],
              document: [],
            }}
          >
            <Form.Item
              name='image'
              label='Course Thumbnail'
              valuePropName='fileList'
              getValueFromEvent={(e) => (Array.isArray(e?.fileList) ? e.fileList : [])}
              rules={[{ required: true, message: 'Please upload course thumbnail' }]}
            >
              <Upload listType='picture' maxCount={1} beforeUpload={() => false} accept='image/*'>
                <Button icon={<UploadOutlined />}>Upload Thumbnail</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              name='video'
              label='Video Thumbnail'
              valuePropName='fileList'
              getValueFromEvent={(e) => (Array.isArray(e?.fileList) ? e.fileList : [])}
              rules={[{ required: true, message: 'Please upload video thumbnail' }]}
            >
              <Upload listType='picture' maxCount={1} beforeUpload={() => false} accept='video/*'>
                <Button icon={<UploadOutlined />}>Upload Video Thumbnail</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              name='document'
              label='Course Document (PDF)'
              valuePropName='fileList'
              getValueFromEvent={(e) => (Array.isArray(e?.fileList) ? e.fileList : [])}
              rules={[
                {
                  required: true,
                  message: 'Please upload the PDF document',
                },
                {
                  validator: (_, fileList) => {
                    if (fileList && fileList.length > 0 && fileList[0].type !== 'application/pdf') {
                      return Promise.reject('Only PDF files are allowed');
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Upload accept='.pdf' maxCount={1} beforeUpload={() => false} listType='text'>
                <Button icon={<UploadOutlined />}>Upload PDF Document</Button>
              </Upload>
            </Form.Item>

            <div className='flex justify-between mt-8'>
              <Button size='large' onClick={onBack}>
                Back
              </Button>
              <Form.Item>
                <Button type='primary' size='large' htmlType='submit' loading={isCreating}>
                  Create Course with Generated Structure
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
};
