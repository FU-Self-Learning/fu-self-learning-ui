import React from 'react';
import { List, Empty, Skeleton } from 'antd';
import { useStudySets } from '@/hooks/study-set/useStudySets';
import StudySetCard from './StudySetCard';

interface StudySetListProps {
  onSelect: (id: number) => void;
  filter?: any;
  renderActions?: (item: any) => React.ReactNode;
  canEdit?: boolean;
}

const StudySetList: React.FC<StudySetListProps> = ({
  onSelect,
  filter,
  renderActions,
  canEdit,
}) => {
  const { data, isLoading } = useStudySets(filter);

  if (isLoading) return <Skeleton active paragraph={{ rows: 6 }} />;
  if (!data || data.length === 0)
    return <Empty description='No study sets found' className='my-12' />;

  return (
    <List
      grid={{
        gutter: 24,
        xs: 1,
        sm: 1,
        md: 2,
        lg: 2,
        xl: 2,
        xxl: 2,
      }}
      dataSource={data}
      renderItem={(item: any) => (
        <List.Item>
          <StudySetCard
            item={item}
            onSelect={onSelect}
            canEdit={canEdit ?? false}
            renderActions={renderActions}
          />
        </List.Item>
      )}
    />
  );
};

export default StudySetList;
