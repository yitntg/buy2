'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AirwallexPayment from '@/app/components/AirwallexPayment';
import Link from 'next/link';

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderInfo, setOrderInfo] = useState<{
    orderId: string;
    amount: number;
    currency: string;
  } | null>(null);
  
  // 支付状态
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed' | null>(null);
  const [paymentMessage, setPaymentMessage] = useState('');
  
  useEffect(() => {
    // 从 URL 参数获取订单信息
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');
    const currency = searchParams.get('currency') || 'CNY';
    
    if (!orderId || !amount) {
      setPaymentMessage('订单信息不完整，无法进行支付');
      return;
    }
    
    // 设置订单信息
    setOrderInfo({
      orderId,
      amount: parseFloat(amount),
      currency
    });
  }, [searchParams]);
  
  // 处理支付成功
  const handlePaymentSuccess = async (paymentIntentId: string) => {
    setPaymentStatus('success');
    setPaymentMessage('支付成功！正在处理您的订单...');
    
    // 延迟后跳转到订单详情页
    setTimeout(() => {
      router.push(`/order/${orderInfo?.orderId}`);
    }, 2000);
  };
  
  // 处理支付错误
  const handlePaymentError = (error: any) => {
    setPaymentStatus('failed');
    setPaymentMessage(error.message || '支付过程中发生错误，请稍后重试');
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">订单支付</h1>
      
      {!orderInfo && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mb-6">
          {paymentMessage || '加载订单信息...'}
          {paymentMessage && (
            <div className="mt-4">
              <Link href="/cart" className="text-blue-500 hover:underline">
                返回购物车
              </Link>
            </div>
          )}
        </div>
      )}
      
      {paymentStatus === 'success' && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
          {paymentMessage}
        </div>
      )}
      
      {paymentStatus === 'failed' && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {paymentMessage}
          <div className="mt-4">
            <button 
              onClick={() => setPaymentStatus(null)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              重试
            </button>
          </div>
        </div>
      )}
      
      {orderInfo && !paymentStatus && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">订单信息</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-600">订单编号:</div>
              <div>{orderInfo.orderId}</div>
              <div className="text-gray-600">支付金额:</div>
              <div>{orderInfo.amount.toFixed(2)} {orderInfo.currency}</div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">支付方式</h2>
            <AirwallexPayment
              orderId={orderInfo.orderId}
              amount={orderInfo.amount}
              currency={orderInfo.currency}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>
        </div>
      )}
    </div>
  );
} 