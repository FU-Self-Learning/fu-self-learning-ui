"use client";

import Link from "next/link";
import DarkModeToggle from "../common/DarkModeToggle";
import { Button, Dropdown, MenuProps } from "antd";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { UserOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useProfileLocal } from "@/hooks/auth/useProfile";
import { AppDispatch } from "@/providers/store";
import { setUser } from "@/providers/auth/reducer/authSlice";
import { isObjectEmpty } from "@/utils/isObjectEmpty";
export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useProfileLocal();
 
  useEffect(() => {
    if (!isObjectEmpty(user)) {
      console.log(user, "user from profile");
      dispatch(setUser(user));
    }
  }, [user, dispatch]);

  const renderHeaderLogin = () => {
    return (
      <>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link href="/login">
            <Button
              type="link"
              className="hover:text-yellow-300 transition-colors !font-bold text-white"
            >
              Login
            </Button>
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link href="/register">
            <Button
              type="link"
              className="hover:text-yellow-300 transition-colors !font-bold text-white"
            >
              Register
            </Button>
          </Link>
        </motion.div>
      </>
    );
  };
  const renderHeader = () => {
    const items: MenuProps["items"] = [
      {
        key: "profile",
        label: <Link href="/profile">Profile</Link>,
      },
      {
        key: "logout",
        label: (
          <button
            onClick={() => {
              console.log("Logout click");
            }}
            className="w-full text-left"
          >
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
            {user?.name}{" "}
            <motion.span transition={{ duration: 0.2 }} className="ml-1">
              <UserOutlined />
            </motion.span>
          </Button>
        </motion.div>
      </Dropdown>
    );
  };
  return (
    <header className="bg-gradient-to-l from-blue-800 to-black text-white px-8 py-6 flex justify-between items-center shadow-lg">
      <div className="flex items-center space-x-3">
        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.95 }}>
          <span role="img" aria-label="music">
            🎧
          </span>
        </motion.div>
        <h1 className="font-semibold text-2xl">SoundClient</h1>
      </div>

      <nav className="flex space-x-6">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link href="/">
            <Button
              type="link"
              className="hover:text-yellow-300 transition-colors !font-bold text-white"
            >
              Home
            </Button>
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link href="/browse">
            <Button
              type="link"
              className="hover:text-yellow-300 transition-colors !font-bold !text-white"
            >
              Browse
            </Button>
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link href="/playlist/1">
            <Button
              type="link"
              className="hover:text-yellow-300 transition-colors !font-bold !text-white"
            >
              Playlist
            </Button>
          </Link>
        </motion.div>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <DarkModeToggle />
        </motion.div>

        {/* Login and Register Links */}
        {user ? renderHeader() : renderHeaderLogin()}
      </nav>
    </header>
  );
}
