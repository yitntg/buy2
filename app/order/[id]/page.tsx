'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaCheckCircle, FaBox, FaTruck, FaHome } from 'react-icons/fa';
import SafeImage from '@/app/components/SafeImage';

// 模拟订单状态
const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
};

// 模拟订单数据获取函数
const fetchOrderData = async (orderId: string) => {
  // 在实际应用中，这里应该从API获取订单数据
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 模拟订单数据
  return {
    id: orderId,
    status: ORDER_STATUS.PAID,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    total_amount: 696,
    payment_method: 'Airwallex支付',
    items: [
      {
        id: 1,
        product_id: 'prod-1',
        product_name: '高品质T恤',
        price: 99,
        quantity: 2,
        image_url: 'https://picsum.photos/600/800?random=1'
      },
      {
        id: 2,
        product_id: 'prod-2',
        product_name: '时尚牛仔裤',
        price: 199,
        quantity: 1,
        image_url: 'https://picsum.photos/600/800?random=2'
      },
      {
        id: 3,
        product_id: 'prod-3',
        product_name: '休闲运动鞋',
        price: 299,
        quantity: 1,
        image_url: 'https://picsum.photos/600/800?random=3'
      }
    ],
    shipping_address: {
      full_name: '张三',
      phone: '13800138000',
      address: '北京市海淀区中关村大街1号创新大厦2单元303室',
      postal_code: '100080'
    }
  };
};

// 订单状态进度组件
const OrderProgress = ({ status }: { status: string }) => {
  const steps = [
    { id: ORDER_STATUS.PAID, label: '已支付', icon: <FaCheckCircle /> },
    { id: ORDER_STATUS.PROCESSING, label: '处理中', icon: <FaBox /> },
    { id: ORDER_STATUS.SHIPPED, label: '已发货', icon: <FaTruck /> },
    { id: ORDER_STATUS.DELIVERED, label: '已送达', icon: <FaHome /> },
  ];
  
  // 获取当前状态在步骤中的索引
  const currentStepIndex = steps.findIndex(step => step.id === status);
  
  return (
    <div className="my-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const isActive = index <= currentStepIndex;
          const isLast = index === steps.length - 1;
          
          return (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                ${isActive ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                {step.icon}
              </div>
              <div className="text-sm mt-2 text-center">{step.label}</div>
              
              {!isLast && (
                <div className="w-full flex-1 flex items-center justify-center">
                  <div className={`h-1 w-full mx-2 ${
                    index < currentStepIndex ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`}></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  
  useEffect(() => {
    const getOrderData = async () => {
      try {
        setLoading(true);
        const data = await fetchOrderData(params.id);
        setOrder(data);
      } catch (err) {
        setError('获取订单数据失败，请稍后重试');
        console.error('获取订单数据失败:', err);
      } finally {
        setLoading(false);
      }
    };
    
    getOrderData();
  }, [params.id]);
  
  // 取消订单
  const handleCancelOrder = async () => {
    if (!confirm('确定要取消此订单吗？此操作无法撤销。')) {
      return;
    }
    
    try {
      setIsCancelling(true);
      
      const response = await fetch('/api/orders/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: params.id })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '取消订单失败');
      }
      
      // 刷新订单数据
      const updatedOrder = { ...order, status: 'cancelled', status_text: '已取消' };
      setOrder(updatedOrder);
      
      alert('订单已成功取消');
    } catch (error: any) {
      console.error('取消订单失败:', error);
      alert(error.message || '取消订单失败，请稍后重试');
    } finally {
      setIsCancelling(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen py-16 px-6 md:px-10">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-card p-10 flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3">加载订单信息...</span>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !order) {
    return (
      <div className="min-h-screen py-16 px-6 md:px-10">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-card p-10 text-center">
            <h1 className="text-2xl font-bold mb-4">订单不存在或已被删除</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error || '无法找到该订单信息'}</p>
            <Link href="/account?tab=orders" className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors">
              查看所有订单
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const formattedDate = new Date(order.created_at).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return (
    <div className="min-h-screen py-16 px-6 md:px-10">
      <div className="container mx-auto max-w-4xl">
        <div className="glass-card p-6 md:p-10">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h1 className="text-2xl font-bold">订单详情</h1>
            <div className="text-gray-600 dark:text-gray-300">
              订单号: <span className="font-semibold">{order.id}</span>
            </div>
          </div>
          
          <div className="mb-8 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="font-medium">订单状态: 已支付</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">下单时间: {formattedDate}</p>
          </div>
          
          <OrderProgress status={order.status} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-lg font-semibold mb-4">配送信息</h2>
              <div className="bg-white/10 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="font-medium">{order.shipping_address.full_name}</p>
                <p className="text-gray-600 dark:text-gray-400">{order.shipping_address.phone}</p>
                <p className="text-gray-600 dark:text-gray-400">{order.shipping_address.address}</p>
                <p className="text-gray-600 dark:text-gray-400">{order.shipping_address.postal_code}</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-4">支付信息</h2>
              <div className="bg-white/10 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-gray-600 dark:text-gray-400">支付方式:</div>
                  <div>{order.payment_method}</div>
                  
                  <div className="text-gray-600 dark:text-gray-400">商品总价:</div>
                  <div>¥{order.total_amount.toFixed(2)}</div>
                  
                  <div className="text-gray-600 dark:text-gray-400">运费:</div>
                  <div>免费</div>
                  
                  <div className="text-gray-600 dark:text-gray-400 font-medium">实付金额:</div>
                  <div className="font-medium">¥{order.total_amount.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
          
          <h2 className="text-lg font-semibold mb-4">商品清单</h2>
          <div className="bg-white/10 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="py-3 px-4 text-left">商品</th>
                  <th className="py-3 px-4 text-right">单价</th>
                  <th className="py-3 px-4 text-right">数量</th>
                  <th className="py-3 px-4 text-right">小计</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item: any) => (
                  <tr key={item.id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-16 h-16 rounded-md overflow-hidden relative flex-shrink-0">
                          <SafeImage 
                            src={item.image_url} 
                            alt={item.product_name} 
                            fill
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium">{item.product_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">¥{item.price.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right">{item.quantity}</td>
                    <td className="py-4 px-4 text-right font-medium">¥{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between flex-wrap gap-4">
            <div className="flex gap-3">
              <Link href="/account?tab=orders" className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors">
                返回订单列表
              </Link>
              
              {/* 已支付状态可以取消订单 */}
              {order.status === ORDER_STATUS.PAID && (
                <button
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCancelling ? '处理中...' : '取消订单'}
                </button>
              )}
              
              {/* 已发货或已送达的订单可以申请退款 */}
              {(order.status === ORDER_STATUS.SHIPPED || order.status === ORDER_STATUS.DELIVERED) && (
                <Link 
                  href={`/order/${order.id}/refund`}
                  className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors"
                >
                  申请退款
                </Link>
              )}
            </div>
            
            <Link href="/products" className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors">
              继续购物
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 