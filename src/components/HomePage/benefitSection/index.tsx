
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import fast_easy from "@p/svgs/fast_easy.svg";
import lovely from "@p/svgs/lovely.svg";
import effective from "@p/svgs/effective.svg";

import CardBenefit from "./CardBenefit";

import managements from "@p/svgs/management.svg";
import infinity from "@p/svgs/infinity.svg";
import security from "@p/svgs/security.svg";
import touch_real_time from "@p/svgs/touch_real_time.svg";
import setting from "@p/svgs/setting.svg";
import Section from "@/components/common/Section";


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
            <div className="flex flex-col items-center bg-[#F5F3EA] w-full h-auto font-bold overflow-hidden">
                <div ref={ref}>
                    <div className="container px-5 pb-0 pt-10 sm:px-8 sm:pb-0 sm:pt-12 md:px-10 md:pb-0 md:pt-14 lg:px-[60px] lg:pb-0 lg:pt-28">
                        <ul className="flex flex-col justify-between gap-10 sm:flex-col text-black font-bold md:flex-row lg:flex-row">
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
                                            className="text-left font-title text-xl sm:text-2xl md:text-center md:text-3xl lg:text-center lg:text-3xl font-semibold"
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
                <div className="bg-[#F5F3EA]">
                    <Section title="And so much more"
                        subTitle="Use it effectively to make a difference.">
                        <div className="grid grid-rows-2 gap-10 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                            {benefitMore.map((item, index) => (
                                <CardBenefit key={index} data={item} ref={ref} />
                            ))}
                        </div>
                    </Section>
                </div>
            </div>

        </>

    );
}