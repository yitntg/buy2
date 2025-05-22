import { NextRequest, NextResponse } from 'next/server';

/**
 * 取消订单API
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { orderId } = data;
    
    if (!orderId) {
      return NextResponse.json(
        { error: '缺少订单ID' },
        { status: 400 }
      );
    }
    
    // 在实际应用中，这里应该验证用户是否有权限取消该订单
    // 例如，验证订单是否属于当前用户，订单状态是否允许取消等
    
    // 模拟取消订单的处理
    // 在实际应用中，这里应该调用数据库API更新订单状态
    // 例如: await db.order.update({ where: { id: orderId }, data: { status: 'cancelled' } });
    
    console.log(`订单取消: ${orderId}`);
    
    // 如果订单已支付，这里还应该调用Airwallex API进行退款处理
    
    return NextResponse.json({
      success: true,
      message: '订单已成功取消'
    });
  } catch (error: any) {
    console.error('取消订单失败:', error);
    
    return NextResponse.json(
      { error: error.message || '取消订单时发生错误' },
      { status: 500 }
    );
  }
} 