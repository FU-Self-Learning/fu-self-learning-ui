'use client';

import { Carousel } from 'antd';
import Card from './Card';
import linhtran from "@p/svgs/linhtran.svg"
import fort from "@p/svgs/Fort.svg"
import Ethan from "@p/svgs/Ethan.svg"
import ThuyT from "@p/svgs/ThuyT.svg"
import Ellip from "@p/svgs/Ellip.svg"
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useRef, useState } from 'react';






const dataCommunicationFBack = [
    {
        name: 'Linh Tran',
        email: '@linhtran@gmail.com',
        avt: fort,
        content: 'This platform helps me organize my study group effortlessly. I can share resources and track progress with ease.',
    },
    {
        name: 'Minh Nguyen',
        email: '@minhnguyen@gmail.com',
        avt: linhtran,
        content: 'User-friendly interface. I love the flashcard feature. It’s quick and easy to create and review my cards.',
    },
    {
        name: 'Trang Le',
        email: '@trangle@gmail.com',
        avt: Ethan,

        content: 'I use it for tutoring sessions. It saves me a lot of time organizing and sharing resources with my students.',
    },
    {
        name: 'Huy Pham',
        email: '@huypham.@gmail.com',
        avt: linhtran,
        content: 'Tried the free version, loved it, and upgraded the next day! The extra features are definitely worth it.',
    },
    {
        name: 'Duy Vo',
        email: '@duyvo@gmail.com',
        avt: ThuyT,
        content: 'Our team can study and collaborate from anywhere. Real-time sharing of ideas and resources is fantastic.',
    },
    {
        name: 'Mai Dang',
        email: '@maidang@gmail.com',
        avt: Ellip,
        content: 'Great experience overall. It’s a must-have for anyone looking to improve their study habits or productivity.',
    },
];



export default function CommunicationSection() {
    const carouselRef = useRef<any>(null);
    const [current, setCurrent] = useState<number>(0);

    const prev = () => carouselRef.current?.prev();
    const next = () => carouselRef.current?.next();

    return (
        <div className="max-w-7xl mx-auto my-[200px] relative">
            <button
                onClick={prev}
                className="absolute top-1/2 left-[-40px] -translate-y-1/2 z-10 bg-[#0A092D] cursor-pointer text-white p-3 rounded-full shadow-lg transition-transform transition-colors duration-300 ease-in-out hover:bg-[#070624] hover:scale-110 active:scale-95"
                aria-label="Previous"
            >
                <LeftOutlined />
            </button>

            <button
                onClick={next}
                className="absolute top-1/2 right-[-40px] -translate-y-1/2 z-10 bg-[#0A092D] cursor-pointer text-white p-3 rounded-full shadow-lg transition-transform transition-colors duration-300 ease-in-out hover:bg-[#070624] hover:scale-110 active:scale-95"
                aria-label="Next"
            >
                <RightOutlined />
            </button>


            <Carousel
                ref={carouselRef}
                dots={true}
                slidesToShow={3}
                slidesToScroll={3}
                afterChange={setCurrent}
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
                        <Card
                            name={item.name}
                            email={item.email}
                            content={item.content}
                            avt={item.avt}
                        />
                    </div>
                ))}
            </Carousel>
        </div>
    );
}


