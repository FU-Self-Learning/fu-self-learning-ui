import React from "react";

const PaymentCancel = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Thanh toán thất bại hoặc bị hủy!</h1>
      <p className="text-lg text-gray-700 mb-6">Giao dịch của bạn chưa được hoàn tất. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu cần.</p>
      <a href="/" className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">Về trang chủ</a>
    </div>
  );
};

export default PaymentCancel;
