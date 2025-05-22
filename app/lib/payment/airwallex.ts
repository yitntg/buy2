/**
 * Airwallex支付服务
 * 提供与Airwallex支付平台交互的方法
 */

interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: 'INITIAL' | 'PENDING' | 'SUCCEEDED' | 'FAILED';
}

export class AirwallexPaymentService {
  private clientId: string;
  
  constructor() {
    this.clientId = process.env.NEXT_PUBLIC_AIRWALLEX_CLIENT_ID || '';
  }
  
  /**
   * 创建支付意图
   */
  async createPaymentIntent(orderData: {
    orderId: string;
    amount: number;
    currency?: string;
    customerId?: string;
  }): Promise<PaymentIntent> {
    try {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: orderData.amount,
          currency: orderData.currency || 'CNY',
          orderId: orderData.orderId,
          customerId: orderData.customerId
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '创建支付意图失败');
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('支付意图创建失败:', error);
      throw new Error(error.message || '支付处理失败');
    }
  }
  
  /**
   * 检查支付状态
   */
  async checkPaymentStatus(intentId: string): Promise<{
    status: 'success' | 'pending' | 'failed';
    orderId?: string;
  }> {
    try {
      const response = await fetch(`/api/payments/check-status?intent_id=${intentId}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '获取支付状态失败');
      }
      
      const data = await response.json();
      
      // 转换状态格式
      let status: 'success' | 'pending' | 'failed';
      switch (data.status) {
        case 'SUCCEEDED':
          status = 'success';
          break;
        case 'FAILED':
          status = 'failed';
          break;
        default:
          status = 'pending';
      }
      
      return {
        status,
        orderId: data.order_id
      };
    } catch (error: any) {
      console.error('获取支付状态失败:', error);
      throw new Error(error.message || '获取支付状态失败');
    }
  }
  
  /**
   * 加载Airwallex SDK
   */
  static loadAirwallexJS(): Promise<any> {
    return new Promise((resolve, reject) => {
      // 如果已经加载，直接返回
      if ((window as any).Airwallex) {
        resolve((window as any).Airwallex);
        return;
      }
      
      // 创建脚本标签并加载SDK
      const script = document.createElement('script');
      script.src = 'https://checkout.airwallex.com/assets/elements.bundle.min.js';
      script.onload = () => resolve((window as any).Airwallex);
      script.onerror = () => reject(new Error('无法加载Airwallex SDK'));
      document.body.appendChild(script);
    });
  }
} 