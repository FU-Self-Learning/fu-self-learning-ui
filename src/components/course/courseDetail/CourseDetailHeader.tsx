import { Tag } from "antd";
import VideoPlayerWithOverlay from "@/components/common/VideoPlayerWithOverlay";

interface CourseDetailHeaderProps {
  videoIntroUrl: string;
  title: string;
  category: string;
  stats: string;
}

const CourseDetailHeader = ({
  videoIntroUrl,
  title,
  category,
  stats,
}: CourseDetailHeaderProps) => {
  return (
    <>
      <VideoPlayerWithOverlay src={videoIntroUrl} height="h-[400px]" />
      <h1 className="text-2xl font-semibold">{title}</h1>
      <Tag color="blue" className="mt-2">
        {category}
      </Tag>
      <p className="text-sm text-gray-500 mt-2">{stats}</p>
    </>
  );
};

export default CourseDetailHeader;
