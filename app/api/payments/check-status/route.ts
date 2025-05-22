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
 * 检查支付状态API
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const intentId = searchParams.get('intent_id');
  
  if (!intentId) {
    return NextResponse.json(
      { error: '缺少支付意图ID' },
      { status: 400 }
    );
  }
  
  try {
    // 获取Airwallex认证令牌
    const auth = await getAirwallexAuth();
    
    // 获取支付意图状态
    const response = await fetch(`https://api.airwallex.com/api/v1/pa/payment_intents/${intentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`,
        'x-api-key': process.env.AIRWALLEX_API_KEY!,
        'x-client-id': process.env.NEXT_PUBLIC_AIRWALLEX_CLIENT_ID!
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '获取支付状态失败');
    }
    
    const result = await response.json();
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('获取支付状态失败:', error);
    return NextResponse.json(
      { error: error.message || '获取支付状态失败' },
      { status: 500 }
    );
  }
} 