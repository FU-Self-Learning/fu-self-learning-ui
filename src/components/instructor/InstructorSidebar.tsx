'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  VideoCameraOutlined,
  MessageOutlined,
  BarChartOutlined,
  ToolOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import React from 'react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: 'Courses',
    href: '/instructor',
    icon: <VideoCameraOutlined />,
  },
  {
    label: 'Messages',
    href: '/instructor/messages',
    icon: <MessageOutlined />,
  },
  {
    label: 'Analytics',
    href: '/instructor/analytics',
    icon: <BarChartOutlined />,
  },
  {
    label: 'Tools',
    href: '/instructor/tools',
    icon: <ToolOutlined />,
  },
  {
    label: 'Help',
    href: '/instructor/help',
    icon: <QuestionCircleOutlined />,
  },
];

const NavLink = ({ item, isActive }: { item: NavItem; isActive: boolean }) => (
  <Link
    href={item.href}
    className={`flex items-center space-x-3 px-3 py-3 rounded-md text-lg font-bold transition-colors ${
      isActive ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-gray-800'
    }`}
  >
    <span className='text-xl'>{item.icon}</span>
    <span className='opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap'>
      {item.label}
    </span>
  </Link>
);

export default function InstructorSidebar() {
  const pathname = usePathname();

  return (
    <aside className='w-20 hover:w-60 min-h-screen bg-black text-white py-6 px-4 transition-all duration-300 group'>
      <nav className='flex flex-col space-y-4'>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return <NavLink key={item.label} item={item} isActive={isActive} />;
        })}
      </nav>
    </aside>
  );
}
