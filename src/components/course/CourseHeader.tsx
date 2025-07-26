
import { Input, Button, Tag, Space, Dropdown } from 'antd';
import { SearchOutlined, FilterOutlined, DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useState } from 'react';

type Props = {
  total: number;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  allCategories: string[];
  onSearch?: (value: string) => void;
};

export default function CourseHeader({
  total,
  selectedCategory,
  setSelectedCategory,
  allCategories,
  onSearch,
}: Props) {
  const [searchValue, setSearchValue] = useState('');
  const categoryItems: MenuProps['items'] = [
    {
      key: 'all',
      label: 'All Categories',
      onClick: () => setSelectedCategory(null),
    },
    ...allCategories.map((category) => ({
      key: category,
      label: category,
      onClick: () => setSelectedCategory(category),
    })),
  ];

  return (
    <div className='flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4'>
      <div className='text-2xl font-bold flex items-center gap-3'>
        <span>All Materials</span>
        <Tag color='default'>{total}</Tag>
      </div>
      <Space wrap>
        <Input
          placeholder='Search...'
          prefix={<SearchOutlined />}
          allowClear
          style={{ width: 200 }}
          value={searchValue}
          onChange={e => {
            setSearchValue(e.target.value);
            if (onSearch) onSearch(e.target.value);
          }}
          onPressEnter={e => {
            if (onSearch) onSearch(searchValue.trim());
          }}
          onClear={() => {
            setSearchValue('');
            if (onSearch) onSearch('');
          }}
        />
        <Dropdown menu={{ items: categoryItems }} placement='bottomRight'>
          <Button icon={<FilterOutlined />}>
            {selectedCategory ? `Category: ${selectedCategory}` : 'Filter by Category'}
          </Button>
        </Dropdown>
      </Space>
    </div>
  );
}
