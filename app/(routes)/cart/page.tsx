'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaTrash, FaArrowLeft, FaLock } from 'react-icons/fa';
import { useCartStore } from '@/app/lib/store';

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  
  const subtotal = items.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0);
  const shipping = subtotal > 0 ? 15 : 0;
  const discount = 0; // 实际应用中应该基于优惠券代码计算
  const total = subtotal + shipping - discount;
  
  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity);
    }
  };
  
  if (items.length === 0) {
    return (
      <div className="min-h-screen py-16 px-6 md:px-10">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-card p-10 text-center">
            <h1 className="text-3xl font-bold mb-6">您的购物车是空的</h1>
            <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
              看起来您还没有添加任何商品到购物车。
            </p>
            <Link href="/products" className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-full transition-all transform hover:scale-105 hover:shadow-lg inline-block">
              继续购物
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-6 md:px-10">
      <div className="container mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gradient">您的购物车</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 购物车项目 */}
          <div className="flex-1">
            <div className="glass-card p-6 rounded-xl mb-6">
              <div className="hidden md:grid grid-cols-12 gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="col-span-6">
                  <h3 className="text-lg font-semibold">商品</h3>
                </div>
                <div className="col-span-2 text-center">
                  <h3 className="text-lg font-semibold">价格</h3>
                </div>
                <div className="col-span-2 text-center">
                  <h3 className="text-lg font-semibold">数量</h3>
                </div>
                <div className="col-span-2 text-right">
                  <h3 className="text-lg font-semibold">小计</h3>
                </div>
              </div>
              
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 py-6 border-b border-gray-200 dark:border-gray-700 last:border-0">
                  {/* 移动视图标题 */}
                  <div className="md:hidden text-lg font-semibold mb-2">
                    {item.product?.name}
                  </div>
                  
                  {/* 商品 */}
                  <div className="col-span-1 md:col-span-6 flex items-center">
                    <div className="w-20 h-20 rounded-lg overflow-hidden relative flex-shrink-0">
                      <Image 
                        src={item.product?.image_url || 'https://via.placeholder.com/150'} 
                        alt={item.product?.name || 'Product'} 
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="ml-4 flex-1 hidden md:block">
                      <h3 className="text-lg font-semibold">
                        <Link href={`/products/${item.product_id}`} className="hover:text-primary-500 transition-colors">
                          {item.product?.name}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        类别: {item.product?.category_id.replace('category-', '').replace(/^\w/, c => c.toUpperCase())}
                      </p>
                    </div>
                  </div>
                  
                  {/* 价格 */}
                  <div className="col-span-1 md:col-span-2 flex items-center md:justify-center">
                    <div className="md:hidden">价格:</div>
                    <div className="ml-auto md:ml-0">¥{item.product?.price.toFixed(2)}</div>
                  </div>
                  
                  {/* 数量 */}
                  <div className="col-span-1 md:col-span-2 flex items-center md:justify-center">
                    <div className="flex items-center">
                      <div className="md:hidden mr-2">数量:</div>
                      <div className="flex border border-gray-300 dark:border-gray-700 rounded-lg">
                        <button 
                          onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-l-lg"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.product_id, parseInt(e.target.value) || 1)}
                          className="w-10 text-center border-none bg-transparent focus:outline-none focus:ring-0"
                        />
                        <button 
                          onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-r-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* 小计和删除按钮 */}
                  <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end">
                    <div className="flex items-center">
                      <div className="md:hidden mr-2">小计:</div>
                      <div className="font-semibold">¥{((item.product?.price || 0) * item.quantity).toFixed(2)}</div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.product_id)}
                      className="ml-4 text-red-500 hover:text-red-600 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
              
              {/* 购物车操作 */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                <Link href="/products" className="flex items-center text-primary-500 hover:text-primary-600 transition-colors">
                  <FaArrowLeft className="mr-2" /> 继续购物
                </Link>
                <button 
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  清空购物车
                </button>
              </div>
            </div>
            
            {/* 优惠券 */}
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">应用优惠券</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  placeholder="输入优惠码" 
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button 
                  className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
                  disabled={!couponCode}
                >
                  应用
                </button>
              </div>
            </div>
          </div>
          
          {/* 订单摘要 */}
          <div className="lg:w-1/3">
            <div className="glass-card p-6 rounded-xl sticky top-24">
              <h3 className="text-xl font-semibold mb-6">订单摘要</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">小计</span>
                  <span>¥{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">运费</span>
                  <span>¥{shipping.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">折扣</span>
                    <span className="text-green-500">-¥{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between">
                  <span className="font-semibold">总计</span>
                  <span className="font-semibold text-xl">¥{total.toFixed(2)}</span>
                </div>
              </div>
              
              <Link href="/checkout" className="w-full py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center">
                <FaLock className="mr-2" /> 结账
              </Link>
              
              <div className="mt-6">
                <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                  我们接受以下付款方式
                </p>
                <div className="flex justify-center space-x-2 mt-3">
                  <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 