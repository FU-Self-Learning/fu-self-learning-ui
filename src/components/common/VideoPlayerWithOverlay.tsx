import { Empty } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { useRef, useState, useEffect, useCallback } from 'react';

interface VideoPlayerWithOverlayProps {
  src?: string;
  poster?: string;
  className?: string;
  rounded?: boolean;
  height?: string;
  isThumbnail?: boolean;
  onVideoPlay?: () => void;
  lessonTitle?: string;
}

const VideoPlayerWithOverlay = ({
  src,
  poster,
  className = '',
  rounded = true,
  height,
  isThumbnail,
  onVideoPlay,
  lessonTitle,
}: VideoPlayerWithOverlayProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;
    setIsPlaying(false);
    setShowOverlay(true);
    setHasInitialized(false);

    if (!isThumbnail) {
      video.setAttribute('controls', 'true');
    } else {
      video.removeAttribute('controls');
    }
  }, [src, isThumbnail]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setIsPlaying(true);
      setShowOverlay(false);
      video.setAttribute('controls', 'true');

      if (!hasInitialized) {
        onVideoPlay?.();
        setHasInitialized(true);
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setShowOverlay(true);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [hasInitialized, onVideoPlay]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || isThumbnail || hasInitialized) return;

    video.play().catch(() => {
      console.log('Autoplay prevented - waiting for user interaction');
    });
  }, [isThumbnail, hasInitialized]);

  const handlePlay = () => {
    const video = videoRef.current;
    if (video) {
      video.play().catch((error) => {
        console.error('Error playing video:', error);
      });
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
        playsInline
      />
      {showOverlay && (
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
