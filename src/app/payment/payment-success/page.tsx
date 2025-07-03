"use client";
import React from "react";
import { Button, Card, Badge } from "antd";
import { 
  CheckCircleOutlined, 
  HomeOutlined, 
  BookOutlined,
  UserOutlined,
  StarOutlined,
  RocketOutlined
} from "@ant-design/icons";

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-200/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-28 h-28 bg-emerald-200/20 rounded-full blur-xl animate-pulse delay-700"></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-teal-200/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-2/3 right-1/5 w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-1/2 left-1/5 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        <Card className="shadow-2xl border-0 overflow-hidden bg-white/95 backdrop-blur-sm">
          <div className="text-center py-16 px-8">
            <div className="relative mb-8">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-6 animate-bounce shadow-lg">
                <CheckCircleOutlined className="text-6xl text-white" />
              </div>
              <div className="absolute inset-0 w-32 h-32 mx-auto bg-green-400/30 rounded-full animate-ping"></div>
              
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <Badge.Ribbon text="Success" color="green" />
              </div>
            </div>

            <div className="mb-10">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                Payment Successful!
              </h1>
              <p className="text-2xl text-gray-700 mb-6 font-medium">
                🎉 Congratulations! Your course purchase is complete
              </p>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Thank you for your purchase! You now have full access to your course content. 
                Start your learning journey right away and unlock your potential.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="group hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200/50 h-full">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <BookOutlined className="text-white text-xl" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">Course Access</h3>
                  <p className="text-sm text-gray-600">Immediate access to all course materials</p>
                </div>
              </div>

              <div className="group hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200/50 h-full">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <UserOutlined className="text-white text-xl" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">Profile Updated</h3>
                  <p className="text-sm text-gray-600">Course added to your learning dashboard</p>
                </div>
              </div>

              <div className="group hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200/50 h-full">
                  <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <StarOutlined className="text-white text-xl" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">Certificate Ready</h3>
                  <p className="text-sm text-gray-600">Earn your completion certificate</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 mb-8 border border-green-200/50">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                <RocketOutlined className="text-green-600" />
                Ready to Start Learning?
              </h3>
              <p className="text-gray-600 mb-6">
                Your course is waiting for you in your profile. Begin your learning journey today!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  type="primary" 
                  size="large"
                  icon={<UserOutlined />}
                  href="/profile"
                  className="h-14 px-8 bg-gradient-to-r from-green-600 to-emerald-600 border-0 hover:from-green-700 hover:to-emerald-700 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Go to My Courses
                </Button>
                
                <Button 
                  size="large"
                  icon={<HomeOutlined />}
                  href="/"
                  className="h-14 px-8 font-semibold text-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                >
                  Browse More Courses
                </Button>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <p className="text-lg font-medium text-gray-700 mb-2">
                Thank you for choosing our platform! 🚀
              </p>
              <p className="text-sm text-gray-500">
                We&apos;re excited to be part of your learning journey. Happy studying!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;