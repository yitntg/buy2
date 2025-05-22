'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaFilter, FaSort, FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa';
import ProductCard from '@/app/components/ProductCard';

// 模拟产品数据
const mockProducts = Array.from({ length: 12 }).map((_, i) => ({
  id: `product-${i + 1}`,
  name: `时尚商品 ${i + 1}`,
  description: '这是一个非常棒的商品，质量上乘，设计精美。',
  price: 199 + i * 50,
  original_price: i % 2 === 0 ? 299 + i * 50 : undefined,
  image_url: `https://picsum.photos/600/800?random=${i + 20}`,
  category_id: `category-${(i % 3) + 1}`,
  is_featured: i % 5 === 0,
  is_new: i % 4 === 0,
  stock_quantity: 10 + i,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

// 模拟分类数据
const categories = [
  { id: 'all', name: '全部' },
  { id: 'category-1', name: '时尚' },
  { id: 'category-2', name: '电子' },
  { id: 'category-3', name: '家居' },
];

const ProductsPage = () => {
  // 添加状态管理
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [isPriceFilterOpen, setIsPriceFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('popularity');
  const [filters, setFilters] = useState({
    inStock: false,
    featured: false,
    onSale: false
  });
  
  // 重置过滤条件
  const resetFilters = () => {
    setSelectedCategory('all');
    setPriceRange({ min: '', max: '' });
    setFilters({
      inStock: false,
      featured: false,
      onSale: false
    });
  };
  
  // 过滤并排序产品
  const filteredProducts = () => {
    let filtered = [...mockProducts];
    
    // 分类过滤
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category_id === selectedCategory);
    }
    
    // 价格区间过滤
    if (priceRange.min && priceRange.max) {
      filtered = filtered.filter(
        product => product.price >= Number(priceRange.min) && product.price <= Number(priceRange.max)
      );
    } else if (priceRange.min) {
      filtered = filtered.filter(product => product.price >= Number(priceRange.min));
    } else if (priceRange.max) {
      filtered = filtered.filter(product => product.price <= Number(priceRange.max));
    }
    
    // 库存过滤
    if (filters.inStock) {
      filtered = filtered.filter(product => product.stock_quantity > 0);
    }
    
    // 特色商品过滤
    if (filters.featured) {
      filtered = filtered.filter(product => product.is_featured);
    }
    
    // 优惠商品过滤
    if (filters.onSale) {
      filtered = filtered.filter(product => product.original_price);
    }
    
    // 应用排序
    if (sortOrder === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOrder === 'newest') {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    
    return filtered;
  };
  
  const displayProducts = filteredProducts();
  
  return (
    <main className="min-h-screen">
      {/* 页面头部 */}
      <div className="relative h-[40vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800/70 to-purple-800/70 z-10"></div>
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80" 
            alt="Products Banner"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        <div className="relative z-20 container mx-auto h-full flex flex-col justify-center px-6 md:px-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            我们的商品
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            探索我们精选的商品系列，满足您的各种需求
          </p>
        </div>
      </div>

      {/* 产品列表 */}
      <section className="py-16 px-6 md:px-10">
        <div className="container mx-auto">
          {/* 顶部水平过滤栏 - 简化版 */}
          <div className="glass-card p-6 mb-8 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xl font-semibold">过滤与排序</h3>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <button 
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filters.inStock ? 'bg-primary-500 text-white' : 'bg-white/10 hover:bg-white/20 text-gray-700 dark:text-gray-200'}`}
                onClick={() => setFilters({...filters, inStock: !filters.inStock})}
              >
                有货
              </button>
              <button 
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filters.featured ? 'bg-primary-500 text-white' : 'bg-white/10 hover:bg-white/20 text-gray-700 dark:text-gray-200'}`}
                onClick={() => setFilters({...filters, featured: !filters.featured})}
              >
                特色商品
              </button>
              <button 
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filters.onSale ? 'bg-primary-500 text-white' : 'bg-white/10 hover:bg-white/20 text-gray-700 dark:text-gray-200'}`}
                onClick={() => setFilters({...filters, onSale: !filters.onSale})}
              >
                优惠商品
              </button>
              
              <div className="ml-auto flex items-center gap-3">
                <select 
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="popularity">热门程度</option>
                  <option value="price-low">价格: 低到高</option>
                  <option value="price-high">价格: 高到低</option>
                  <option value="newest">最新上架</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative">
                <button 
                  className="w-full flex items-center justify-between px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onClick={() => setIsPriceFilterOpen(!isPriceFilterOpen)}
                >
                  <span>价格区间 {priceRange.min || priceRange.max ? `(¥${priceRange.min || '0'} - ¥${priceRange.max || '∞'})` : ''}</span>
                  <FaChevronDown className="transition-transform" style={{transform: isPriceFilterOpen ? 'rotate(180deg)' : 'rotate(0deg)'}} />
                </button>
                
                {isPriceFilterOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-20">
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">最低价格</label>
                        <input
                          type="number"
                          placeholder="最低"
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">最高价格</label>
                        <input
                          type="number"
                          placeholder="最高"
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <button 
                        className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
                        onClick={() => setIsPriceFilterOpen(false)}
                      >
                        应用
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex">
                <select 
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      商品分类: {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* 激活的过滤条件展示 */}
            {(selectedCategory !== 'all' || filters.inStock || filters.featured || filters.onSale || priceRange.min || priceRange.max) && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">已选条件:</span>
                  
                  {selectedCategory !== 'all' && (
                    <span className="flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm">
                      {categories.find(cat => cat.id === selectedCategory)?.name}
                      <button 
                        className="ml-2 text-primary-400 hover:text-primary-600"
                        onClick={() => setSelectedCategory('all')}
                      >
                        <FaTimes size={12} />
                      </button>
                    </span>
                  )}
                  
                  {filters.inStock && (
                    <span className="flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm">
                      有货
                      <button 
                        className="ml-2 text-primary-400 hover:text-primary-600"
                        onClick={() => setFilters({...filters, inStock: false})}
                      >
                        <FaTimes size={12} />
                      </button>
                    </span>
                  )}
                  
                  {filters.featured && (
                    <span className="flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm">
                      特色商品
                      <button 
                        className="ml-2 text-primary-400 hover:text-primary-600"
                        onClick={() => setFilters({...filters, featured: false})}
                      >
                        <FaTimes size={12} />
                      </button>
                    </span>
                  )}
                  
                  {filters.onSale && (
                    <span className="flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm">
                      优惠商品
                      <button 
                        className="ml-2 text-primary-400 hover:text-primary-600"
                        onClick={() => setFilters({...filters, onSale: false})}
                      >
                        <FaTimes size={12} />
                      </button>
                    </span>
                  )}
                  
                  {(priceRange.min || priceRange.max) && (
                    <span className="flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm">
                      价格: ¥{priceRange.min || '0'} - ¥{priceRange.max || '∞'}
                      <button 
                        className="ml-2 text-primary-400 hover:text-primary-600"
                        onClick={() => setPriceRange({ min: '', max: '' })}
                      >
                        <FaTimes size={12} />
                      </button>
                    </span>
                  )}
                </div>
                
                <button 
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors"
                  onClick={resetFilters}
                >
                  重置过滤
                </button>
              </div>
            )}
          </div>
          
          {/* 产品网格 */}
          <div className="w-full">
            <div className="flex justify-between items-center mb-8">
              <p className="text-gray-700 dark:text-gray-200">
                显示 <span className="font-semibold">{displayProducts.length}</span> 个结果
              </p>
            </div>
            
            {displayProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="glass-card p-10 text-center">
                <h3 className="text-xl font-semibold mb-4">没有找到商品</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  您的过滤条件没有匹配的商品，请尝试调整过滤条件。
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
                >
                  重置过滤
                </button>
              </div>
            )}
            
            {/* 分页 */}
            {displayProducts.length > 0 && (
              <div className="mt-12 flex justify-center">
                <div className="flex space-x-2">
                  <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                    &lt;
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-500 text-white">
                    1
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                    2
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                    3
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                    &gt;
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductsPage; 