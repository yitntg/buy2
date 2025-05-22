'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaFilter, FaArrowLeft, FaChevronDown, FaTimes } from 'react-icons/fa';
import ProductCard from '@/app/components/ProductCard';

// 模拟分类数据
const categoriesData = {
  fashion: { 
    id: 'fashion', 
    name: '时尚', 
    description: '探索最新的时尚趋势，包括服装、鞋履和配饰',
    image: 'https://picsum.photos/1200/400?random=1',
  },
  electronics: { 
    id: 'electronics', 
    name: '电子', 
    description: '发现最新的电子产品、智能设备和配件',
    image: 'https://picsum.photos/1200/400?random=2',
  },
  home: { 
    id: 'home', 
    name: '家居', 
    description: '改善您的生活空间，浏览我们的家居装饰和家具系列',
    image: 'https://picsum.photos/1200/400?random=3',
  },
  beauty: { 
    id: 'beauty', 
    name: '美妆', 
    description: '发现高品质的美容和个人护理产品',
    image: 'https://picsum.photos/1200/400?random=4',
  },
  sports: { 
    id: 'sports', 
    name: '运动', 
    description: '浏览我们的运动装备、健身器材和户外用品',
    image: 'https://picsum.photos/1200/400?random=5',
  },
  accessories: { 
    id: 'accessories', 
    name: '配饰', 
    description: '用精美的配饰为您的造型增添亮点',
    image: 'https://picsum.photos/1200/400?random=6',
  }
};

// 模拟根据分类生成商品数据
const generateProductsByCategory = (categoryId: string) => {
  // 为每个分类生成2个商品
  return Array.from({ length: 2 }).map((_, i) => ({
    id: `${categoryId}-${i + 1}`,
    name: `${getCategoryName(categoryId)} 商品 ${i + 1}`,
    description: '这是一个非常棒的商品，质量上乘，设计精美。',
    price: 199 + i * 50,
    original_price: i % 2 === 0 ? 299 + i * 50 : undefined,
    image_url: `https://picsum.photos/600/800?random=${categoryId}-${i + 20}`,
    category_id: categoryId,
    is_featured: i % 5 === 0,
    is_new: i % 4 === 0,
    stock_quantity: 10 + i,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
};

// 获取分类名称
const getCategoryName = (categoryId: string) => {
  return categoriesData[categoryId as keyof typeof categoriesData]?.name || categoryId;
};

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [products, setProducts] = useState<any[]>([]);
  const [categoryInfo, setCategoryInfo] = useState<any>(null);
  const [sortOrder, setSortOrder] = useState('popularity');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [isPriceFilterOpen, setIsPriceFilterOpen] = useState(false);
  const [showInStock, setShowInStock] = useState(false);
  const [showFeatured, setShowFeatured] = useState(false);
  const [showOnSale, setShowOnSale] = useState(false);
  
  useEffect(() => {
    // 设置分类信息
    const category = categoriesData[slug as keyof typeof categoriesData];
    setCategoryInfo(category || { id: slug, name: slug, description: '商品分类', image: 'https://picsum.photos/1200/400?random=99' });
    
    // 获取该分类的商品
    const categoryProducts = generateProductsByCategory(slug);
    setProducts(categoryProducts);
  }, [slug]);
  
  // 过滤和排序商品
  const filteredAndSortedProducts = () => {
    // 应用过滤条件
    let filtered = [...products];
    
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
    if (showInStock) {
      filtered = filtered.filter(product => product.stock_quantity > 0);
    }
    
    // 特色商品过滤
    if (showFeatured) {
      filtered = filtered.filter(product => product.is_featured);
    }
    
    // 优惠商品过滤
    if (showOnSale) {
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
    // 热门程度排序（默认）保持原排序
    
    return filtered;
  };
  
  const displayProducts = filteredAndSortedProducts();
  
  // 重置所有过滤条件
  const resetFilters = () => {
    setShowInStock(false);
    setShowFeatured(false);
    setShowOnSale(false);
    setPriceRange({ min: '', max: '' });
  };
  
  return (
    <div className="min-h-screen">
      {/* 分类头部 */}
      {categoryInfo && (
        <div className="relative h-[30vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-800/70 to-purple-800/70 z-10"></div>
          <div className="absolute inset-0">
            <Image 
              src={categoryInfo.image} 
              alt={categoryInfo.name}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
          <div className="relative z-20 container mx-auto h-full flex flex-col justify-center px-6 md:px-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {categoryInfo.name}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mb-4">
              {categoryInfo.description}
            </p>
            <div>
              <Link 
                href={`/products?category=${slug}`}
                className="inline-flex items-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
              >
                查看所有{categoryInfo.name}产品
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 商品列表 */}
      <section className="py-16 px-6 md:px-10">
        <div className="container mx-auto">
          {/* 面包屑导航 */}
          <nav className="mb-8 text-sm">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="text-gray-500 hover:text-primary-500 transition-colors">首页</Link>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-gray-400">/</span>
                <Link href="/categories" className="text-gray-500 hover:text-primary-500 transition-colors">分类</Link>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-gray-400">/</span>
                <span className="text-gray-700 dark:text-gray-300">{categoryInfo?.name}</span>
              </li>
            </ol>
          </nav>
          
          {/* 顶部水平过滤栏 - 简化版 */}
          <div className="glass-card p-4 md:p-5 mb-6 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg font-semibold">过滤与排序</h3>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <button 
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${showInStock ? 'bg-primary-500 text-white' : 'bg-white/10 hover:bg-white/20 text-gray-700 dark:text-gray-200'}`}
                onClick={() => setShowInStock(!showInStock)}
              >
                有货
              </button>
              <button 
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${showFeatured ? 'bg-primary-500 text-white' : 'bg-white/10 hover:bg-white/20 text-gray-700 dark:text-gray-200'}`}
                onClick={() => setShowFeatured(!showFeatured)}
              >
                特色商品
              </button>
              <button 
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${showOnSale ? 'bg-primary-500 text-white' : 'bg-white/10 hover:bg-white/20 text-gray-700 dark:text-gray-200'}`}
                onClick={() => setShowOnSale(!showOnSale)}
              >
                优惠商品
              </button>
              
              <div className="ml-auto flex items-center gap-2">
                <select 
                  className="px-3 py-1.5 text-xs bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-gray-800 dark:text-gray-200"
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
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="relative">
                <button 
                  className="w-full flex items-center justify-between px-3 py-1.5 text-xs bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                  onClick={() => setIsPriceFilterOpen(!isPriceFilterOpen)}
                >
                  <span>价格: {priceRange.min || priceRange.max ? `¥${priceRange.min || '0'} - ¥${priceRange.max || '∞'}` : '所有价格'}</span>
                  <FaChevronDown className="transition-transform" style={{transform: isPriceFilterOpen ? 'rotate(180deg)' : 'rotate(0deg)'}} />
                </button>
                
                {isPriceFilterOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-20">
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">最低价格</label>
                        <input
                          type="number"
                          placeholder="最低"
                          className="w-full px-2 py-1 text-xs bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-gray-800 dark:text-gray-200"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">最高价格</label>
                        <input
                          type="number"
                          placeholder="最高"
                          className="w-full px-2 py-1 text-xs bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-gray-800 dark:text-gray-200"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-2">
                      <button 
                        className="px-2 py-1 text-xs bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
                        onClick={() => setIsPriceFilterOpen(false)}
                      >
                        应用
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <Link 
                  href="/categories" 
                  className="px-3 py-1.5 text-xs border border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 font-medium rounded-lg transition-colors flex items-center"
                >
                  <FaArrowLeft className="mr-1" /> 返回分类
                </Link>
              </div>
            </div>
            
            {/* 激活的过滤条件展示 */}
            {(showInStock || showFeatured || showOnSale || priceRange.min || priceRange.max) && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-xs text-gray-600 dark:text-gray-400">已选条件:</span>
                  
                  {showInStock && (
                    <span className="flex items-center px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-xs">
                      有货
                      <button 
                        className="ml-1 text-primary-400 hover:text-primary-600"
                        onClick={() => setShowInStock(false)}
                      >
                        <FaTimes size={10} />
                      </button>
                    </span>
                  )}
                  
                  {showFeatured && (
                    <span className="flex items-center px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-xs">
                      特色商品
                      <button 
                        className="ml-1 text-primary-400 hover:text-primary-600"
                        onClick={() => setShowFeatured(false)}
                      >
                        <FaTimes size={10} />
                      </button>
                    </span>
                  )}
                  
                  {showOnSale && (
                    <span className="flex items-center px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-xs">
                      优惠商品
                      <button 
                        className="ml-1 text-primary-400 hover:text-primary-600"
                        onClick={() => setShowOnSale(false)}
                      >
                        <FaTimes size={10} />
                      </button>
                    </span>
                  )}
                  
                  {(priceRange.min || priceRange.max) && (
                    <span className="flex items-center px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-xs">
                      价格: ¥{priceRange.min || '0'} - ¥{priceRange.max || '∞'}
                      <button 
                        className="ml-1 text-primary-400 hover:text-primary-600"
                        onClick={() => setPriceRange({ min: '', max: '' })}
                      >
                        <FaTimes size={10} />
                      </button>
                    </span>
                  )}
                </div>
                
                <button 
                  className="px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs font-medium rounded-lg transition-colors"
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
    </div>
  );
} 