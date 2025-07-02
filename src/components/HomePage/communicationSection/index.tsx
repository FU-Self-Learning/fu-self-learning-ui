"use client";

import { Carousel } from "antd";
import CardCommunication from "./CardCommunication";
import linhtran from "@p/svgs/linhtran.svg";
import fort from "@p/svgs/Fort.svg";
import Ethan from "@p/svgs/Ethan.svg";
import ThuyT from "@p/svgs/ThuyT.svg";
import Ellip from "@p/svgs/Ellip.svg";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useRef } from "react";
import { CarouselRef } from "antd/es/carousel";
import { ChatBoxAi } from "@/components/chatbot";

const dataCommunicationFBack = [
  {
    name: "Linh Trần",
    email: "linhtran@gmail.com",
    avt: fort,
    content:
      "Nền tảng này giúp mình tổ chức nhóm học rất tiện lợi, chia sẻ tài liệu và theo dõi tiến độ dễ dàng. Tuy nhiên, đôi khi tốc độ tải hơi chậm khi nhiều người cùng truy cập.",
  },
  {
    name: "Minh Nguyễn",
    email: "minhla@fpt.edu.vn",
    avt: linhtran,
    content:
      "Giao diện dễ dùng, mình rất thích tính năng flashcard. Tạo và ôn bài rất nhanh. Còn thiếu một số chức năng như nhắc nhở lịch học.",
  },
  {
    name: "Trang Lê",
    email: "trangle@gmail.com",
    avt: Ethan,
    content:
      "Mình dùng để dạy kèm học sinh, tiết kiệm rất nhiều thời gian trong việc tổ chức và chia sẻ tài liệu. Tuy nhiên, tính năng tìm kiếm còn hơi hạn chế.",
  },
  {
    name: "Huy Phạm",
    email: "huypham@gmail.com",
    avt: linhtran,
    content:
      "Mình dùng thử bản miễn phí thấy rất ổn nên nâng cấp ngay hôm sau! Các tính năng thêm rất đáng giá, nhưng phần chat chưa có nên hơi hạn chế",
  },
  {
    name: "Duy Võ",
    email: "duylea@fpt.edu.vn",
    avt: ThuyT,
    content:
      "Nhóm mình có thể học và làm việc nhóm từ xa rất hiệu quả. Chia sẻ tài liệu theo thời gian thực rất tiện. Chỉ mong thêm chức năng chat nhóm trực tiếp thì sẽ hoàn hảo.",
  },
  {
    name: "Mai Đặng",
    email: "maidang@gmail.com",
    avt: Ellip,
    content:
      "Trải nghiệm nhìn chung rất tốt. Đây là công cụ nên có nếu bạn muốn cải thiện thói quen học tập. Mong rằng trong tương lai sẽ có thêm tích hợp lịch học tự động.",
  },
];

export default function CommunicationSection() {
  const carouselRef = useRef<CarouselRef | null>(null);
  const prev = () => carouselRef.current?.prev();
  const next = () => carouselRef.current?.next();

  return (
    <div className="max-w-7xl mx-auto my-[200px] relative flex flex-col gap-[100px] ">
      <ChatBoxAi />
      <div className="text-4xl font-bold text-black flex justify-center">
        Feedback about Eduhub
      </div>
      <div>
        <button
          onClick={prev}
          className="absolute top-1/2 left-[-40px] -translate-y-1/2 z-10 bg-[#0A092D] cursor-pointer text-white p-3 rounded-full shadow-lg transition-transform  duration-300 ease-in-out hover:bg-[#070624] hover:scale-110 active:scale-95"
          aria-label="Previous"
        >
          <LeftOutlined />
        </button>
        <button
          onClick={next}
          className="absolute top-1/2 right-[-40px] -translate-y-1/2 z-10 bg-[#0A092D] cursor-pointer text-white p-3 rounded-full shadow-lg transition-transform  duration-300 ease-in-out hover:bg-[#070624] hover:scale-110 active:scale-95"
          aria-label="Next"
        >
          <RightOutlined />
        </button>

        <Carousel
          ref={carouselRef}
          dots={true}
          slidesToShow={3}
          slidesToScroll={3}
          responsive={[
            {
              breakpoint: 1024,
              settings: { slidesToShow: 2, slidesToScroll: 2 },
            },
            {
              breakpoint: 640,
              settings: { slidesToShow: 1, slidesToScroll: 1 },
            },
          ]}
        >
          {dataCommunicationFBack.map((item, index) => (
            <div key={index} className="px-3">
              <CardCommunication
                name={item.name}
                email={item.email}
                content={item.content}
                avt={item.avt}
              />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}
