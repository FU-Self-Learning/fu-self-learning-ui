// components/CourseCard.tsx
import { Image } from 'antd';
import React from 'react';

interface CourseCardProps {
  title: string;
  description: string;
  imageSrc: string;
  link: string;
  actions?: React.ReactNode[];
}

const CourseCard: React.FC<CourseCardProps> = ({ title, description, imageSrc, link, actions }) => {
  return (
    <div className='flex border shadow-md px-6 py-10 hover:shadow-lg transition bg-white w-full min-h-0'>
      <Image
        preview={false}
        src={imageSrc}
        alt={title}
        className='w-24 h-24 object-contain mr-4 flex-shrink-0'
      />
      <div className='flex flex-col justify-between min-w-0 flex-1'>
        <div className='mb-2'>
          <h3 className='text-lg font-semibold mb-2 truncate'>{title}</h3>
          <p className='text-sm text-gray-600 line-clamp-2'>{description}</p>
        </div>
        <div className='flex justify-between items-center min-w-0'>
          {!actions && (
            <a href={link} className='text-violet-600 font-medium hover:underline flex-shrink-0'>
              Get Started
            </a>
          )}
          {actions && (
            <div className='flex gap-2 flex-wrap justify-end min-w-0 flex-1'>{actions}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
