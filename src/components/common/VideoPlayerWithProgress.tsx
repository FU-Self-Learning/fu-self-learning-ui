import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Empty, message } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { useProgressManager } from '@/hooks/useProgressManager';
import { TopicResponse } from '@/types/topicType';
import { useLastWatchedVideo } from '@/hooks/video-progress/useLastWatchedVideo';
import { useSelector } from 'react-redux';
import { selectAuthUser, selectIsAuthenticated } from '@/providers/auth/selector/authSelector';
import { useProgressFromStorage } from '@/hooks/useProgressFromStorage';
import { useCheckEnrollment } from '@/hooks/enrollment';

interface VideoPlayerWithProgressProps {
  src?: string;
  poster?: string;
  height?: string;
  rounded?: boolean;
  showOverlay?: boolean;
  className?: string;
  isThumbnail?: boolean;
  courseId?: string;
  lessonId?: string | number;
  lessonTitle?: string;
  topicId?: string;
  courseTitle?: string;
  topics?: TopicResponse[];
  onVideoPlay?: () => void;
  onLessonComplete?: () => void;
  autoUpdateProgress?: boolean; 
  currentProgress?: number; 
}

export const VideoPlayerWithProgress: React.FC<VideoPlayerWithProgressProps> = ({
  src,
  poster,
  height = 'h-64',
  rounded = false,
  showOverlay: initialShowOverlay = true,
  className = '',
  isThumbnail = false,
  courseId,
  lessonId,
  lessonTitle,
  topicId,
  courseTitle,
  topics,
  onVideoPlay,
  onLessonComplete,
  autoUpdateProgress = true,
  currentProgress = 0
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showOverlay, setShowOverlay] = useState(initialShowOverlay);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [hasStartedTracking, setHasStartedTracking] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const user = useSelector(selectAuthUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { saveLastWatchedVideo } = useLastWatchedVideo(user?.id?.toString());
  const { data: enrollmentCheck } = useCheckEnrollment(courseId || '');
  const { 
    updateProgressOnLessonStart, 
    updateProgressOnLessonComplete,
    isUpdating 
  } = useProgressManager();

  const actualProgress = useProgressFromStorage({ 
    courseId: courseId || '', 
    topics, 
    fallbackProgress: enrollmentCheck?.progress || 0 
  });

  const saveCurrentLessonToStorage = useCallback(() => {
    if (isAuthenticated && user?.id && courseId && lessonId && topicId && courseTitle && lessonTitle) {
      saveLastWatchedVideo({
        courseId,
        lessonId: lessonId.toString(),
        videoId: src || '',
        topicId,
        courseTitle,
        lessonTitle
      });
    }
  }, [isAuthenticated, user?.id, courseId, lessonId, topicId, courseTitle, lessonTitle, src, saveLastWatchedVideo]);

  const handleLessonStart = useCallback(() => {
    if (!autoUpdateProgress || !courseId || !lessonId || !topics || hasStartedTracking) {
      return;
    }

    if (actualProgress >= 100) {
      console.log(`🚫 Course ${courseId} already completed (${actualProgress}%), skipping progress tracking for lesson ${lessonId}`);
      return;
    }

    console.log(`🎬 Starting lesson ${lessonId}, current course progress: ${actualProgress}%`);
    setHasStartedTracking(true);
    updateProgressOnLessonStart(courseId, lessonId, topics, actualProgress);
    saveCurrentLessonToStorage();
  }, [autoUpdateProgress, courseId, lessonId, topics, hasStartedTracking, actualProgress, updateProgressOnLessonStart, saveCurrentLessonToStorage]);

  const handleLessonComplete = useCallback(() => {
    if (!autoUpdateProgress || !courseId || !lessonId || !topics || isCompleted) {
      return;
    }

    if (actualProgress >= 100) {
      console.log(`🚫 Course ${courseId} already completed (${actualProgress}%), skipping completion update for lesson ${lessonId}`);
      return;
    }

    console.log(`✅ Completing lesson ${lessonId}, current course progress: ${actualProgress}%`);
    setIsCompleted(true);
    const result = updateProgressOnLessonComplete(courseId, lessonId, topics, actualProgress);
    
    if (result?.isCompleted) {
      onLessonComplete?.();
    }
  }, [autoUpdateProgress, courseId, lessonId, topics, isCompleted, actualProgress, updateProgressOnLessonComplete, onLessonComplete]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || isThumbnail) return;

    const handlePlay = () => {
      setShowOverlay(false);
      video.setAttribute('controls', 'true');

      if (!hasInitialized) {
        onVideoPlay?.();
        setHasInitialized(true);
        
        setTimeout(() => {
          handleLessonStart();
        }, 1000);
      }
    };

    const handleEnded = () => {
      setShowOverlay(true);
      handleLessonComplete();
    };

    const handleTimeUpdate = () => {
      if (video.currentTime > 0 && Math.floor(video.currentTime) % 10 === 0) {
        saveCurrentLessonToStorage();
      }
    };

    const handleProgress = () => {
      if (video.duration > 0) {
        const progressPercent = (video.currentTime / video.duration) * 100;
        if (progressPercent >= 90 && !isCompleted) {
          handleLessonComplete();
        }
      }
    };

    const handleError = (event: Event) => {
      console.error('Video error occurred:', event);
      const error = (event.target as HTMLVideoElement).error;
      
      if (error) {
        console.error('Video error details:', {
          code: error.code,
          message: error.message
        });
        
        if (error.code === 3) {
          message.warning('Video decoding issue. Reloading...');
          setTimeout(() => {
            video.load();
          }, 1000);
        }
      }
    };

    const handleCanPlay = () => {
      console.log('Video can play');
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [hasInitialized, onVideoPlay, isThumbnail, handleLessonStart, handleLessonComplete, saveCurrentLessonToStorage, isCompleted]);

  const handleOverlayClick = () => {
    const video = videoRef.current;
    if (video) {
      video.play().catch((error) => {
        console.error('Error playing video:', error);
        if (error.message?.includes('CACHE_OPERATION_NOT_SUPPORTED')) {
          const currentTime = video.currentTime;
          video.load();
          video.currentTime = currentTime; 
          setTimeout(() => {
            video.play().catch(() => {
              message.error('Unable to play video. Please refresh the page.');
            });
          }, 500);
        } else {
          message.error('Unable to play video');
        }
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
        <Empty description="No video available" />
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
        className="w-full h-full object-cover"
        playsInline
        preload="metadata"
        crossOrigin="anonymous"
        controlsList="nodownload"
      />
      
      {showOverlay && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 cursor-pointer transition-all duration-200 hover:bg-opacity-60"
          onClick={handleOverlayClick}
        >
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition">
            <PlayCircleOutlined className="text-white text-4xl" />
          </div>
        </div>
      )}

      {isUpdating && (
        <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-md text-sm">
          Updating progress...
        </div>
      )}

      {isCompleted && (
        <div className="absolute bottom-4 right-4 bg-green-600 text-white px-3 py-1 rounded-md text-sm">
          ✓ Lesson completed
        </div>
      )}
    </div>
  );
};

export default VideoPlayerWithProgress;
