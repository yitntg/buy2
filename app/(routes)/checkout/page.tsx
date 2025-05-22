'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaShippingFast, FaCreditCard, FaShieldAlt, FaCheck } from 'react-icons/fa';
import { useCartStore } from '@/app/lib/store';
import { Address, PaymentMethod } from '@/app/lib/types';

// 模拟支付方式
const paymentMethods: PaymentMethod[] = [
  {
    id: 'airwallex',
    name: 'Airwallex支付',
    icon: 'A',
    description: '使用Airwallex安全支付（推荐）'
  },
  {
    id: 'alipay',
    name: '支付宝',
    icon: '支',
    description: '使用支付宝安全支付'
  },
  {
    id: 'wechat',
    name: '微信支付',
    icon: '微',
    description: '使用微信支付'
  },
  {
    id: 'unionpay',
    name: '银联',
    icon: '银',
    description: '使用银联卡支付'
  },
  {
    id: 'cod',
    name: '货到付款',
    icon: '货',
    description: '送货上门时付款'
  }
];

// 模拟保存的收货地址
const savedAddresses: Address[] = [
  {
    id: 'addr-1',
    user_id: 'test-user-id',
    full_name: '张三',
    phone: '13800138000',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    street_address: '科技园路123号科技大厦5楼501室',
    postal_code: '518000',
    is_default: true
  },
  {
    id: 'addr-2',
    user_id: 'test-user-id',
    full_name: '李四',
    phone: '13900139000',
    province: '北京市',
    city: '北京市',
    district: '海淀区',
    street_address: '中关村大街1号创新大厦2单元303室',
    postal_code: '100080',
    is_default: false
  }
];

const CheckoutPage = () => {
  const router = useRouter();
  const { items, coupon, getCartTotal, clearCart } = useCartStore();
  const { subtotal, discount, shipping, total } = getCartTotal();
  
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  
  // 新地址表单状态
  const [newAddress, setNewAddress] = useState<{
    full_name: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    street_address: string;
    postal_code: string;
    is_default: boolean;
  }>({
    full_name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    street_address: '',
    postal_code: '',
    is_default: false
  });
  
  useEffect(() => {
    // 页面加载时设置默认地址
    const defaultAddress = savedAddresses.find(addr => addr.is_default) || savedAddresses[0];
    setSelectedAddress(defaultAddress);
    
    // 如果购物车为空，重定向到购物车页面
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items.length, router]);
  
  const handleSubmitNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    // 实际应用中，这里应该发送请求到服务器保存地址
    // 模拟保存新地址
    const newSavedAddress: Address = {
      id: `addr-${Date.now()}`,
      user_id: 'test-user-id',
      ...newAddress
    };
    
    setSelectedAddress(newSavedAddress);
    setIsAddingAddress(false);
  };
  
  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedPaymentMethod) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 模拟下单API请求
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 生成订单ID
      const newOrderId = `ORD${Date.now().toString().slice(-8)}`;
      setOrderId(newOrderId);
      
      // 根据支付方式进行不同处理
      if (selectedPaymentMethod === 'airwallex') {
        // 使用Airwallex支付，跳转到支付页面
        router.push(`/payment?orderId=${newOrderId}&amount=${total}&currency=CNY`);
      } else {
        // 其他支付方式
        setOrderComplete(true);
        // 清空购物车
        clearCart();
      }
    } catch (error) {
      console.error('下单失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 如果订单已完成，显示成功页面
  if (orderComplete && orderId) {
    return (
      <div className="min-h-screen py-16 px-6 md:px-10">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-card p-10 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center">
                <FaCheck className="text-4xl" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4">订单提交成功！</h1>
            <p className="text-lg mb-2">感谢您的购买</p>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              您的订单号: <span className="font-semibold">{orderId}</span>
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/account?tab=orders" className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-full transition-all transform hover:scale-105 hover:shadow-lg inline-block">
                查看订单
              </Link>
              <Link href="/products" className="px-8 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-full transition-all transform hover:scale-105 hover:shadow-lg inline-block">
                继续购物
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-6 md:px-10">
      <div className="container mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gradient">结算</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 结算表单 */}
          <div className="flex-1">
            {/* 收货地址部分 */}
            <div className="glass-card p-6 rounded-xl mb-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <FaShippingFast className="mr-2 text-primary-500" /> 收货地址
              </h2>
              
              {!isAddingAddress ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {savedAddresses.map(address => (
                      <div 
                        key={address.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedAddress?.id === address.id 
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                        }`}
                        onClick={() => setSelectedAddress(address)}
                      >
                        <div className="flex justify-between mb-2">
                          <div className="font-medium">{address.full_name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{address.phone}</div>
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          {address.province} {address.city} {address.district}
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                          {address.street_address} ({address.postal_code})
                        </div>
                        {address.is_default && (
                          <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded">
                            默认地址
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => setIsAddingAddress(true)}
                    className="text-primary-500 hover:text-primary-600 transition-colors"
                  >
                    + 添加新地址
                  </button>
                </>
              ) : (
                <form onSubmit={handleSubmitNewAddress} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="full_name" className="block text-sm font-medium mb-2">收货人</label>
                      <input
                        id="full_name"
                        type="text"
                        required
                        className="w-full px-4 py-2 bg-white/10 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        value={newAddress.full_name}
                        onChange={e => setNewAddress({...newAddress, full_name: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">手机号码</label>
                      <input
                        id="phone"
                        type="tel"
                        required
                        className="w-full px-4 py-2 bg-white/10 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        value={newAddress.phone}
                        onChange={e => setNewAddress({...newAddress, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="province" className="block text-sm font-medium mb-2">省份</label>
                      <input
                        id="province"
                        type="text"
                        required
                        className="w-full px-4 py-2 bg-white/10 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        value={newAddress.province}
                        onChange={e => setNewAddress({...newAddress, province: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium mb-2">城市</label>
                      <input
                        id="city"
                        type="text"
                        required
                        className="w-full px-4 py-2 bg-white/10 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        value={newAddress.city}
                        onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="district" className="block text-sm font-medium mb-2">区/县</label>
                      <input
                        id="district"
                        type="text"
                        required
                        className="w-full px-4 py-2 bg-white/10 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        value={newAddress.district}
                        onChange={e => setNewAddress({...newAddress, district: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="street_address" className="block text-sm font-medium mb-2">详细地址</label>
                    <input
                      id="street_address"
                      type="text"
                      required
                      className="w-full px-4 py-2 bg-white/10 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      value={newAddress.street_address}
                      onChange={e => setNewAddress({...newAddress, street_address: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="postal_code" className="block text-sm font-medium mb-2">邮政编码</label>
                    <input
                      id="postal_code"
                      type="text"
                      required
                      className="w-full px-4 py-2 bg-white/10 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      value={newAddress.postal_code}
                      onChange={e => setNewAddress({...newAddress, postal_code: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="is_default"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      checked={newAddress.is_default}
                      onChange={e => setNewAddress({...newAddress, is_default: e.target.checked})}
                    />
                    <label htmlFor="is_default" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      设为默认地址
                    </label>
                  </div>
                  
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
                    >
                      保存地址
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors"
                    >
                      取消
                    </button>
                  </div>
                </form>
              )}
            </div>
            
            {/* 支付方式部分 */}
            <div className="glass-card p-6 rounded-xl mb-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <FaCreditCard className="mr-2 text-primary-500" /> 支付方式
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {paymentMethods.map(method => (
                  <div 
                    key={method.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === method.id 
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                    }`}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-primary-500 font-bold mr-3">
                        {method.icon}
                      </div>
                      <div>
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{method.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 商品列表 */}
            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-6">商品清单</h2>
              
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex items-center border-b border-gray-200 dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                    <div className="w-16 h-16 rounded-lg overflow-hidden relative flex-shrink-0">
                      <Image 
                        src={item.product?.image_url || 'https://via.placeholder.com/150'} 
                        alt={item.product?.name || 'Product'} 
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium">
                        {item.product?.name}
                      </h3>
                      <div className="flex justify-between items-center mt-1">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          数量: {item.quantity}
                        </div>
                        <div className="font-semibold">
                          ¥{((item.product?.price || 0) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* 订单摘要 */}
          <div className="lg:w-1/3">
            <div className="glass-card p-6 rounded-xl sticky top-24">
              <h3 className="text-xl font-semibold mb-6">订单摘要</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">商品总价</span>
                  <span>¥{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">运费</span>
                  <span>{shipping === 0 ? '免费' : `¥${shipping.toFixed(2)}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">折扣</span>
                    <span className="text-green-500">-¥{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between">
                  <span className="font-semibold">应付金额</span>
                  <span className="font-semibold text-xl">¥{total.toFixed(2)}</span>
                </div>
              </div>
              
              <button
                onClick={handlePlaceOrder}
                disabled={!selectedAddress || !selectedPaymentMethod || isSubmitting}
                className={`w-full py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center ${
                  (!selectedAddress || !selectedPaymentMethod || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    处理中...
                  </>
                ) : (
                  <>
                    <FaShieldAlt className="mr-2" /> 提交订单
                  </>
                )}
              </button>
              
              <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                <p className="flex items-center mb-2">
                  <FaShieldAlt className="mr-2" /> 安全支付保障
                </p>
                <p>
                  点击"提交订单"，即表示您同意我们的
                  <Link href="/terms" className="text-primary-500 hover:text-primary-600 ml-1">
                    服务条款
                  </Link>
                  和
                  <Link href="/privacy" className="text-primary-500 hover:text-primary-600 ml-1">
                    隐私政策
                  </Link>
                </p>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <Link href="/cart" className="flex items-center justify-center text-primary-500 hover:text-primary-600 transition-colors">
                <FaArrowLeft className="mr-2" /> 返回购物车
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 