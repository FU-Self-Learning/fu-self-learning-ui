
"use client";
import Section from "@/components/productSection/Section";
// import { animate } from "framer-motion";
import Card from "./Card";
import { useEffect, useRef, useState } from "react";


const data = [
    {
        id: 1,
        title: "Free",
        description:
            "Perfect for trying out basic features or starting with group study.",
        price: 0,
        features: [
            "Create up to 3 study groups",
            "Basic course access",
            "Community forum support",
        ],
        labelColor: "yellow",
        animate: {
            x: -20,
            y: 0,
            opacity: 0,
        },
    },
    {
        id: 2,
        title: "Advanced",
        description:
            "Ideal for expanding study groups and using advanced features.",
        price: 100000,
        features: [
            "Unlimited group creation",
            "Access to premium learning resources",
            "Email and live chat support",
            "Schedule assignments and reminders",
        ],
        isBestSeller: true,
        labelColor: "red",
        animate: {
            x: 0,
            y: 20,
            opacity: 0,
        },
    },
    {
        id: 3,
        title: "Professional",
        description:
            "Designed for intensive study groups with higher learning needs.",
        price: 500000,
        features: [
            "Custom group branding",
            "Dedicated learning assistant",
            "Advanced performance tracking",
        ],
        labelColor: "green",
        animate: {
            x: 20,
            y: 0,
            opacity: 0,
        },
    },
];


export default function MembershipSection() {
    const ref = useRef(null);
    const [hidden, setHidden] = useState(true);
    const handleResize = ({ target }: UIEvent) => {
        setHidden((target as Window)?.innerWidth < 1024);
    };
    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [hidden]);
    useEffect(() => {
        setHidden(innerWidth < 1024);
    }, []);

    return (
        <div className="flex justify-center items-center w-[1540px] h-[800px] m-auto  ">
            <Section
                title="Account Packages"
                subTitle="Start learning completely free of charge. <br/> Upgrade your account to unlock more amazing features!"
            >
                <div
                    ref={ref}
                    className="flex w-full flex-col items-stretch gap-8 lg:flex-row lg:items-center h-full"
                >
                    {data.map((item, index) => (
                        <Card key={index} data={item} ref={ref} hidden={hidden} />
                    ))}
                </div>
                <div id="developers"></div>
            </Section>
        </div>
    )
}