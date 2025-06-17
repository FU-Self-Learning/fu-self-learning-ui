// components/CourseCard.tsx
import React from "react";

interface CourseCardProps {
  title: string;
  description: string;
  imageSrc: string;
  link: string;
  actions?: React.ReactNode[];
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  imageSrc,
  link,
  actions,
}) => {
  return (
    <div className="flex border shadow-md px-12 py-17 hover:shadow-lg transition bg-white w-full">
      <img
        src={imageSrc}
        alt={title}
        className="w-32 h-32 object-contain mr-4"
      />
      <div className="flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <div className="flex justify-between items-center">
          {!actions && (
            <a
              href={link}
              className="mt-2 text-violet-600 font-medium hover:underline"
            >
              Get Started
            </a>
          )}
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
