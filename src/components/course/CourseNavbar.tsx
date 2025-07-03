'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const navItems = [
  { label: 'Home', href: '/course' },
  { label: 'My Learning', href: '/course/my-learning' },
  { label: 'Catalog', href: '/course/catalog' },
  { label: 'Favorites', href: '/course/favorites' },
];

export default function CourseNavbar() {
  const pathname = usePathname();

  return (
    <nav className='bg-white border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          <div className='flex space-x-8'>
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-base font-medium px-2 py-1 rounded transition-colors duration-150 ${
                    isActive
                      ? 'text-black border-b-2 border-black'
                      : 'text-gray-500 hover:text-black hover:border-b-2 hover:border-black'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
