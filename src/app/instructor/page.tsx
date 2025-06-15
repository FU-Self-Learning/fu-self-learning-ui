"use client";

import React from "react";
import CourseCard from "@/components/instructor/CourseCard";
import { Button, Space } from "antd";

const Header = () => (
  <div className="flex justify-between border shadow-md px-12 py-17 hover:shadow-lg transition bg-white w-full">
    <h1 className="text-2xl">Jump Into Course Creation</h1>
    <Button
      type="primary"
      size="large"
      className="!px-15 !py-5 !text-lg"
      href="/instructor/create"
    >
      Create Your Course
    </Button>
  </div>
);

export default function InstructorDashboard() {
  return (
    <div className="p-6 md:p-10">
      <Header />
      <div className="text-xl font-semibold my-20 text-center">
        Based on your experience, we think these resources will be helpful.
      </div>
      <Space direction="vertical" size={32}>
        <CourseCard
          title="Create an Engaging Course"
          description="Whether you've been teaching for years or are teaching for the first time, you can make an engaging course..."
          imageSrc="https://s.udemycdn.com/instructor/dashboard/engaging-course.jpg"
          link="#"
        />
        <Space size={32}>
          <CourseCard
            title="Create an Engaging Course"
            description="Whether you've been teaching for years or are teaching for the first time, you can make an engaging course..."
            imageSrc="https://s.udemycdn.com/instructor/dashboard/video-creation.jpg"
            link="#"
          />
          <CourseCard
            title="Create an Engaging Course"
            description="Whether you've been teaching for years or are teaching for the first time, you can make an engaging course..."
            imageSrc="https://s.udemycdn.com/instructor/dashboard/build-audience.jpg"
            link="#"
          />
        </Space>
      </Space>
    </div>
  );
}
