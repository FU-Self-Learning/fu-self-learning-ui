import { Button, Space } from "antd";

interface StatusFilterProps {
  statusFilters: string[];
  selectedStatus: string;
  onChange: (status: string) => void;
}

export default function StatusFilter({ statusFilters, selectedStatus, onChange }: StatusFilterProps) {
  return (
    <Space wrap className="mb-6">
      {statusFilters.map((status) => (
        <Button
          key={status}
          type={selectedStatus === status ? "primary" : "default"}
          shape="round"
          onClick={() => onChange(status)}
        >
          {status}
        </Button>
      ))}
    </Space>
  );
} 