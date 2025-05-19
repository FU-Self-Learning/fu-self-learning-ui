
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import fast_easy from "@p/svgs/fast_easy.svg";
import lovely from "@p/svgs/lovely.svg";
import effective from "@p/svgs/effective.svg";

import Card from "./Card/index";

import managements from "@p/svgs/management.svg";
import infinity from "@p/svgs/infinity.svg";
import security from "@p/svgs/security.svg";
import touch_real_time from "@p/svgs/touch_real_time.svg";
import setting from "@p/svgs/setting.svg";
import Section from "../productSection/Section";


const benefitMore = [
    {
        title: "Easy Team Management",
        description:
            "Organize and manage teams, projects, and folders visually and effectively.",
        animate: {
            translateX: [-200, 0, 0],
            translateY: [-200, 0, 0],
        },
        icon: () => (
            <Image
                src={managements}
                alt="management"
                width={100}
                height={100}
                className="w-7 md:w-11 lg:w-11"
            />
        ),
    },
    {
        title: "Powerful Tool Integration",
        description:
            "Connect and use powerful tools to boost your productivity.",
        animate: {
            translateX: [0, 0, 0],
            translateY: [-200, 0, 0],
        },
        icon: () => (
            <Image
                src={infinity}
                alt="integration"
                width={100}
                height={100}
                className="w-9 md:w-12 lg:w-14"
            />
        ),
    },
    {
        title: "Real-Time Collaboration",
        description:
            "Collaborate and share ideas with teammates in real time without interruptions.",
        animate: {
            translateX: [200, 0, 0],
            translateY: [-200, 0, 0],
        },
        icon: () => (
            <Image
                src={touch_real_time}
                alt="collaboration"
                width={100}
                height={100}
                className="w-5 md:w-6 lg:w-7"
            />
        ),
    },
    {
        title: "Top-Notch Security",
        description:
            "Keep your data safe with world-class security standards.",
        animate: {
            translateX: [-200, 0, 0],
            translateY: [200, 0, 0],
        },
        icon: () => (
            <Image
                src={security}
                alt="security"
                width={100}
                height={100}
                className="w-7 md:w-11 lg:w-11"
            />
        ),
    },
    {
        title: "Cross-Platform Support",
        description:
            "Access and work from any device, from desktop to mobile.",
        animate: {
            translateX: [0, 0, 0],
            translateY: [200, 0, 0],
        },
        icon: () => (
            <Image
                src={managements}
                alt="cross-platform"
                width={100}
                height={100}
                className="w-7 md:w-11 lg:w-11"
            />
        ),
    },
    {
        title: "Flexible Customization",
        description:
            "Customize the interface and features to match your needs and optimize your experience.",
        animate: {
            translateX: [200, 0, 0],
            translateY: [200, 0, 0],
        },
        icon: () => (
            <Image
                src={setting}
                alt="customization"
                width={100}
                height={100}
                className="w-7 md:w-11 lg:w-11"
            />
        ),
    },
];

const benefits = [
    {
        image: fast_easy,
        title: "Fast and Easy",
        description:
            "Fast and easy so you can spend more time creating great content. Easy because no one likes complexity.",
    },
    {
        image: lovely,
        title: "Efficient and Flexible",
        description:
            "Efficient and flexible to meet all your needs. Flexible so you can work your own way.",
    },
    {
        image: effective,
        title: "Loved and Trusted",
        description:
            "Loved and trusted by millions of users around the world. Trusted so you know your data is safe.",
    },
];


export default function BenefitSection() {
    const ref = useRef(null);
    return (
        <>
            <div className="flex flex-col items-center bg-[#4682B4] w-full h-auto font-bold overflow-hidden">
                <div ref={ref}>
                    <div className="container px-5 pb-0 pt-10 sm:px-8 sm:pb-0 sm:pt-12 md:px-10 md:pb-0 md:pt-14 lg:px-[60px] lg:pb-0 lg:pt-28">
                        <ul className="flex flex-col justify-between gap-10 sm:flex-col md:flex-row lg:flex-row">
                            {benefits.map((benefit, index) => (
                                <li
                                    key={index}
                                    className="flex transform flex-row items-center justify-end gap-2 transition-transform duration-500 md:flex-col lg:flex-col"
                                >
                                    <motion.span
                                        initial={{
                                            scale: 0.75,
                                            opacity: 0,
                                        }}
                                        whileInView={{
                                            scale: 1,
                                            opacity: 1,
                                            transition: {
                                                type: "spring",
                                                bounce: 0.5,
                                                delay: 0.1,
                                                duration: 0.5,
                                            },
                                        }}
                                        viewport={{ once: true }}
                                    >
                                        <Image
                                            src={benefit.image}
                                            alt={benefit.title}
                                            width={80}
                                            height={80}
                                        />
                                    </motion.span>
                                    <div className="flex flex-col gap-0 md:gap-2 lg:gap-2">
                                        <motion.h3
                                            initial={{
                                                y: 20,
                                                scale: 0.75,
                                                opacity: 0,
                                            }}
                                            whileInView={{
                                                y: 0,
                                                scale: 1,
                                                opacity: 1,

                                                transition: {
                                                    type: "spring",
                                                    bounce: 0.5,
                                                    delay: 0.2,
                                                    duration: 0.5,
                                                },
                                            }}
                                            viewport={{ once: true }}
                                            className="text-left font-title text-xl sm:text-2xl md:text-center md:text-3xl lg:text-center lg:text-3xl"
                                        >
                                            {benefit.title}
                                        </motion.h3>
                                        <motion.p
                                            initial={{
                                                y: 20,
                                                scale: 0.75,
                                                opacity: 0,
                                            }}
                                            whileInView={{
                                                y: 0,
                                                scale: 1,
                                                opacity: 1,
                                                transition: {
                                                    type: "spring",
                                                    bounce: 0.5,
                                                    delay: 0.3,
                                                    duration: 0.5,
                                                },
                                            }}
                                            viewport={{ once: true }}
                                            className="text-left text-sm sm:text-base md:text-center md:text-base lg:text-center lg:text-base"
                                        >
                                            {benefit.description}
                                        </motion.p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="">
                    <Section title="And so much more"
                        subTitle="Use it effectively to make a difference.">
                        <div className="grid grid-rows-2 gap-10 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                            {benefitMore.map((item, index) => (
                                <Card key={index} data={item} ref={ref} />
                            ))}
                        </div>
                    </Section>
                </div>
            </div>
            <div className="w-full h-[6px]">
                <div className="">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 800 80"
                        className="w-full mb3"
                        style={{
                            filter: "drop-shadow( 0px 3px rgba(0, 0, 0, 0.4))",
                        }}
                    >
                        <path
                            fill="#4682B4"
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
            </div>
        </>

    );
}