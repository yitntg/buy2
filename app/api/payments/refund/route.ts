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
 * 创建退款
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { 
      paymentIntentId, 
      amount, 
      reason = '客户退款请求',
      orderId 
    } = data;
    
    // 参数验证
    if (!paymentIntentId) {
      return NextResponse.json(
        { error: '缺少支付ID' },
        { status: 400 }
      );
    }
    
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: '退款金额必须大于0' },
        { status: 400 }
      );
    }
    
    // 获取认证令牌
    const auth = await getAirwallexAuth();
    
    // 创建退款请求
    const response = await fetch(`https://api.airwallex.com/api/v1/pa/payment_intents/${paymentIntentId}/refunds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`,
        'x-api-key': process.env.AIRWALLEX_API_KEY!,
        'x-client-id': process.env.NEXT_PUBLIC_AIRWALLEX_CLIENT_ID!
      },
      body: JSON.stringify({
        amount: amount,
        reason: reason,
        metadata: {
          order_id: orderId
        }
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '创建退款失败');
    }
    
    // 获取退款结果
    const refundResult = await response.json();
    
    // 在实际应用中，这里应该更新订单状态为已退款
    console.log(`退款已创建: 支付ID ${paymentIntentId}, 退款ID ${refundResult.id}, 金额 ${amount}`);
    
    return NextResponse.json({
      success: true,
      refund_id: refundResult.id,
      status: refundResult.status,
      message: '退款已成功处理'
    });
  } catch (error: any) {
    console.error('处理退款请求失败:', error);
    
    return NextResponse.json(
      { error: error.message || '处理退款时发生错误' },
      { status: 500 }
    );
  }
}

/**
 * 获取退款状态
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const refundId = searchParams.get('refund_id');
    const paymentIntentId = searchParams.get('payment_intent_id');
    
    if (!refundId || !paymentIntentId) {
      return NextResponse.json(
        { error: '缺少退款ID或支付ID' },
        { status: 400 }
      );
    }
    
    // 获取认证令牌
    const auth = await getAirwallexAuth();
    
    // 查询退款状态
    const response = await fetch(`https://api.airwallex.com/api/v1/pa/payment_intents/${paymentIntentId}/refunds/${refundId}`, {
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
      throw new Error(error.message || '获取退款状态失败');
    }
    
    const refundData = await response.json();
    
    return NextResponse.json({
      success: true,
      refund_id: refundData.id,
      status: refundData.status,
      amount: refundData.amount,
      created_at: refundData.created_at
    });
  } catch (error: any) {
    console.error('获取退款状态失败:', error);
    
    return NextResponse.json(
      { error: error.message || '获取退款状态时发生错误' },
      { status: 500 }
    );
  }
} 