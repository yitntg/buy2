'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaShoppingCart, FaSearch, FaUser, FaHeart, FaArrowRight } from 'react-icons/fa';
import ProductCard from './components/ProductCard';
import { useEffect, useState } from 'react';

// 模拟产品数据
const featuredProducts = Array.from({ length: 8 }).map((_, i) => ({
  id: `product-${i + 1}`,
  name: `时尚商品 ${i + 1}`,
  description: '这是一个非常棒的商品，质量上乘，设计精美。',
  price: 199 + i * 50,
  original_price: i % 2 === 0 ? 299 + i * 50 : undefined,
  image_url: `https://picsum.photos/600/800?random=${i + 1}`,
  category: `category-${(i % 3) + 1}`,
  is_featured: true,
  is_new: i % 4 === 0,
  stock_quantity: 10 + i,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  return (
    <main className="min-h-screen">
      {/* 英雄区域 */}
      <section className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800/70 to-purple-800/70 z-10"></div>
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1607082352121-fa243f3dde32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Modern Shopping Experience"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        <div className="relative z-20 container mx-auto h-full flex flex-col justify-center items-start px-6 md:px-10">
          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 animated-gradient-text transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            未来购物体验
          </h1>
          <p className={`text-xl md:text-2xl text-white/90 max-w-2xl mb-8 transition-opacity duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            探索我们精心挑选的商品，体验前所未有的购物乐趣
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 transition-opacity duration-1000 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <Link href="/products" className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-full transition-all transform hover:scale-105 hover:shadow-lg">
              立即购物
            </Link>
            <Link href="/categories" className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-medium rounded-full transition-all transform hover:scale-105 hover:shadow-lg">
              探索分类
            </Link>
          </div>
        </div>
      </section>

      {/* 特色商品 */}
      <section className="py-16 px-6 md:px-10">
        <div className="container mx-auto">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">特色商品</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl text-center">
              发现我们最受欢迎的商品，享受优质购物体验
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-12 flex justify-center">
            <Link href="/products" className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-full transition-all transform hover:scale-105 hover:shadow-lg">
              查看更多
            </Link>
          </div>
        </div>
      </section>

      {/* 促销区域 */}
      <section className="py-16 px-6 md:px-10 bg-gradient-to-r from-primary-600/10 to-secondary-600/10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="gradient-border h-full">
                <div className="relative h-full overflow-hidden rounded-lg p-8 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-2 text-gradient">限时优惠</h3>
                    <p className="text-lg mb-6">购买任意商品，享受8折优惠</p>
                    <Link href="/deals" className="inline-block px-6 py-2 bg-accent-500 hover:bg-accent-600 text-white font-medium rounded-full transition-all transform hover:scale-105">
                      立即抢购
                    </Link>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/20 rounded-full blur-3xl"></div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="gradient-border h-full">
                <div className="relative h-full overflow-hidden rounded-lg p-8 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-2 text-gradient">新品上市</h3>
                    <p className="text-lg mb-6">探索我们最新的时尚单品</p>
                    <Link href="/new-arrivals" className="inline-block px-6 py-2 bg-secondary-500 hover:bg-secondary-600 text-white font-medium rounded-full transition-all transform hover:scale-105">
                      查看新品
                    </Link>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-500/20 rounded-full blur-3xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 分类区域 */}
      <section className="py-16 px-6 md:px-10">
        <div className="container mx-auto">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">浏览分类</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl text-center">
              探索我们多样化的商品分类，找到你喜欢的商品
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['时尚', '电子', '家居', '美妆', '运动', '配饰'].map((category, index) => (
              <div key={index} className="relative group overflow-hidden rounded-xl">
                <div className="aspect-square relative">
                  <Image 
                    src={`https://picsum.photos/400/400?random=${index + 10}`}
                    alt={category}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                </div>
                <div className="absolute inset-0 flex items-end p-4">
                  <h3 className="text-white text-lg font-semibold">{category}</h3>
                </div>
                <Link href={`/categories/${category}`} className="absolute inset-0"></Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 特色内容 */}
      <section className="py-16 px-6 md:px-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 rounded-xl text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">品质保证</h3>
              <p className="text-gray-600 dark:text-gray-300">
                我们只提供最高品质的商品，确保每一位顾客的满意度
              </p>
            </div>
            <div className="glass-card p-6 rounded-xl text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">免费配送</h3>
              <p className="text-gray-600 dark:text-gray-300">
                所有订单均享受免费配送服务，让您足不出户享受购物乐趣
              </p>
            </div>
            <div className="glass-card p-6 rounded-xl text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">安全支付</h3>
              <p className="text-gray-600 dark:text-gray-300">
                我们提供多种安全的支付方式，保障您的支付安全和隐私
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 客户见证 */}
      <section className="py-16 px-6 md:px-10 bg-gradient-to-r from-primary-600/5 to-secondary-600/5">
        <div className="container mx-auto">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">客户见证</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl text-center">
              看看我们的客户如何评价我们的产品和服务
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((testimonial) => (
              <div key={testimonial} className="glass-card p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={`https://randomuser.me/api/portraits/${testimonial % 2 === 0 ? 'women' : 'men'}/${testimonial + 10}.jpg`}
                      alt="Customer"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">顾客 {testimonial}</h4>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  这是我购物过的最好的网站！商品质量非常高，配送速度快，客服也很专业。强烈推荐给所有人！
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 flex justify-center">
            <Link href="/testimonials" className="flex items-center text-primary-500 hover:text-primary-600 transition-colors">
              查看更多评价 <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* 订阅区域 */}
      <section className="py-16 px-6 md:px-10">
        <div className="container mx-auto max-w-4xl">
          <div className="gradient-border">
            <div className="relative overflow-hidden rounded-lg p-8 md:p-12 bg-white/5 backdrop-blur-sm">
              <div className="relative z-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">订阅我们的通讯</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                  订阅我们的通讯，获取最新的优惠信息和新品上市通知
                </p>
                <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                  <input 
                    type="email" 
                    placeholder="您的邮箱地址" 
                    className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                  <button 
                    type="submit" 
                    className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
                  >
                    订阅
                  </button>
                </form>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-500/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 