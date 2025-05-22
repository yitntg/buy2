import { NextRequest, NextResponse } from 'next/server';

/**
 * 获取Airwallex认证令牌
 */
async function getAirwallexAuth() {
  try {
    const response = await fetch('https://api.airwallex.com/api/v1/authentication/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.AIRWALLEX_API_KEY!,
        'x-client-id': process.env.NEXT_PUBLIC_AIRWALLEX_CLIENT_ID!
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '认证失败');
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Airwallex认证失败:', error);
    throw new Error('认证失败');
  }
}

/**
 * 创建支付意图API
 */
export async function POST(request: NextRequest) {
  const data = await request.json();
  
  try {
    // 获取Airwallex认证令牌
    const auth = await getAirwallexAuth();
    
    // 创建支付意图
    const response = await fetch('https://api.airwallex.com/api/v1/pa/payment_intents/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`,
        'x-api-key': process.env.AIRWALLEX_API_KEY!,
        'x-client-id': process.env.NEXT_PUBLIC_AIRWALLEX_CLIENT_ID!
      },
      body: JSON.stringify({
        amount: data.amount,
        currency: data.currency || 'CNY',
        order_id: data.orderId,
        merchant_order_id: data.orderId,
        descriptor: '炫酷商城-订单支付',
        metadata: {
          customer_id: data.customerId || 'guest'
        }
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '创建支付意图失败');
    }
    
    const result = await response.json();
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('创建支付意图失败:', error);
    return NextResponse.json(
      { error: error.message || '支付处理失败' }, 
      { status: 500 }
    );
  }
} 