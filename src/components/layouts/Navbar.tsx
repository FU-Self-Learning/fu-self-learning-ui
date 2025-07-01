"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import DarkModeToggle from "../common/DarkModeToggle";
import { Button, Dropdown, MenuProps, message, Spin } from "antd";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { UserOutlined } from "@ant-design/icons";
import Image from "next/image";
import Login from "@p/svgs/logo.svg";
import { logout } from "@/providers/auth/reducer/authSlice";
import { getStorageData } from "@/shared/store";
import { useHasMounted } from "@/hooks/useHasMounted";

export default function Navbar() {
  const dispatch = useDispatch();
  const hasMounted = useHasMounted();
  const user = getStorageData("user");
  const router = useRouter();
  const pathname = usePathname();

  if (!hasMounted) {
    return <Spin className="h-screen flex justify-center items-center" />;
  }

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    message.success("Logout successfully");
    router.push("/login");
  };

  const renderHeaderLogin = () => (
    <>
      {["/login", "/register"].map((path) => (
        <motion.div
          key={path}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href={path}>
            <Button
              type="link"
              className={`transition-colors !font-bold ${
                pathname === path ? "text-yellow-300" : "text-white"
              }`}
            >
              {path === "/login" ? "Login" : "Register"}
            </Button>
          </Link>
        </motion.div>
      ))}
    </>
  );

  const renderHeader = () => {
    const items: MenuProps["items"] = [
      {
        key: "profile",
        label: <Link href="/profile">Profile</Link>,
      },
      {
        key: "instructor",
        label: <Link href="/instructor">Instructor</Link>,
        style: user?.role !== "instructor" ? { display: "none" } : {},
      },
      {
        key: "logout",
        label: (
          <button onClick={handleLogout} className="w-full text-left">
            Logout
          </button>
        ),
      },
    ];

    return (
      <Dropdown menu={{ items }} placement="bottomRight" trigger={["click"]}>
        <motion.div
          className="cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            type="link"
            className="hover:text-yellow-300 transition-colors !font-bold text-white flex items-center"
          >
            {user?.username}
            <motion.span transition={{ duration: 0.2 }} className="ml-1">
              <UserOutlined />
            </motion.span>
          </Button>
        </motion.div>
      </Dropdown>
    );
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/course", label: "My Learning" },
    { href: "/social", label: "Social" },
    { href: "/doExam", label: "Do exam" },
    { href: "/flashcards", label: "Flashcards" },
  ];

  return (
    <div>
      <header className="bg-gradient-to-l bg-[#0A092D] text-white px-8 py-6 flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-3 mt-4">
          <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.95 }}
            className="flex"
          >
            <span role="img" aria-label="music">
              <Image
                onClick={() => router.push("/")}
                src={Login}
                alt="logo"
                className="!w-10 !h-10 !cursor-pointer"
              />
            </span>
            <Button
              type="link"
              className="cursor-pointer"
              onClick={() => router.push("/")}
            >
              <span className="font-semibold text-2xl">Eduhub</span>
            </Button>
          </motion.div>
        </div>

        <nav className="flex items-center space-x-6 mt-4">
          {navLinks.map(({ href, label }) => (
            <motion.div
              key={href}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={href}>
                <Button
                  type="link"
                  className={`transition-colors !font-bold ${
                    pathname === href || pathname.startsWith(href + "/")
                      ? "!text-blue-500 !font-bold"
                      : "!text-white"
                  }`}
                >
                  {label}
                </Button>
              </Link>
            </motion.div>
          ))}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <DarkModeToggle />
          </motion.div>
          {user ? renderHeader() : renderHeaderLogin()}
        </nav>
      </header>
    </div>
  );
}
