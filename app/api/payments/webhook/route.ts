import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// 验证Airwallex发送的签名
function verifySignature(payload: any, signature: string, secret: string): boolean {
  try {
    // Airwallex使用HMAC SHA256算法验证
    const hmac = crypto.createHmac('sha256', secret);
    const calculatedSignature = hmac.update(JSON.stringify(payload)).digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(calculatedSignature),
      Buffer.from(signature)
    );
  } catch (error) {
    console.error('签名验证失败:', error);
    return false;
  }
}

// 处理不同的事件类型
async function handleEvent(event: any): Promise<{ success: boolean, message?: string }> {
  const eventType = event.type;
  const data = event.data;
  
  console.log(`处理支付事件: ${eventType}`, data);
  
  switch (eventType) {
    case 'payment_intent.succeeded':
      // 支付成功，更新订单状态
      return await updateOrderStatus(data.id, 'paid');
      
    case 'payment_intent.failed':
      // 支付失败，标记订单为失败
      return await updateOrderStatus(data.id, 'failed');
      
    case 'payment_intent.cancelled':
      // 支付取消
      return await updateOrderStatus(data.id, 'cancelled');
      
    default:
      // 忽略其他事件类型
      return { success: true, message: `未处理的事件类型: ${eventType}` };
  }
}

// 更新订单状态
async function updateOrderStatus(paymentIntentId: string, status: string): Promise<{ success: boolean, message?: string }> {
  try {
    // 在实际应用中，这里应该调用数据库API更新订单状态
    // 例如: await db.order.update({ where: { paymentIntentId }, data: { status } });
    
    console.log(`更新订单状态: 支付ID ${paymentIntentId}, 状态 ${status}`);
    
    // 模拟成功响应
    return { success: true, message: `订单状态已更新为 ${status}` };
  } catch (error) {
    console.error('更新订单状态失败:', error);
    return { success: false, message: '更新订单状态时发生错误' };
  }
}

/**
 * 处理Airwallex Webhook通知
 */
export async function POST(request: NextRequest) {
  try {
    // 获取Airwallex签名
    const signature = request.headers.get('x-signature') || '';
    const webhookSecret = process.env.AIRWALLEX_WEBHOOK_SECRET || '';
    
    if (!signature) {
      return NextResponse.json(
        { error: '缺少签名' },
        { status: 401 }
      );
    }
    
    // 解析请求体
    const payload = await request.json();
    
    // 验证签名
    const isValid = verifySignature(payload, signature, webhookSecret);
    
    if (!isValid) {
      return NextResponse.json(
        { error: '签名无效' },
        { status: 401 }
      );
    }
    
    // 处理事件
    const result = await handleEvent(payload);
    
    if (result.success) {
      return NextResponse.json({ message: result.message || '事件处理成功' });
    } else {
      return NextResponse.json(
        { error: result.message || '事件处理失败' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('处理Webhook通知失败:', error);
    
    return NextResponse.json(
      { error: error.message || '处理Webhook通知时发生错误' },
      { status: 500 }
    );
  }
} 