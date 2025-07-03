import Menu from '@/components/socialPage/menu';
import ListFollowingPage from '@/components/socialPage/menu/listFollowing';

type SocialLayoutProps = {
  children: React.ReactNode;
};

export default function SocialLayout({ children }: SocialLayoutProps) {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-50'>
      <div className='container mx-auto px-4 py-8'>
        <div className='flex justify-center gap-8'>
          <Menu />
          <main className='flex-1 max-w-3xl bg-white rounded-2xl shadow-lg p-6'>{children}</main>
          <ListFollowingPage />
        </div>
      </div>
    </div>
  );
}
