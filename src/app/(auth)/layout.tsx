"use client";

import { selectIsAuthenticated } from "@/providers/auth/selector/authSelector";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

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
  return (
    <motion.div
      initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, x: 20, filter: "blur(10px)" }}
      transition={{ 
        duration: 0.4,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
}
