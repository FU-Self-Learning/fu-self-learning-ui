"use client"

import Link from "next/link";
import { useEffect, useState } from "react";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = !!localStorage.getItem("theme"); // hoặc token nếu bạn đang kiểm tra đăng nhập
    setAuthenticated(auth);
  }, []);

  if (authenticated === null) {
    return null; // hoặc spinner, loading...
  }

  if (!authenticated) {
    return <Link href="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
