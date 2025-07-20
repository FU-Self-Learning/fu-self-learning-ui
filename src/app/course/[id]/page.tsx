'use client';

import { useParams, useSearchParams } from 'next/navigation';
import {
  CourseDetailHeader,
  CourseDetailTabs,
  CourseDetailContent,
} from '@/components/course/courseDetail';
import { useCourseDetail } from '@/hooks/course/useCourseDetail';
import { Spin } from 'antd';
import { useTopics } from '@/hooks/topic/useTopics';
import { useState, useEffect, useCallback } from 'react';
import { LessonInTopic } from '@/types/topicType';
import { useLastWatchedVideo } from '@/hooks/video-progress/useLastWatchedVideo';
import ContinueWatchingModal from '@/components/video-progress/ContinueWatchingModal';
import ProgressSyncer from '@/components/common/ProgressSyncer';
import { useSelector } from 'react-redux';
import { selectAuthUser, selectIsAuthenticated } from '@/providers/auth/selector/authSelector';
import { useCheckEnrollment } from '@/hooks/enrollment';

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [selectedLesson, setSelectedLesson] = useState<LessonInTopic | null>(null);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number | undefined>(undefined);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [showContinueModal, setShowContinueModal] = useState(false);
  const [hasCheckedLastWatched, setHasCheckedLastWatched] = useState(false);
  
  const user = useSelector(selectAuthUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  const { data: courseDetail, isLoading } = useCourseDetail(id);
  const { data: topics, isLoading: isLoadingTopics } = useTopics(id);
  const { data: enrollmentCheck } = useCheckEnrollment(id);
  const { lastWatchedVideo, saveLastWatchedVideo, getLastWatchedVideoForCourse } = 
    useLastWatchedVideo(user?.id?.toString());

  const findFirstLesson = useCallback(() => {
    if (!topics || topics.length === 0 || !topics[0].lessons || topics[0].lessons.length === 0) {
      return null;
    }
    return topics[0].lessons[0];
  }, [topics]);

  const handleLessonSelect = useCallback((lesson: LessonInTopic) => {
    if (selectedLesson && selectedLesson.id === lesson.id) {
      setShowContinueModal(false);
      return;
    }
    setSelectedLesson(lesson);
    setShowContinueModal(false);
    let lessonIndex = 0;
    for (const topic of topics || []) {
      for (const topicLesson of topic.lessons || []) {
        if (topicLesson.id === lesson.id) {
          setSelectedLessonIndex(lessonIndex);
          setSelectedTopicId(topic.id.toString());
          if (isAuthenticated && user?.id && enrollmentCheck?.isEnrolled && courseDetail) {
            saveLastWatchedVideo({
              courseId: id,
              lessonId: lesson.id.toString(),
              videoId: lesson.videoUrl || '',
              topicId: topic.id.toString(),
              courseTitle: courseDetail.title,
              lessonTitle: lesson.title
            });
          }
          return;
        }
        lessonIndex++;
      }
    }
  }, [topics, isAuthenticated, user?.id, enrollmentCheck?.isEnrolled, saveLastWatchedVideo, id, courseDetail, selectedLesson]);

  useEffect(() => {
    if (!isLoading && !isLoadingTopics && courseDetail && topics) {
      const lessonId = searchParams.get('lessonId');
      
      if (lessonId || hasCheckedLastWatched) return;
      
      if (isAuthenticated && user?.id && enrollmentCheck?.isEnrolled) {
        const lastWatched = getLastWatchedVideoForCourse(id);
        if (lastWatched) {
          setShowContinueModal(true);
        } else {
          const firstLesson = findFirstLesson();
          if (firstLesson) {
            handleLessonSelect(firstLesson);
          }
        }
      } else {
        const firstLesson = findFirstLesson();
        if (firstLesson) {
          setSelectedLesson(firstLesson);
          setSelectedLessonIndex(0);
          setSelectedTopicId(topics[0]?.id?.toString() || '');
        }
      }
      
      setHasCheckedLastWatched(true);
    }
  }, [
    isLoading, 
    isLoadingTopics, 
    courseDetail, 
    topics, 
    isAuthenticated, 
    user?.id, 
    enrollmentCheck?.isEnrolled,
    searchParams,
    hasCheckedLastWatched,
    findFirstLesson,
    getLastWatchedVideoForCourse,
    id,
    handleLessonSelect
  ]);

  if (isLoading || !courseDetail || isLoadingTopics)
    return <Spin className='flex justify-center items-center h-screen' />;

  const stats = {
    totalLessons: courseDetail.totalLessons,
    totalDuration: courseDetail.totalDuration,
    rating: 0,
    reviewCount: 0,
  };

  const handleContinueWatching = () => {
    if (lastWatchedVideo) {
      for (const topic of topics || []) {
        const foundLesson = topic.lessons?.find(
          lesson => lesson.id.toString() === lastWatchedVideo.lessonId
        );
        if (foundLesson) {
          handleLessonSelect(foundLesson);
          break;
        }
      }
      setShowContinueModal(false);
    }
  };

  const handleStartFromBeginning = () => {
    const firstLesson = findFirstLesson();
    if (firstLesson) {
      handleLessonSelect(firstLesson);
    }
    setShowContinueModal(false);
  };

  return (
    <div className='max-w-screen-xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6'>
      {isAuthenticated && enrollmentCheck?.isEnrolled && <ProgressSyncer courseId={id} />}
      
      {enrollmentCheck?.isEnrolled && (
        <ContinueWatchingModal
          lastWatchedVideo={lastWatchedVideo}
          isOpen={showContinueModal}
          onClose={handleStartFromBeginning}
          onContinue={handleContinueWatching}
        />
      )}
      
      <div className='lg:col-span-2'>
        <CourseDetailHeader
          videoIntroUrl={selectedLesson ? selectedLesson.videoUrl : courseDetail.videoIntroUrl}
          title={courseDetail.title}
          category={courseDetail.categories[0].name}
          stats={stats}
          isThumbnail={selectedLesson ? false : true}
          courseId={id}
          selectedLessonIndex={selectedLessonIndex}
          onVideoPlay={() => selectedLesson && handleLessonSelect(selectedLesson)}
          currentLesson={selectedLesson || undefined}
          topics={topics}
          courseTitle={courseDetail.title}
          currentTopicId={selectedTopicId}
          currentProgress={enrollmentCheck?.progress || 0}
        />
        <CourseDetailTabs
          description={courseDetail.description}
          learningPoints={courseDetail.topics.map((topic) => topic.title)}
          author={courseDetail.instructor}
          reviews={[]}
        />
      </div>
      <CourseDetailContent
        sections={topics || []}
        onLessonSelect={handleLessonSelect}
        courseId={id}
      />
    </div>
  );
};

export default CourseDetail;
