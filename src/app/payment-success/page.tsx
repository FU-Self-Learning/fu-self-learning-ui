import React from "react";

const PaymentSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Thanh toán thành công!</h1>
      <p className="text-lg text-gray-700 mb-6">Cảm ơn bạn đã mua khóa học. Bạn có thể truy cập khóa học trong trang cá nhân.</p>
      <a href="/" className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Home Page</a>
    </div>
  );
};

export default PaymentSuccess;
