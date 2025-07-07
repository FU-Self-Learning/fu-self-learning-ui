import React from 'react';
import { Form, Input, Select, Switch, Space } from 'antd';

interface StudySetFilterProps {
  filter: any;
  setFilter: (f: any) => void;
}

const StudySetFilter: React.FC<StudySetFilterProps> = ({ filter, setFilter }) => {
  return (
    <Form layout='inline'>
      <Space>
        <Form.Item label='Tag'>
          <Select
            mode='tags'
            style={{ width: 160 }}
            placeholder='All'
            value={filter.tag}
            onChange={(v) => setFilter((f: any) => ({ ...f, tag: v }))}
          />
        </Form.Item>
        <Form.Item label='Public'>
          <Switch
            checked={filter.isPublic}
            onChange={(v) => setFilter((f: any) => ({ ...f, isPublic: v }))}
          />
        </Form.Item>
        <Form.Item label='Search'>
          <Input.Search
            placeholder='Search by name...'
            style={{ width: 200 }}
            value={filter.search}
            onChange={(e) => setFilter((f: any) => ({ ...f, search: e.target.value }))}
            allowClear
          />
        </Form.Item>
      </Space>
    </Form>
  );
};

export default StudySetFilter;
