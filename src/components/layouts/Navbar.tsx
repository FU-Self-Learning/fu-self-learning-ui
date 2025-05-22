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
      <div className="h-[0.1px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 800 80"
          className="w-full mb-1"
          style={{
            filter: "drop-shadow( 0px 3px rgba(0, 0, 0, 0.4))",
          }}
        >
          <path
            fill="#0A092D"
            fillOpacity="1"
            transform="scale(1, -1) translate(0, -47)"
            d="M0,40 
     Q10,42 20,41 
     Q30,39 40,40 
     Q50,42 60,41 
     Q70,39 80,40 
     Q90,41 100,40 
     Q110,42 120,40 
     Q130,39 140,41 
     Q150,42 160,40 
     Q170,41 180,40 
     Q190,39 200,40 
     Q210,42 220,40 
     Q230,41 240,39 
     Q250,40 260,41 
     Q270,42 280,40 
     Q290,39 300,41 
     Q310,42 320,40 
     Q330,41 340,39 
     Q350,40 360,41 
     Q370,42 380,40 
     Q390,39 400,41 
     Q410,42 420,40 
     Q430,41 440,39 
     Q450,40 460,41 
     Q470,42 480,40 
     Q490,39 500,41 
     Q510,42 520,40 
     Q530,41 540,39 
     Q550,40 560,41 
     Q570,42 580,40 
     Q590,39 600,41 
     Q610,42 620,40 
     Q630,41 640,39 
     Q650,40 660,41 
     Q670,42 680,40 
     Q690,39 700,41 
     Q710,42 720,40 
     Q730,41 740,39 
     Q750,40 760,41 
     Q770,42 780,40 
     Q790,39 800,41 
     V80 H0 Z"
          />
        </svg>
      </div>
    </div >
  );
}