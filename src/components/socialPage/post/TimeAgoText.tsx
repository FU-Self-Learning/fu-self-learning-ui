"use client";

import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

dayjs.extend(relativeTime);
dayjs.extend(utc);

interface TimeAgoTextProps {
    date: string | Date;
}

const TimeAgoText = ({ date }: TimeAgoTextProps) => {
    const [currentTime, setCurrentTime] = useState(dayjs().utc());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(dayjs().utc());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    if (!date) return null;
    const now = currentTime;
    const postDate = dayjs(date).utc();

    if (!postDate.isValid()) {
        return <span>Invalid date</span>;
    }
    if (postDate.isAfter(now)) {
        return <span>just now</span>;
    }

    const diffInSeconds = now.diff(postDate, 'second');

    if (diffInSeconds < 5) return <span>just now</span>;
    if (diffInSeconds < 60) return <span>a few seconds ago</span>;

    const diffInMinutes = now.diff(postDate, 'minute');
    if (diffInMinutes < 60) {
        return <span>{diffInMinutes}m</span>;
    }

    const diffInHours = now.diff(postDate, 'hour');
    if (diffInHours < 24) {
        return <span>{diffInHours}h</span>;
    }

    const diffInDays = now.diff(postDate, 'day');
    if (diffInDays < 7) {
        return <span>{diffInDays}d</span>;
    }

    const localPostDate = dayjs(date);
    const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };

    if (localPostDate.year() === dayjs().year()) {
        return <span>{localPostDate.toDate().toLocaleDateString('en-US', options)}</span>;
    }

    options.year = 'numeric';
    return <span>{localPostDate.toDate().toLocaleDateString('en-US', options)}</span>;
};

export default TimeAgoText;
