'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStorageData } from '@/shared/store';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = getStorageData('accessToken');
    setAuthenticated(!!token);
  }, []);

  if (authenticated === null) {
    return null;
  }

  if (!authenticated) {
    router.push('/login');
    return null;
  }

  return <>{children}</>;
};

export default PrivateRoute;
