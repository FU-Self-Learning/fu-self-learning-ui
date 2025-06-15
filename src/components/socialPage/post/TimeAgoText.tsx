"use client";

import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface TimeAgoTextProps {
    date: string | Date;
}

const TimeAgoText: React.FC<TimeAgoTextProps> = ({ date }) => {
    if (!date) return null;

    const timeAgo = dayjs(date).fromNow();
    return <span>{timeAgo}</span>;
};

export default TimeAgoText;
