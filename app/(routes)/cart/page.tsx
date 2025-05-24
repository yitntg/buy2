'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaTrash, FaArrowLeft, FaLock, FaCheck, FaTimes, FaMinus, FaPlus } from 'react-icons/fa';
import { useCartStore } from '@/app/lib/store';
import { Coupon, Product } from '@/app/lib/types';
import { supabase } from '@/app/lib/supabase';

// 模拟优惠券数据库，实际应从API获取
const mockCoupons: Coupon[] = [
  {
    id: 'coupon-1',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    min_purchase: 100,
    is_active: true
  },
  {
    id: 'coupon-2',
    code: 'SAVE20',
    type: 'fixed',
    value: 20,
    min_purchase: 200,
    is_active: true
  },
  {
    id: 'coupon-3',
    code: 'FREESHIP',
    type: 'fixed',
    value: 15, // 免运费
    is_active: true
  }
];

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  productImage?: string;
}

interface StoreCartItem {
  id: string;
  product: Product;
  quantity: number;
}

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, clearCart, coupon, applyCoupon, removeCoupon, getCartTotal } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { subtotal, discount, shipping, total } = getCartTotal();
  
  // 当组件加载时，检查是否有已应用的优惠券，并更新显示
  useEffect(() => {
    if (coupon) {
      setCouponCode(coupon.code);
      setCouponMessage({
        text: `优惠券 "${coupon.code}" 已应用`,
        type: 'success'
      });
    }
  }, [coupon]);
  
  useEffect(() => {
    const fetchCartItems = async () => {
      const itemsWithImages = await Promise.all(
        items
          .filter((item): item is typeof item & { product: Product } => item.product !== undefined)
          .map(async (item) => {
            // 获取商品图片
            const { data: imageData } = await supabase
              .from('product_images')
              .select('image_url')
              .eq('product_id', item.product.id)
              .order('sort_order', { ascending: true })
              .limit(1)
              .single();

            return {
              id: item.id,
              product: item.product,
              quantity: item.quantity,
              productImage: imageData?.image_url || '/no-image.png'
            };
          })
      );
      setCartItems(itemsWithImages);
      setLoading(false);
    };

    fetchCartItems();
  }, [items]);
  
  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity);
    }
  };
  
  const handleApplyCoupon = () => {
    // 重置消息
    setCouponMessage(null);
    
    if (!couponCode.trim()) {
      setCouponMessage({
        text: '请输入优惠码',
        type: 'error'
      });
      return;
    }
    
    // 查找匹配的优惠券
    const foundCoupon = mockCoupons.find(
      c => c.code.toUpperCase() === couponCode.toUpperCase() && c.is_active
    );
    
    if (!foundCoupon) {
      setCouponMessage({
        text: '无效的优惠码',
        type: 'error'
      });
      return;
    }
    
    // 检查最低消费要求
    if (foundCoupon.min_purchase && subtotal < foundCoupon.min_purchase) {
      setCouponMessage({
        text: `需要最低消费 ¥${foundCoupon.min_purchase.toFixed(2)} 才能使用此优惠码`,
        type: 'error'
      });
      return;
    }
    
    // 应用优惠券
    applyCoupon(foundCoupon);
    setCouponMessage({
      text: '优惠券应用成功！',
      type: 'success'
    });
  };
  
  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCode('');
    setCouponMessage(null);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen py-16 px-6 md:px-10">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">购物车是空的</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              快去添加一些商品吧！
            </p>
            <Link 
              href="/products" 
              className="inline-flex items-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
            >
              <FaArrowLeft className="mr-2" />
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
              
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-start gap-4 py-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <div className="w-20 h-20 rounded-lg overflow-hidden relative flex-shrink-0">
                    <Image 
                      src={item.productImage || '/no-image.png'} 
                      alt={item.product.name} 
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <Link 
                      href={`/products/${item.product.id}`}
                      className="text-lg font-medium hover:text-primary-500 transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.product.id.toString(), Math.max(0, item.quantity - 1))}
                          className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
                        >
                          <FaMinus className="text-sm" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.product.id.toString(), item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
                        >
                          <FaPlus className="text-sm" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium">¥{item.product.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      小计: ¥{(item.product.price * item.quantity).toFixed(2)}
                    </p>
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
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    placeholder="输入优惠码" 
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={!!coupon}
                  />
                  {coupon ? (
                    <button 
                      className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex items-center"
                      onClick={handleRemoveCoupon}
                    >
                      <FaTimes className="mr-2" /> 移除
                    </button>
                  ) : (
                    <button 
                      className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
                      onClick={handleApplyCoupon}
                      disabled={!couponCode}
                    >
                      应用
                    </button>
                  )}
                </div>
                
                {couponMessage && (
                  <div className={`mt-2 text-sm ${couponMessage.type === 'success' ? 'text-green-500 flex items-center' : 'text-red-500'}`}>
                    {couponMessage.type === 'success' && <FaCheck className="mr-1" />}
                    {couponMessage.text}
                  </div>
                )}
                
                <div className="mt-2 text-sm text-gray-500">
                  <p>可用优惠券:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>WELCOME10: 订单满¥100享9折</li>
                    <li>SAVE20: 订单满¥200立减¥20</li>
                    <li>FREESHIP: 免运费</li>
                  </ul>
                </div>
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
                  <span>{shipping === 0 ? '免费' : `¥${shipping.toFixed(2)}`}</span>
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