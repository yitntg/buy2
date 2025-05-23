'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaCheckCircle, FaBox, FaTruck, FaHome } from 'react-icons/fa';
import SafeImage from '@/app/components/SafeImage';
import { supabase } from '@/app/lib/supabase';

// 订单状态
const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
};

interface OrderItem {
  id: number;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface Order {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
  total_amount: number;
  payment_method: string;
  items: OrderItem[];
  shipping_address: {
    full_name: string;
    phone: string;
    address: string;
    postal_code: string;
  };
}

export default function OrderPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        // 获取订单数据
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .single();

        if (orderError) throw orderError;
        
        if (orderData) {
          // 获取订单项
          const { data: orderItems, error: itemsError } = await supabase
            .from('order_items')
            .select(`
              id,
              product_id,
              quantity,
              price,
              products (
                name
              ),
              products:product_id (
                product_images (
                  image_url
                )
              )
            `)
            .eq('order_id', id);

          if (itemsError) throw itemsError;

          // 获取收货地址
          const { data: addressData, error: addressError } = await supabase
            .from('shipping_addresses')
            .select('*')
            .eq('order_id', id)
            .single();

          if (addressError) throw addressError;

          // 组装订单数据
          const order: Order = {
            ...orderData,
            items: orderItems?.map(item => ({
              id: item.id,
              product_id: item.product_id,
              product_name: item.products.name,
              price: item.price,
              quantity: item.quantity,
              image_url: item.products.product_images[0]?.image_url || '/no-image.png'
            })) || [],
            shipping_address: addressData
          };

          setOrder(order);
        }
      } catch (error) {
        console.error('Error fetching order data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">订单不存在</h1>
        <Link 
          href="/orders" 
          className="text-primary-500 hover:text-primary-600 transition-colors"
        >
          返回订单列表
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-6 md:px-10">
      <div className="container mx-auto max-w-4xl">
        {/* 订单状态 */}
        <div className="glass-card p-6 rounded-xl mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">订单详情</h1>
            <span className="px-4 py-2 bg-primary-500 text-white rounded-full text-sm">
              {order.status === ORDER_STATUS.PAID && '已支付'}
              {order.status === ORDER_STATUS.PROCESSING && '处理中'}
              {order.status === ORDER_STATUS.SHIPPED && '已发货'}
              {order.status === ORDER_STATUS.DELIVERED && '已送达'}
              {order.status === ORDER_STATUS.PENDING && '待支付'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">订单编号</p>
              <p className="font-medium">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">下单时间</p>
              <p className="font-medium">{new Date(order.created_at).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">支付方式</p>
              <p className="font-medium">{order.payment_method}</p>
            </div>
          </div>
        </div>

        {/* 订单进度 */}
        <div className="glass-card p-6 rounded-xl mb-8">
          <h2 className="text-lg font-semibold mb-6">订单进度</h2>
          <div className="flex justify-between">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${order.status !== ORDER_STATUS.PENDING ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                <FaCheckCircle />
              </div>
              <span className="text-sm">已下单</span>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${order.status === ORDER_STATUS.PROCESSING || order.status === ORDER_STATUS.SHIPPED || order.status === ORDER_STATUS.DELIVERED ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                <FaBox />
              </div>
              <span className="text-sm">处理中</span>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${order.status === ORDER_STATUS.SHIPPED || order.status === ORDER_STATUS.DELIVERED ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                <FaTruck />
              </div>
              <span className="text-sm">已发货</span>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${order.status === ORDER_STATUS.DELIVERED ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                <FaHome />
              </div>
              <span className="text-sm">已送达</span>
            </div>
          </div>
        </div>

        {/* 商品列表 */}
        <div className="glass-card p-6 rounded-xl mb-8">
          <h2 className="text-lg font-semibold mb-6">商品信息</h2>
          <div className="space-y-6">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                  <SafeImage
                    src={item.image_url}
                    alt={item.product_name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="ml-4 flex-1">
                  <Link 
                    href={`/products/${item.product_id}`}
                    className="text-lg font-medium hover:text-primary-500 transition-colors"
                  >
                    {item.product_name}
                  </Link>
                  <p className="text-gray-500 dark:text-gray-400">
                    数量: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">¥{item.price}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    小计: ¥{item.price * item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between">
              <span className="font-medium">总计</span>
              <span className="font-medium">¥{order.total_amount}</span>
            </div>
          </div>
        </div>

        {/* 收货信息 */}
        <div className="glass-card p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-6">收货信息</h2>
          <div className="space-y-2">
            <p>
              <span className="text-gray-500 dark:text-gray-400">收货人：</span>
              {order.shipping_address.full_name}
            </p>
            <p>
              <span className="text-gray-500 dark:text-gray-400">联系电话：</span>
              {order.shipping_address.phone}
            </p>
            <p>
              <span className="text-gray-500 dark:text-gray-400">收货地址：</span>
              {order.shipping_address.address}
            </p>
            <p>
              <span className="text-gray-500 dark:text-gray-400">邮政编码：</span>
              {order.shipping_address.postal_code}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 