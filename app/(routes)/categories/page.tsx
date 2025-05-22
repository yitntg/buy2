'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

// 模拟分类数据
const categories = [
  { 
    id: 'fashion', 
    name: '时尚', 
    description: '探索最新的时尚趋势，包括服装、鞋履和配饰',
    image: 'https://picsum.photos/600/400?random=1',
    itemCount: 120
  },
  { 
    id: 'electronics', 
    name: '电子', 
    description: '发现最新的电子产品、智能设备和配件',
    image: 'https://picsum.photos/600/400?random=2',
    itemCount: 85
  },
  { 
    id: 'home', 
    name: '家居', 
    description: '改善您的生活空间，浏览我们的家居装饰和家具系列',
    image: 'https://picsum.photos/600/400?random=3',
    itemCount: 95
  },
  { 
    id: 'beauty', 
    name: '美妆', 
    description: '发现高品质的美容和个人护理产品',
    image: 'https://picsum.photos/600/400?random=4',
    itemCount: 72
  },
  { 
    id: 'sports', 
    name: '运动', 
    description: '浏览我们的运动装备、健身器材和户外用品',
    image: 'https://picsum.photos/600/400?random=5',
    itemCount: 68
  },
  { 
    id: 'accessories', 
    name: '配饰', 
    description: '用精美的配饰为您的造型增添亮点',
    image: 'https://picsum.photos/600/400?random=6',
    itemCount: 105
  }
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen py-16 px-6 md:px-10">
      {/* 页面头部 */}
      <div className="relative h-[30vh] mb-16 overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800/70 to-purple-800/70 z-10"></div>
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1573855619003-97b4799dcd8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Categories Banner"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        <div className="relative z-20 container mx-auto h-full flex flex-col justify-center px-6 md:px-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            商品分类
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            浏览所有商品分类，找到您喜欢的商品
          </p>
        </div>
      </div>

      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="glass-card overflow-hidden group">
              <div className="relative h-48">
                <Image 
                  src={category.image} 
                  alt={category.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {category.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {category.itemCount} 件商品
                  </span>
                  <Link 
                    href={`/categories/${category.id}`}
                    className="inline-flex items-center text-primary-500 hover:text-primary-600 transition-colors"
                  >
                    浏览全部 <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 