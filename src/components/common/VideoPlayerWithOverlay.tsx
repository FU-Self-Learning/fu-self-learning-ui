import { Empty } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';

interface VideoPlayerWithOverlayProps {
  src?: string;
  poster?: string;
  className?: string;
  rounded?: boolean;
  height?: string;
  isThumbnail?: boolean;
}

const VideoPlayerWithOverlay = ({
  src,
  poster,
  className = '',
  rounded = true,
  height,
  isThumbnail,
}: VideoPlayerWithOverlayProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      videoRef.current.setAttribute('controls', 'true');
      setIsPlaying(true);
    }
  };

  if (!src) {
    return (
      <div
        className={`flex items-center justify-center text-gray-400 bg-gray-100 w-full ${height} ${
          rounded ? 'rounded-lg' : ''
        } mb-4 ${className}`}
      >
        <Empty description='No video intro available' />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full ${height} ${
        rounded ? 'rounded-lg' : ''
      } overflow-hidden mb-4 ${className}`}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster ?? src}
        className='w-full h-full object-cover'
        autoPlay={isThumbnail ? false : true}
      />
      {!isPlaying && (
        <div
          className='absolute inset-0 flex items-center justify-center bg-gray-300 cursor-pointer transition-all duration-200 hover:bg-opacity-80'
          onClick={handlePlay}
        >
          <div className='flex items-center justify-center w-20 h-20 rounded-full bg-opacity-20 hover:bg-opacity-30 transition'>
            <PlayCircleOutlined className='text-5xl drop-shadow' />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayerWithOverlay;
