'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaShoppingCart, FaSearch, FaUser, FaHeart, FaArrowRight } from 'react-icons/fa';
import ProductCard from './components/ProductCard';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { Product, Category } from './lib/types';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  useEffect(() => {
    setIsLoaded(true);
    
    // 获取精选商品
    const fetchFeaturedProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .limit(8);
        
      if (!error && data) {
        setFeaturedProducts(data);
      }
    };
    
    // 获取分类
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          *,
          category_images (
            image_url
          )
        `)
        .limit(6);
        
      if (!error && data) {
        setCategories(data.map(category => ({
          ...category,
          image_url: category.category_images?.[0]?.image_url || '/no-image.png'
        })));
      }
    };
    
    fetchFeaturedProducts();
    fetchCategories();
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
        <div className="relative z-20 container mx-auto h-full flex flex-col justify-center px-6 md:px-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            现代购物体验
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mb-8 animate-slide-up">
            发现精选商品，享受优质服务
          </p>
          <div className="flex gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/products" className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-full transition-all transform hover:scale-105 hover:shadow-lg">
              开始购物
            </Link>
            <Link href="/categories" className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-full backdrop-blur-md transition-all transform hover:scale-105">
              浏览分类
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

      {/* 分类浏览 */}
      <section className="py-16 px-6 md:px-10">
        <div className="container mx-auto">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">浏览分类</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl text-center">
              探索我们多样化的商品分类，找到你喜欢的商品
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="relative group overflow-hidden rounded-xl">
                <div className="aspect-square relative">
                  <Image 
                    src={category.image_url || '/no-image.png'}
                    alt={category.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                </div>
                <div className="absolute inset-0 flex items-end p-4">
                  <h3 className="text-white text-lg font-semibold">{category.name}</h3>
                </div>
                <Link href={`/categories/${category.id}`} className="absolute inset-0"></Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
} 