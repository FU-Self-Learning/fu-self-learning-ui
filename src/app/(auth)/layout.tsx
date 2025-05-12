"use client";

import { ReactNode, useEffect } from "react";
import { redirect } from "next/navigation";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/providers/auth/selector/authSelector";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  useEffect(() => {
    if (isAuthenticated) {
      redirect("/");
    }
  }, [isAuthenticated]);

  return <main className="auth-main">{children}</main>;
}
