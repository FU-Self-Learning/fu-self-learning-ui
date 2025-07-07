import React from 'react';
import { Form, Select, Space } from 'antd';

interface FlashcardFilterProps {
  filter: {
    courseId?: number;
    topicId?: number;
    lessonId?: number;
  };
  setFilter: (f: any) => void;
}

const FlashcardFilter: React.FC<FlashcardFilterProps> = ({ filter, setFilter }) => {
  // TODO: Lấy danh sách course/topic/lesson từ API nếu cần
  // const courses = ...
  // const topics = ...
  // const lessons = ...

  return (
    <Form layout='inline'>
      <Space>
        <Form.Item label='Course'>
          <Select
            placeholder='All'
            style={{ width: 140 }}
            allowClear
            value={filter.courseId}
            onChange={(v) =>
              setFilter((f: any) => ({
                ...f,
                courseId: v,
                topicId: undefined,
                lessonId: undefined,
              }))
            }
          >
            {/* {courses?.map((c: any) => (
              <Select.Option key={c.id} value={c.id}>{c.title}</Select.Option>
            ))} */}
          </Select>
        </Form.Item>
        <Form.Item label='Topic'>
          <Select
            placeholder='All'
            style={{ width: 140 }}
            allowClear
            value={filter.topicId}
            onChange={(v) => setFilter((f: any) => ({ ...f, topicId: v, lessonId: undefined }))}
          >
            {/* {topics?.map((t: any) => (
              <Select.Option key={t.id} value={t.id}>{t.title}</Select.Option>
            ))} */}
          </Select>
        </Form.Item>
        <Form.Item label='Lesson'>
          <Select
            placeholder='All'
            style={{ width: 140 }}
            allowClear
            value={filter.lessonId}
            onChange={(v) => setFilter((f: any) => ({ ...f, lessonId: v }))}
          >
            {/* {lessons?.map((l: any) => (
              <Select.Option key={l.id} value={l.id}>{l.title}</Select.Option>
            ))} */}
          </Select>
        </Form.Item>
      </Space>
    </Form>
  );
};

export default FlashcardFilter;
