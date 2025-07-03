import InstructorSidebar from '@/components/instructor/InstructorSidebar';

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='bg-gray-50 flex'>
      <InstructorSidebar />
      <div className='flex-1 px-50 py-10'>{children}</div>
    </div>
  );
}
