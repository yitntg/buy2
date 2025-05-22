'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaSearch, FaFileAlt, FaExclamationCircle } from 'react-icons/fa';

// 模拟订单数据
const mockOrders = [
  {
    id: 'ORD20230001',
    status: 'delivered',
    status_text: '已送达',
    created_at: '2023-07-15T08:30:00Z',
    total_amount: 699,
    items_count: 3,
    payment_method: 'Airwallex支付'
  },
  {
    id: 'ORD20230002',
    status: 'shipped',
    status_text: '已发货',
    created_at: '2023-08-22T14:20:00Z',
    total_amount: 459,
    items_count: 2,
    payment_method: '支付宝'
  },
  {
    id: 'ORD20230003',
    status: 'processing',
    status_text: '处理中',
    created_at: '2023-09-10T10:15:00Z',
    total_amount: 1299,
    items_count: 1,
    payment_method: '微信支付'
  },
  {
    id: 'ORD20230004',
    status: 'paid',
    status_text: '已支付',
    created_at: '2023-10-05T16:45:00Z',
    total_amount: 899,
    items_count: 4,
    payment_method: 'Airwallex支付'
  }
];

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // 模拟API调用获取订单数据
    const fetchOrders = async () => {
      setLoading(true);
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      setOrders(mockOrders);
      setLoading(false);
    };
    
    fetchOrders();
  }, []);
  
  // 过滤订单
  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };
  
  // 获取订单状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'paid':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen py-16 px-6 md:px-10">
        <div className="container mx-auto max-w-6xl">
          <div className="glass-card p-10 flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3">加载订单信息...</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-16 px-6 md:px-10">
      <div className="container mx-auto max-w-6xl">
        <div className="glass-card p-6 md:p-10">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h1 className="text-2xl font-bold">我的订单</h1>
            
            <div className="relative">
              <input
                type="text"
                placeholder="搜索订单编号..."
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          {filteredOrders.length === 0 ? (
            <div className="text-center py-10">
              <div className="flex justify-center mb-4">
                <FaExclamationCircle className="text-4xl text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">没有找到订单</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm ? '没有匹配的订单编号' : '您还没有任何订单'}
              </p>
              <Link href="/products" className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors">
                去购物
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                    <th className="pb-3 font-semibold">订单编号</th>
                    <th className="pb-3 font-semibold">日期</th>
                    <th className="pb-3 font-semibold">状态</th>
                    <th className="pb-3 font-semibold">金额</th>
                    <th className="pb-3 font-semibold">支付方式</th>
                    <th className="pb-3 font-semibold text-right">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-4 font-medium">
                        {order.id}
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {order.items_count}件商品
                        </div>
                      </td>
                      <td className="py-4">{formatDate(order.created_at)}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                          {order.status_text}
                        </span>
                      </td>
                      <td className="py-4 font-medium">¥{order.total_amount.toFixed(2)}</td>
                      <td className="py-4">{order.payment_method}</td>
                      <td className="py-4 text-right">
                        <Link
                          href={`/order/${order.id}`}
                          className="inline-flex items-center text-primary-500 hover:text-primary-600 transition-colors"
                        >
                          <FaFileAlt className="mr-1" /> 详情
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 