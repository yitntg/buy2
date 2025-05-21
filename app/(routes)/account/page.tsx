'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaUser, FaShoppingBag, FaHeart, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { supabase } from '@/app/lib/supabase';
import { User } from '@supabase/supabase-js';

// 模拟订单数据
const mockOrders = [
  {
    id: 'order-1',
    date: '2023-11-15',
    status: 'delivered',
    total: 599,
    items: 3
  },
  {
    id: 'order-2',
    date: '2023-12-02',
    status: 'processing',
    total: 899,
    items: 2
  },
  {
    id: 'order-3',
    date: '2024-01-10',
    status: 'shipped',
    total: 349,
    items: 1
  },
];

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // 如果用户未登录，重定向到登录页
          router.push('/auth/login');
          return;
        }
        
        setUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // 用户还未加载时显示加载状态
  if (loading) {
    return (
      <div className="min-h-screen py-12 px-6 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">加载中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6 md:px-10">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">我的账户</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* 侧边栏 */}
          <div className="w-full md:w-64">
            <div className="glass-card p-6 rounded-xl mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <FaUser className="w-8 h-8" />
                  </div>
                </div>
                <div>
                  <h2 className="font-semibold">{user?.user_metadata?.full_name || '用户'}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[150px]">{user?.email}</p>
                </div>
              </div>
            </div>
            
            <div className="glass-card rounded-xl overflow-hidden">
              <nav>
                <button
                  className={`w-full flex items-center space-x-3 px-6 py-4 text-left ${
                    activeTab === 'overview' 
                      ? 'bg-primary-500 text-white' 
                      : 'hover:bg-white/10'
                  }`}
                  onClick={() => setActiveTab('overview')}
                >
                  <FaUser />
                  <span>账户概览</span>
                </button>
                <button
                  className={`w-full flex items-center space-x-3 px-6 py-4 text-left ${
                    activeTab === 'orders' 
                      ? 'bg-primary-500 text-white' 
                      : 'hover:bg-white/10'
                  }`}
                  onClick={() => setActiveTab('orders')}
                >
                  <FaShoppingBag />
                  <span>我的订单</span>
                </button>
                <button
                  className={`w-full flex items-center space-x-3 px-6 py-4 text-left ${
                    activeTab === 'wishlist' 
                      ? 'bg-primary-500 text-white' 
                      : 'hover:bg-white/10'
                  }`}
                  onClick={() => setActiveTab('wishlist')}
                >
                  <FaHeart />
                  <span>我的收藏</span>
                </button>
                <button
                  className={`w-full flex items-center space-x-3 px-6 py-4 text-left ${
                    activeTab === 'settings' 
                      ? 'bg-primary-500 text-white' 
                      : 'hover:bg-white/10'
                  }`}
                  onClick={() => setActiveTab('settings')}
                >
                  <FaCog />
                  <span>账户设置</span>
                </button>
                <button
                  className="w-full flex items-center space-x-3 px-6 py-4 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={handleSignOut}
                >
                  <FaSignOutAlt />
                  <span>退出登录</span>
                </button>
              </nav>
            </div>
          </div>
          
          {/* 主内容区 */}
          <div className="flex-1">
            <div className="glass-card p-6 rounded-xl">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">账户概览</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">个人信息</h3>
                        <button className="text-sm text-primary-500 hover:text-primary-600">
                          编辑
                        </button>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-gray-500 dark:text-gray-400">姓名: </span>{user?.user_metadata?.full_name || '未设置'}</p>
                        <p><span className="text-gray-500 dark:text-gray-400">邮箱: </span>{user?.email}</p>
                        <p><span className="text-gray-500 dark:text-gray-400">电话: </span>未设置</p>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">收货地址</h3>
                        <button className="text-sm text-primary-500 hover:text-primary-600">
                          添加
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        您还没有添加收货地址
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">最近订单</h3>
                      <Link href="/account?tab=orders" className="text-sm text-primary-500 hover:text-primary-600">
                        查看全部
                      </Link>
                    </div>
                    
                    {mockOrders.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                              <th className="py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">订单号</th>
                              <th className="py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">日期</th>
                              <th className="py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">状态</th>
                              <th className="py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">金额</th>
                              <th className="py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mockOrders.slice(0, 3).map((order) => (
                              <tr key={order.id} className="border-b border-gray-200 dark:border-gray-700">
                                <td className="py-4 text-sm font-medium">{order.id}</td>
                                <td className="py-4 text-sm text-gray-500 dark:text-gray-400">{order.date}</td>
                                <td className="py-4">
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    order.status === 'delivered' 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                      : order.status === 'shipped' 
                                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                  }`}>
                                    {order.status === 'delivered' ? '已送达' : order.status === 'shipped' ? '已发货' : '处理中'}
                                  </span>
                                </td>
                                <td className="py-4 text-sm font-medium">¥{order.total.toFixed(2)}</td>
                                <td className="py-4 text-sm">
                                  <Link href={`/account/orders/${order.id}`} className="text-primary-500 hover:text-primary-600">
                                    查看详情
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-center py-8 text-gray-500 dark:text-gray-400">
                        您还没有订单
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">我的订单</h2>
                  
                  {mockOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">订单号</th>
                            <th className="py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">日期</th>
                            <th className="py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">状态</th>
                            <th className="py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">商品数量</th>
                            <th className="py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">金额</th>
                            <th className="py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockOrders.map((order) => (
                            <tr key={order.id} className="border-b border-gray-200 dark:border-gray-700">
                              <td className="py-4 text-sm font-medium">{order.id}</td>
                              <td className="py-4 text-sm text-gray-500 dark:text-gray-400">{order.date}</td>
                              <td className="py-4">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  order.status === 'delivered' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                    : order.status === 'shipped' 
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                }`}>
                                  {order.status === 'delivered' ? '已送达' : order.status === 'shipped' ? '已发货' : '处理中'}
                                </span>
                              </td>
                              <td className="py-4 text-sm text-gray-500 dark:text-gray-400">{order.items} 件商品</td>
                              <td className="py-4 text-sm font-medium">¥{order.total.toFixed(2)}</td>
                              <td className="py-4 text-sm">
                                <Link href={`/account/orders/${order.id}`} className="text-primary-500 hover:text-primary-600">
                                  查看详情
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                        <FaShoppingBag className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">您还没有订单</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        去浏览商品并下单吧
                      </p>
                      <Link href="/products" className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-full transition-colors">
                        浏览商品
                      </Link>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">我的收藏</h2>
                  <p className="text-center py-16 text-gray-500 dark:text-gray-400">
                    您的收藏夹是空的，浏览商品并收藏您喜欢的商品。
                  </p>
                </div>
              )}
              
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">账户设置</h2>
                  
                  <form className="space-y-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                        姓名
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        className="w-full px-4 py-2 bg-white/10 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        defaultValue={user?.user_metadata?.full_name || ''}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        电子邮箱
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="w-full px-4 py-2 bg-white/10 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        defaultValue={user?.email}
                        disabled
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        邮箱地址无法直接修改。如需更改，请联系客服。
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">
                        手机号码
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        className="w-full px-4 py-2 bg-white/10 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        placeholder="请输入手机号码"
                      />
                    </div>
                    
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                      >
                        保存修改
                      </button>
                    </div>
                  </form>
                  
                  <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium mb-4">修改密码</h3>
                    
                    <form className="space-y-6">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium mb-2">
                          当前密码
                        </label>
                        <input
                          id="currentPassword"
                          type="password"
                          className="w-full px-4 py-2 bg-white/10 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                          placeholder="请输入当前密码"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                          新密码
                        </label>
                        <input
                          id="newPassword"
                          type="password"
                          className="w-full px-4 py-2 bg-white/10 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                          placeholder="请输入新密码"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                          确认新密码
                        </label>
                        <input
                          id="confirmPassword"
                          type="password"
                          className="w-full px-4 py-2 bg-white/10 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                          placeholder="请再次输入新密码"
                        />
                      </div>
                      
                      <div className="pt-4">
                        <button
                          type="submit"
                          className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                        >
                          更新密码
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 