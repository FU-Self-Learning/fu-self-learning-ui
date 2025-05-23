"use client";

import Link from "next/link";
import DarkModeToggle from "../common/DarkModeToggle";
import { Button, Dropdown, MenuProps } from "antd";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { UserOutlined } from "@ant-design/icons";
import { RootState } from "@/providers/store";
import Image from "next/image";
import Login from "@p/svgs/logo.svg"
import { useRouter } from "next/navigation";
import OceanWave from "@/components/common/SvgsComponents/OceanWave";

export default function Navbar() {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const router = useRouter();

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
    <div className="!z-10">
      <header className="bg-gradient-to-l bg-[#0A092D] text-white px-8 py-6 flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-3 mt-4">
          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.95 }} className="flex">
            <span role="img" aria-label="music">
              <Image onClick={() => router.push("/")} src={Login} alt="logo" className="!w-10 !h-10 !cursor-pointer" />
            </span>
            <Button
              type="link"
              className="cursor-pointer"
              onClick={() => router.push("/")}
            >
              <span className="font-semibold text-2xl">Studee</span>
            </Button>

          </motion.div>

        </div>

        <nav className="flex items-center space-x-6 mt-4">
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
            <Link href="/social">
              <Button
                type="link"
                className="hover:text-yellow-300 transition-colors !font-bold !text-white"
              >
                Social
              </Button>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link href="/playlist/1">
              <Button
                type="link"
                className="hover:text-yellow-300 transition-colors !font-bold !text-white"
              >
                Do exam
              </Button>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <DarkModeToggle />
          </motion.div>
          {isAuthenticated ? renderHeader() : renderHeaderLogin()}
        </nav>
      </header>
      <OceanWave flipY={false} color="#0A092D"></OceanWave>
    </div >
  );
}