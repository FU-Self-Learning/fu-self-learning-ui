import { Input, Button, Tag, Space, Dropdown } from 'antd';
import { SearchOutlined, FilterOutlined, DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

type Props = {
  total: number;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  allCategories: string[];
};

export default function CourseHeader({
  total,
  selectedCategory,
  setSelectedCategory,
  allCategories,
}: Props) {
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
        />
        <Dropdown menu={{ items: categoryItems }} placement='bottomRight'>
          <Button icon={<FilterOutlined />}>
            {selectedCategory ? `Category: ${selectedCategory}` : 'Filter by Category'}
          </Button>
        </Dropdown>
        <Button icon={<DownOutlined />}>Sort by</Button>
      </Space>
    </div>
  );
}
