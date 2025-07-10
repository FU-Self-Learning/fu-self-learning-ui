'use client';

import React from 'react';
import { Progress, Badge } from 'antd';
import { PlayCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';
import { EnrolledCourse } from '@/types/enrollmentType';

interface EnrolledCourseCardProps {
  enrollment: EnrolledCourse;
}

export default function EnrolledCourseCard({ enrollment }: EnrolledCourseCardProps) {
  if (!enrollment || !enrollment.course) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="text-center text-gray-500">
          <p>Course data unavailable</p>
        </div>
      </div>
    );
  }

  const { course, progress = 0, completedAt, enrolledAt, certificateUrl } = enrollment;

  const getStatus = () => {
    if (completedAt) return 'completed';
    if (progress > 0) return 'in_progress';
    return 'not_started';
  };

  const status = getStatus();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'processing';
      case 'not_started':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'not_started':
        return 'Not Started';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatProgress = (progress: number) => {
    return Math.round(Number(progress));
  };

  return (
    <Link href={`/course/${course?.id || ''}`} className="block w-full">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden min-h-[420px] max-h-[420px] flex flex-col">
        <div className="relative h-48">
          <Image
            src={course?.thumbnail || '/images/banner.jpg'}
            alt={course?.title || 'Course'}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
          <div className="absolute top-3 right-3">
            <Badge
              status={getStatusColor(status) as any}
              text={getStatusText(status)}
              className="bg-white px-2 py-1 rounded-md text-xs"
            />
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <Progress
              percent={formatProgress(progress)}
              size="small"
              strokeColor="#52c41a"
              trailColor="rgba(255,255,255,0.3)"
            />
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col h-[220px]">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 h-14">
            {course?.title || 'Untitled Course'}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-10">
            {course?.description || 'No description available'}
          </p>

          <div className="flex items-center mb-3">
            <div className="relative w-6 h-6 mr-2">
              <Image
                src={course.instructor?.avatarUrl || '/images/default-avatar.png'}
                alt={course.instructor?.username || 'Instructor'}
                className="rounded-full"
                fill
                sizes="24px"
              />
            </div>
            <span className="text-sm text-gray-500 truncate flex-1">
              {course.instructor?.username || 'Unknown Instructor'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <div className="flex items-center">
              <PlayCircleOutlined className="mr-1" />
              <span>{course?.totalLessons || 0} lessons</span>
            </div>
            
            <div className="flex items-center">
              <ClockCircleOutlined className="mr-1" />
              <span className="truncate">Enroll At: {formatDate(enrolledAt)}</span>
            </div>
          </div>

          <div className="mt-auto space-y-2">
            {certificateUrl && completedAt && (
              <div>
                <a 
                  href={certificateUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  📜 View Certificate
                </a>
              </div>
            )}

            {completedAt && (
              <div className="text-xs text-green-600">
                Completed on: {formatDate(completedAt)}
              </div>
            )}

            <div className="text-center">
              <span className="text-sm font-medium text-gray-700">
                {formatProgress(progress)}% Complete
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
