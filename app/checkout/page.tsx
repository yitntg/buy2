'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// 模拟的购物车数据
const DEMO_CART = {
  items: [
    { id: 1, name: '高品质T恤', price: 99, quantity: 2 },
    { id: 2, name: '时尚牛仔裤', price: 199, quantity: 1 },
    { id: 3, name: '休闲运动鞋', price: 299, quantity: 1 }
  ]
};

export default function CheckoutPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // 计算总价
  const totalPrice = DEMO_CART.items.reduce(
    (sum, item) => sum + item.price * item.quantity, 
    0
  );
  
  // 处理提交订单
  const handleSubmitOrder = async () => {
    try {
      setIsProcessing(true);
      
      // 在实际应用中，这里应该发送请求到服务器创建订单
      // 这里我们模拟一个异步过程
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 生成一个随机订单ID (在实际应用中，这应该由后端生成)
      const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // 跳转到支付页面
      router.push(`/payment?orderId=${orderId}&amount=${totalPrice}&currency=CNY`);
    } catch (error) {
      console.error('创建订单失败:', error);
      setIsProcessing(false);
      alert('创建订单失败，请重试');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">结算</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">购物车商品</h2>
            
            <div className="space-y-4">
              {DEMO_CART.items.map(item => (
                <div key={item.id} className="flex justify-between border-b pb-4">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-600">数量: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">¥{item.price.toFixed(2)}</p>
                    <p className="text-gray-600">小计: ¥{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">收货信息</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-gray-700 mb-2">姓名</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入姓名"
                  defaultValue="张三"
                />
              </div>
              
              <div className="form-group">
                <label className="block text-gray-700 mb-2">电话</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入电话号码"
                  defaultValue="13800138000"
                />
              </div>
              
              <div className="form-group md:col-span-2">
                <label className="block text-gray-700 mb-2">地址</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入详细地址"
                  defaultValue="北京市海淀区中关村大街1号"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white shadow-md rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">订单摘要</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>商品总价:</span>
                <span>¥{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>运费:</span>
                <span>¥0.00</span>
              </div>
              <div className="border-t pt-3 font-bold flex justify-between text-lg">
                <span>总计:</span>
                <span>¥{totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              onClick={handleSubmitOrder}
              disabled={isProcessing}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                isProcessing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isProcessing ? '处理中...' : '提交订单并支付'}
            </button>
            
            <div className="mt-4">
              <Link href="/cart" className="text-blue-500 hover:underline block text-center">
                返回购物车
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 