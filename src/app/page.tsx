"use client";
import Image from "next/image";
import Student from "@p/images/student.png";
import Teacher from "@p/images/teacher.png";
import Coding from "@p/images/coding.png";
import Messenger from "@p/images/messenger.gif";

import Bg from "@p/images/background.png";
// import { useRouter } from "next/navigation";

import BenefitSection from "@/components/homePage/benefitSection/index";
import PopularQuestion from "@/components/homePage/popularQuestion/index";
import MembershipSection from "@/components/homePage/membershipSection/index";
import CommunicationSection from "@/components/homePage/communicationSection/index";
import { motion } from "framer-motion";

export default function HomePage() {
  //   const router = useRouter();
  return (
    <>
      <div className="relative w-full h-[700px] bg-[#1a0541] overflow-hidden">
        <Image src={Bg} alt="background" fill className="object-cover z-0" />
        <div className="absolute top-20 left-20 max-w-xl z-10">
          <h1 className="text-4xl font-bold text-white mb-2">
            Khóa học lập trình thực chiến cho người mới bắt đầu
          </h1>
          <h2 className="text-3xl font-bold text-[#00ff84] underline underline-offset-4 mb-4">
            Uy tín – Chất lượng – Học là hiểu
          </h2>
          <p className="text-white mb-4 text-lg leading-relaxed">
            Tiếp cận các khóa học lập trình từ cơ bản đến nâng cao với phương
            pháp dễ hiểu, thực hành ngay trong quá trình học.
            <br />
            Hỗ trợ 1-1 cùng giảng viên, cập nhật kiến thức mới nhất theo xu
            hướng.
          </p>
          <div className="flex gap-4 mb-6">
            <button className="bg-[#6c4cff] text-white px-8 py-2 rounded-md font-semibold hover:bg-[#4b2fff] transition">
              Đăng ký ngay
            </button>
            <button className="border border-[#00ff84] text-[#00ff84] px-8 py-2 rounded-md font-semibold hover:bg-[#00ff8420] transition">
              Xem phản hồi học viên
            </button>
          </div>
          <div className="flex gap-8 text-white text-base">
            <div className="flex items-center gap-2">
              <span>🎓</span> Tải tài liệu, video học tập trọn đời
            </div>
            <div className="flex items-center gap-2">
              <span>📹</span> Nội dung cập nhật liên tục
            </div>
            <div className="flex items-center gap-2">
              <span>🔒</span> Truy cập không giới hạn mọi lúc, mọi nơi
            </div>
          </div>
        </div>

        <div className="absolute right-50 top-20 flex flex-col gap-6 items-end z-10">
          <div className="flex gap-6">
            <motion.div
              whileHover={{
                rotate: [0, -5, 5, -5, 5, 0],
                transition: { duration: 0.5, repeat: 0 },
              }}
              className="relative"
            >
              <Image
                src={Student}
                alt="student"
                className="rounded-xl w-[340px] h-[340px] object-cover"
              />
              <motion.div
                className="absolute -bottom-8 left-0 bg-white/90 rounded-lg px-6 py-4 shadow-lg flex items-center gap-3 cursor-pointer"
                style={{ minWidth: 220 }}
              >
                <span className="text-2xl text-[#ff5e5e]">💼</span>
                <div>
                  <div className="text-[#ff5e5e] font-bold">3.000 +</div>
                  <div className="text-gray-700 text-sm">
                    Khóa học chất lượng
                  </div>
                </div>
              </motion.div>
            </motion.div>
            <motion.div
              whileHover={{
                rotate: [0, -5, 5, -5, 5, 0],
                transition: { duration: 0.5, repeat: 0 },
              }}
              className="relative"
            >
              <Image
                src={Teacher}
                alt="teacher"
                className="rounded-xl w-[180px] h-[180px] object-cover"
              />
            </motion.div>
          </div>
          <div className="flex gap-6 items-center">
            <motion.div
              whileHover={{
                rotate: [0, -5, 5, -5, 5, 0],
                transition: { duration: 0.5, repeat: 0 },
              }}
              className="relative"
            >
              <Image
                src={Coding}
                alt="coding"
                className="rounded-xl w-[120px] h-[120px] object-cover"
              />
              <motion.div
                className="absolute -bottom-14 left-0 bg-white/90 rounded-lg px-6 py-4 shadow-lg flex items-center gap-3 cursor-pointer"
                style={{ minWidth: 220 }}
              >
                <span className="text-2xl text-[#4255ff]">🏅</span>
                <div>
                  <div className="text-[#4255ff] font-bold">Đạt được</div>
                  <div className="text-gray-700 text-sm">
                    Nhiều đánh giá tích cực
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="bg-[#F5F3EA]  flex w-full flex-col justify-center  items-center">
        <BenefitSection />
        <MembershipSection />
        <PopularQuestion />
        <CommunicationSection />
      </div>
      <a
        href="https://www.facebook.com/profile.php?id=61578017242305"
        target="_blank"
        rel="noopener noreferrer"
      >
        <motion.div
          whileHover={{
            rotate: [0, -5, 5, -5, 5, 0],
            transition: { duration: 0.5, repeat: 0 },
          }}
          className="fixed bottom-7 right-20 z-50 cursor-pointer"
        >
          <Image src={Messenger} alt="Messenger" width={60} height={60} />
        </motion.div>
      </a>
    </>
  );
}
