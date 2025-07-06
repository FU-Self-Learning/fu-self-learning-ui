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
    <div className='flex border rounded-xl shadow-md px-6 py-6 hover:shadow-lg transition bg-white w-full min-h-[140px] max-w-md mx-auto'>
      <div className='flex-shrink-0 flex items-center justify-center h-24 w-24 mr-5'>
        <Image
          preview={false}
          src={imageSrc}
          alt={title}
          width={96}
          height={96}
          className='w-24 h-24 object-cover rounded-lg border bg-gray-100'
        />
      </div>
      <div className='flex flex-col justify-between min-w-0 flex-1 h-full'>
        <div className='mb-2 min-w-0'>
          <h3 className='text-lg font-semibold mb-1 truncate' title={title}>
            {title}
          </h3>
          <p
            className='text-sm text-gray-600 line-clamp-2 break-words max-w-full'
            title={description}
          >
            {description}
          </p>
        </div>
        <div className='flex justify-end items-center min-w-0 mt-2'>
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
