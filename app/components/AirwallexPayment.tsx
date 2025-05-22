import React, { useEffect, useState } from 'react';
import { AirwallexPaymentService } from '@/app/lib/payment/airwallex';

interface AirwallexPaymentProps {
  orderId: string;
  amount: number;
  currency?: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: any) => void;
}

const AirwallexPayment: React.FC<AirwallexPaymentProps> = ({
  orderId,
  amount,
  currency = 'CNY',
  onSuccess,
  onError
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    let paymentElement: any = null;
    
    const initPayment = async () => {
      try {
        setLoading(true);
        
        // 创建支付服务实例
        const paymentService = new AirwallexPaymentService();
        
        // 创建支付意图
        const intent = await paymentService.createPaymentIntent({
          orderId,
          amount,
          currency
        });
        
        // 加载Airwallex SDK
        const Airwallex = await AirwallexPaymentService.loadAirwallexJS();
        
        // 初始化Airwallex
        const airwallex = new Airwallex({
          env: process.env.NEXT_PUBLIC_AIRWALLEX_ENV || 'demo', // 从环境变量获取环境配置
          origin: window.location.origin
        });
        
        // 创建并挂载支付元素
        paymentElement = airwallex.createElement('payment', {
          intent_id: intent.id,
          client_secret: intent.client_secret,
          style: {
            base: {
              fontSize: '16px',
              color: '#32325d',
              '::placeholder': {
                color: '#aab7c4'
              }
            },
            invalid: {
              color: '#fa755a'
            }
          },
          onReady: () => {
            setLoading(false);
          },
          onSuccess: (event: any) => {
            console.log('支付成功:', event);
            const intentId = event.data.intent_id || intent.id;
            
            // 调用成功回调
            onSuccess(intentId);
            
            // 可选：重定向到结果页面
            window.location.href = `/payment/result?payment_intent_id=${intentId}`;
          },
          onError: (error: any) => {
            console.error('支付错误:', error);
            setError(error.message || '支付处理过程中发生错误');
            onError(error);
          },
          onCancel: () => {
            console.log('支付已取消');
            setError('支付已取消');
          }
        });
        
        // 挂载支付元素
        paymentElement.mount('airwallex-payment-element');
      } catch (error: any) {
        console.error('初始化支付失败:', error);
        setError(error.message || '初始化支付失败');
        setLoading(false);
        onError(error);
      }
    };
    
    initPayment();
    
    // 清理函数
    return () => {
      if (paymentElement) {
        try {
          paymentElement.unmount();
        } catch (error) {
          console.error('卸载支付元素失败:', error);
        }
      }
    };
  }, [orderId, amount, currency, onSuccess, onError]);
  
  return (
    <div className="airwallex-payment-container">
      {loading && (
        <div className="loading-spinner flex justify-center items-center py-8">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3">加载支付界面...</span>
        </div>
      )}
      
      {error && (
        <div className="error-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <div id="airwallex-payment-element" className="min-h-[300px]"></div>
    </div>
  );
};

export default AirwallexPayment; 