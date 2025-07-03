'use client';
import React from 'react';
import { Button, Card } from 'antd';
import {
  CloseCircleOutlined,
  HomeOutlined,
  CreditCardOutlined,
  CustomerServiceOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';

const PaymentCancel = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 flex items-center justify-center px-4 py-8'>
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-1/4 left-1/4 w-32 h-32 bg-red-200/20 rounded-full blur-xl animate-pulse'></div>
        <div className='absolute top-3/4 right-1/4 w-24 h-24 bg-pink-200/20 rounded-full blur-xl animate-pulse delay-1000'></div>
        <div className='absolute bottom-1/4 left-1/3 w-20 h-20 bg-orange-200/20 rounded-full blur-xl animate-pulse delay-500'></div>
      </div>

      <div className='relative z-10 max-w-2xl w-full'>
        <Card className='shadow-2xl border-0 overflow-hidden bg-white/95 backdrop-blur-sm'>
          <div className='text-center py-12 px-8'>
            <div className='relative mb-8'>
              <div className='w-24 h-24 mx-auto bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-4 animate-bounce'>
                <CloseCircleOutlined className='text-5xl text-red-500' />
              </div>
              <div className='absolute inset-0 w-24 h-24 mx-auto bg-red-400/20 rounded-full animate-ping'></div>
            </div>

            <div className='mb-8'>
              <h1 className='text-4xl font-bold text-gray-800 mb-4'>Payment Canceled</h1>
              <p className='text-xl text-gray-600 mb-6 leading-relaxed'>
                Your transaction was not completed. Don&apos;t worry, no charges were made to your
                account.
              </p>

              <div className='grid md:grid-cols-2 gap-4 mb-8 text-left'>
                <div className='bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200/50'>
                  <div className='flex items-center gap-3 mb-2'>
                    <CreditCardOutlined className='text-blue-600 text-lg' />
                    <h3 className='font-semibold text-gray-800'>No Charges Applied</h3>
                  </div>
                  <p className='text-sm text-gray-600'>Your payment method was not charged</p>
                </div>

                <div className='bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200/50'>
                  <div className='flex items-center gap-3 mb-2'>
                    <CustomerServiceOutlined className='text-green-600 text-lg' />
                    <h3 className='font-semibold text-gray-800'>Need Help?</h3>
                  </div>
                  <p className='text-sm text-gray-600'>Our support team is here to assist you</p>
                </div>
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Button
                type='primary'
                size='large'
                icon={<ArrowLeftOutlined />}
                onClick={() => window.history.back()}
                className='h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 border-0 hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300'
              >
                Try Again
              </Button>

              <Button
                size='large'
                icon={<HomeOutlined />}
                href='/'
                className='h-12 px-8 font-semibold border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300'
              >
                Go Home
              </Button>
            </div>

            <div className='mt-8 pt-6 border-t border-gray-200'>
              <p className='text-sm text-gray-500 mb-2'>Having trouble with your payment?</p>
              <Button
                type='link'
                icon={<CustomerServiceOutlined />}
                className='text-blue-600 hover:text-blue-700 font-medium'
              >
                Contact Support
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PaymentCancel;
