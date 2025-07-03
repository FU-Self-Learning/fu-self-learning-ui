"use client";
import { useSearchParams } from "next/navigation";
import { useCourseDetail } from "@/hooks/course/useCourseDetail";
import { Spin, Card, Button, Badge, Divider, message } from "antd";
import {
  BookOutlined,
  ClockCircleOutlined,
  PlayCircleOutlined,
  UserOutlined,
  CreditCardOutlined,
  SafetyCertificateOutlined,
  StarFilled,
} from "@ant-design/icons";
import { createOrder } from "@/shared/api/order.api";
import { useState } from "react";
import { Suspense } from "react";

const PaymentConfirm = () => {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId") || "";
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: courseDetail, isLoading } = useCourseDetail(courseId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 mx-auto bg-white rounded-full shadow-lg flex items-center justify-center">
              <Spin size="large" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-20 animate-pulse"></div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Loading Course
            </h3>
            <p className="text-gray-600">
              Please wait while we fetch the course details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!courseDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
        <Card className="text-center shadow-2xl border-0 max-w-md w-full">
          <div className="py-12 px-6">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <BookOutlined className="text-4xl text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Course Not Found
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              We couldn&apos;t find the course you&apos;re looking for. It may
              have been removed or the link is incorrect.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const handleOrder = async () => {
    const token = localStorage.getItem("accessToken") || "";
    const price = courseDetail.price ?? 0;

    if (!token) {
      message.error("Please log in to continue with your purchase");
      return;
    }

    setIsProcessing(true);

    try {
      const { payUrl } = await createOrder(Number(courseId), price, token);
      if (payUrl) {
        message.success("Redirecting to payment gateway...");
        setTimeout(() => {
          window.location.href = payUrl;
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to process order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const isFree = !courseDetail.price || courseDetail.price === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Complete Your Enrollment
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Review your course selection and proceed with the payment to start
            your learning journey
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Course Details - Takes more space */}
          <div className="lg:col-span-3">
            <Card className="shadow-2xl border-0 overflow-hidden bg-white/90 backdrop-blur-sm">
              {/* Course Header with Gradient */}
              <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/10 rounded-full"></div>

                <div className="relative z-10">
                  <div className="flex items-start gap-6">
                    <div className="flex-1">
                      <div className="mb-4">
                        <h2 className="text-3xl font-bold mb-3 leading-tight">
                          {courseDetail.title}
                        </h2>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                            <UserOutlined className="text-blue-200" />
                            <span className="text-sm font-medium">
                              {courseDetail.instructor?.username ||
                                "Unknown Instructor"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-yellow-500/20 rounded-full px-3 py-1">
                            <StarFilled className="text-yellow-400 text-sm" />
                            <span className="text-sm font-medium text-yellow-100">
                              4.8 (2.1k reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-8">
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                    <BookOutlined className="text-blue-600" />
                    About This Course
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {courseDetail.description ||
                        "This comprehensive course will teach you everything you need to know."}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="group hover:scale-105 transition-all duration-300">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200/50 h-full">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                          <PlayCircleOutlined className="text-white text-xl" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-lg">
                            Total Lessons
                          </h4>
                          <p className="text-blue-600 text-sm">
                            Complete curriculum
                          </p>
                        </div>
                      </div>
                      <p className="text-3xl font-bold text-blue-700">
                        {courseDetail.totalLessons || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="group hover:scale-105 transition-all duration-300">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200/50 h-full">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                          <ClockCircleOutlined className="text-white text-xl" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-lg">
                            Course Duration
                          </h4>
                          <p className="text-green-600 text-sm">
                            Total learning time
                          </p>
                        </div>
                      </div>
                      <p className="text-3xl font-bold text-green-700">
                        {courseDetail.totalDuration || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Payment Summary - Compact but prominent */}
          <div className="lg:col-span-2">
            <div className="sticky top-8">
              <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <CreditCardOutlined className="text-white text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Order Summary
                  </h3>
                  <p className="text-gray-600">Review your purchase details</p>
                  <Divider className="my-4" />
                </div>

                <div className="space-y-6 mb-8">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 font-medium">
                        Course Price:
                      </span>
                      <span className="font-bold text-gray-800 text-lg">
                        {isFree ? (
                          <Badge count="FREE" className="bg-green-500" />
                        ) : (
                          formatPrice(courseDetail.price)
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      Platform Fee:
                    </span>
                    <Badge count="FREE" className="bg-blue-500" />
                  </div>

                  <Divider className="border-gray-300" />

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-800">
                        Total Amount:
                      </span>
                      <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {isFree ? "FREE" : formatPrice(courseDetail.price)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={handleOrder}
                  loading={isProcessing}
                  className="h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 border-0 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  icon={<CreditCardOutlined />}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <Spin size="small" />
                      Processing Payment...
                    </span>
                  ) : isFree ? (
                    "Enroll Now - It&apos;s Free!"
                  ) : (
                    "Complete Purchase"
                  )}
                </Button>

                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                    <SafetyCertificateOutlined className="text-green-600" />
                    <span className="font-medium">Secure Payment Gateway</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PaymentConfirmPage() {
  return (
    <Suspense fallback={<Spin />}>
      <PaymentConfirm />
    </Suspense>
  );
}
