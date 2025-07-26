import { useState, useEffect } from 'react';
import { LastWatchedVideo } from '@/types/enrollmentType';

const LOCAL_STORAGE_KEY = 'fu-self-learning-last-watched-video';

export const useLastWatchedVideo = (userId?: number | string) => {
  const [lastWatchedVideo, setLastWatchedVideo] = useState<LastWatchedVideo | null>(null);

  useEffect(() => {
    if (!userId) return;

    try {
      const storedData = localStorage.getItem(`${LOCAL_STORAGE_KEY}-${userId}`);
      if (storedData) {
        const parsedData = JSON.parse(storedData) as LastWatchedVideo;
        setLastWatchedVideo(parsedData);
      }
    } catch (error) {
      console.error('Error loading last watched video data:', error);
    }
  }, [userId]);

  const saveLastWatchedVideo = (videoData: LastWatchedVideo) => {
    if (!userId) return;

    try {
      setLastWatchedVideo(videoData);
      localStorage.setItem(`${LOCAL_STORAGE_KEY}-${userId}`, JSON.stringify(videoData));
    } catch (error) {
      console.error('Error saving last watched video data:', error);
    }
  };

  const clearLastWatchedVideo = () => {
    if (!userId) return;

    try {
      setLastWatchedVideo(null);
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}-${userId}`);
    } catch (error) {
      console.error('Error clearing last watched video data:', error);
    }
  };

  const getLastWatchedVideoForCourse = (courseId: string): LastWatchedVideo | null => {
    if (!userId || !lastWatchedVideo || lastWatchedVideo.courseId !== courseId) {
      return null;
    }
    return lastWatchedVideo;
  };

  return {
    lastWatchedVideo,
    saveLastWatchedVideo,
    clearLastWatchedVideo,
    getLastWatchedVideoForCourse,
  };
};
