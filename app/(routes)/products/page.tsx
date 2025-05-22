'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaFilter, FaSort, FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa';
import ProductCard from '@/app/components/ProductCard';
import { supabase } from '@/app/lib/supabase';
import { Product } from '@/app/lib/types';

// 模拟分类数据
const categories = [
  { id: 'all', name: '全部' },
  { id: 'fashion', name: '时尚' },
  { id: 'electronics', name: '电子' },
  { id: 'home', name: '家居' },
  { id: 'beauty', name: '美妆' },
  { id: 'sports', name: '运动' },
  { id: 'accessories', name: '配饰' }
];

const ProductsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  
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
  
  // 从URL参数中获取初始分类
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl && categories.some(cat => cat.id === categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);
  
  // 拉取真实商品数据
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data) {
        setProducts(data);
      }
    }
    fetchProducts();
  }, []);
  
  // 更新URL参数
  const updateUrlParams = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  };
  
  // 修改分类选择处理函数
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    updateUrlParams(newCategory);
  };
  
  // 重置过滤条件
  const resetFilters = () => {
    setSelectedCategory('all');
    setPriceRange({ min: '', max: '' });
    setFilters({
      inStock: false,
      featured: false,
      onSale: false
    });
    
    // 重置URL参数
    router.push('/products', { scroll: false });
  };
  
  // 过滤并排序产品
  const filteredProducts = () => {
    let filtered = [...products];
    
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
          <div className="glass-card p-5 mb-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">过滤与排序</h3>
              
              <select 
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-gray-800 dark:text-gray-200 w-36"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                style={{ color: 'currentColor' }}
              >
                <option value="popularity" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">热门程度</option>
                <option value="price-low" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">价格: 低到高</option>
                <option value="price-high" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">价格: 高到低</option>
                <option value="newest" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">最新上架</option>
              </select>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <button 
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filters.inStock ? 'bg-primary-500 text-white' : 'bg-white/10 hover:bg-white/20 text-gray-700 dark:text-gray-200'}`}
                onClick={() => setFilters({...filters, inStock: !filters.inStock})}
              >
                有货
              </button>
              <button 
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filters.featured ? 'bg-primary-500 text-white' : 'bg-white/10 hover:bg-white/20 text-gray-700 dark:text-gray-200'}`}
                onClick={() => setFilters({...filters, featured: !filters.featured})}
              >
                特色商品
              </button>
              <button 
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filters.onSale ? 'bg-primary-500 text-white' : 'bg-white/10 hover:bg-white/20 text-gray-700 dark:text-gray-200'}`}
                onClick={() => setFilters({...filters, onSale: !filters.onSale})}
              >
                优惠商品
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative">
                <button 
                  className="w-full flex items-center justify-between px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
                  onClick={() => setIsPriceFilterOpen(!isPriceFilterOpen)}
                >
                  <span>价格: {priceRange.min || priceRange.max ? `¥${priceRange.min || '0'} - ¥${priceRange.max || '∞'}` : '所有价格'}</span>
                  <FaChevronDown className="transition-transform" style={{transform: isPriceFilterOpen ? 'rotate(180deg)' : 'rotate(0deg)'}} />
                </button>
                
                {isPriceFilterOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-20">
                    <div className="flex space-x-3">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">最低价格</label>
                        <input
                          type="number"
                          placeholder="最低"
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-gray-800 dark:text-gray-200"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">最高价格</label>
                        <input
                          type="number"
                          placeholder="最高"
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-gray-800 dark:text-gray-200"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-3">
                      <button 
                        className="px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors text-sm"
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
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-gray-800 dark:text-gray-200 text-sm"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  style={{ color: 'currentColor' }}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id} className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* 激活的过滤条件展示 */}
            {(selectedCategory !== 'all' || filters.inStock || filters.featured || filters.onSale || priceRange.min || priceRange.max) && (
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
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
                  className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors"
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
                  <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors opacity-50 cursor-not-allowed">
                    &lt;
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-500 text-white">
                    1
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors opacity-50 cursor-not-allowed">
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