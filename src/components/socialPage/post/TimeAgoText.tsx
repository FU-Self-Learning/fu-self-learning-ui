'use client';

import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

dayjs.extend(relativeTime);
dayjs.extend(utc);

interface TimeAgoTextProps {
  date: string | Date;
}

const getTimeAgoText = (date: dayjs.Dayjs, now: dayjs.Dayjs): string => {
  // Trừ đi 7 giờ khỏi currentTime
  const adjustedNow = now.subtract(7, 'hour');

  if (date.isAfter(adjustedNow)) return 'Just now';

  const diffInSeconds = adjustedNow.diff(date, 'second');
  if (diffInSeconds < 5) return 'Just now';
  if (diffInSeconds < 60) return 'a few seconds ago';

  const diffInMinutes = adjustedNow.diff(date, 'minute');
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = adjustedNow.diff(date, 'hour');
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = adjustedNow.diff(date, 'day');
  if (diffInDays < 7) return `${diffInDays}d ago`;

  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}mo ago`;

  return `${Math.floor(diffInDays / 365)}y ago`;
};

const TimeAgoText = ({ date }: TimeAgoTextProps) => {
  const now = dayjs(); // local time
  const postDate = dayjs(date).utc().local(); // convert từ UTC → local (GMT+7)

  console.log('now:', now.toString());
  console.log('postDate:', postDate.toString());

  if (!postDate.isValid()) return <span>Invalid date</span>;

  return <span>{getTimeAgoText(postDate, now)}</span>;
};

export default TimeAgoText;
