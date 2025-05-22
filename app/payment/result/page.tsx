'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AirwallexPaymentService } from '@/app/lib/payment/airwallex';

export default function PaymentResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'pending' | 'failed' | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const intentId = searchParams.get('payment_intent_id');
        
        if (!intentId) {
          setLoading(false);
          return;
        }
        
        // 创建支付服务实例
        const paymentService = new AirwallexPaymentService();
        
        // 检查支付状态
        const result = await paymentService.checkPaymentStatus(intentId);
        
        setPaymentStatus(result.status);
        setOrderId(result.orderId || null);
        setLoading(false);
      } catch (error) {
        console.error('检查支付状态失败:', error);
        setPaymentStatus('failed');
        setLoading(false);
      }
    };
    
    checkPaymentStatus();
  }, [searchParams]);
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">支付结果</h1>
      
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3">正在查询支付结果...</span>
        </div>
      )}
      
      {!loading && paymentStatus === 'success' && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-green-600">支付成功</h2>
            {orderId && <p className="text-gray-600 mt-2">订单编号: {orderId}</p>}
          </div>
          
          <div className="flex justify-center space-x-4">
            <Link href={orderId ? `/order/${orderId}` : '/account?tab=orders'} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              查看订单
            </Link>
            <Link href="/" className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
              返回首页
            </Link>
          </div>
        </div>
      )}
      
      {!loading && paymentStatus === 'pending' && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-yellow-600">支付处理中</h2>
            <p className="text-gray-600 mt-2">您的支付正在处理中，请稍后查看结果</p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              刷新状态
            </button>
            <Link href="/" className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
              返回首页
            </Link>
          </div>
        </div>
      )}
      
      {!loading && paymentStatus === 'failed' && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-red-600">支付失败</h2>
            <p className="text-gray-600 mt-2">很抱歉，您的支付未能完成</p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Link href="/payment" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              重新支付
            </Link>
            <Link href="/" className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
              返回首页
            </Link>
          </div>
        </div>
      )}
      
      {!loading && paymentStatus === null && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-600">无法获取支付信息</h2>
            <p className="text-gray-600 mt-2">请检查您的支付参数是否正确</p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Link href="/cart" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              返回购物车
            </Link>
            <Link href="/" className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
              返回首页
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 