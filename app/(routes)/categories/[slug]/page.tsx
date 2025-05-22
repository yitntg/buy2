'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaFilter, FaSort, FaArrowLeft } from 'react-icons/fa';
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
  // 为每个分类生成12个商品
  return Array.from({ length: 12 }).map((_, i) => ({
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
            <p className="text-xl text-white/90 max-w-2xl">
              {categoryInfo.description}
            </p>
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
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* 过滤器 - 移动 */}
            <div className="md:hidden w-full mb-6">
              <div className="glass-card p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">过滤</h3>
                  <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <FaFilter />
                  </button>
                </div>
                
                {/* 移动端过滤器内容 */}
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium">价格区间</label>
                    <div className="flex space-x-4">
                      <input
                        type="number"
                        placeholder="最低"
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      />
                      <input
                        type="number"
                        placeholder="最高"
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="mobile-in-stock"
                        className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                        checked={showInStock}
                        onChange={() => setShowInStock(!showInStock)}
                      />
                      <label htmlFor="mobile-in-stock" className="ml-2 text-gray-700 dark:text-gray-200">
                        有货
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="mobile-featured"
                        className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                        checked={showFeatured}
                        onChange={() => setShowFeatured(!showFeatured)}
                      />
                      <label htmlFor="mobile-featured" className="ml-2 text-gray-700 dark:text-gray-200">
                        特色商品
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="mobile-on-sale"
                        className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                        checked={showOnSale}
                        onChange={() => setShowOnSale(!showOnSale)}
                      />
                      <label htmlFor="mobile-on-sale" className="ml-2 text-gray-700 dark:text-gray-200">
                        优惠商品
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 过滤器 - 桌面 */}
            <div className="hidden md:block w-full md:w-64 h-fit">
              <div className="glass-card p-6 sticky top-24">
                <h3 className="text-xl font-semibold mb-6">过滤</h3>
                
                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-3">价格区间</h4>
                  <div className="flex space-x-4">
                    <input
                      type="number"
                      placeholder="最低"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="最高"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-3">商品状态</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="in-stock"
                        className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                        checked={showInStock}
                        onChange={() => setShowInStock(!showInStock)}
                      />
                      <label htmlFor="in-stock" className="ml-2 text-gray-700 dark:text-gray-200">
                        有货
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="featured"
                        className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                        checked={showFeatured}
                        onChange={() => setShowFeatured(!showFeatured)}
                      />
                      <label htmlFor="featured" className="ml-2 text-gray-700 dark:text-gray-200">
                        特色商品
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="on-sale"
                        className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                        checked={showOnSale}
                        onChange={() => setShowOnSale(!showOnSale)}
                      />
                      <label htmlFor="on-sale" className="ml-2 text-gray-700 dark:text-gray-200">
                        优惠商品
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <button 
                    className="w-full py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                    onClick={() => {
                      setShowInStock(false);
                      setShowFeatured(false);
                      setShowOnSale(false);
                      setPriceRange({ min: '', max: '' });
                    }}
                  >
                    重置过滤
                  </button>
                  <Link 
                    href="/categories" 
                    className="flex items-center justify-center text-primary-500 hover:text-primary-600 transition-colors"
                  >
                    <FaArrowLeft className="mr-2" /> 返回所有分类
                  </Link>
                </div>
              </div>
            </div>
            
            {/* 产品网格 */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-8">
                <p className="text-gray-700 dark:text-gray-200">
                  显示 <span className="font-semibold">{displayProducts.length}</span> 个结果
                </p>
                <div className="flex items-center space-x-2">
                  <span className="hidden md:inline text-gray-700 dark:text-gray-200">排序:</span>
                  <select 
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
              
              {displayProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    onClick={() => {
                      setShowInStock(false);
                      setShowFeatured(false);
                      setShowOnSale(false);
                      setPriceRange({ min: '', max: '' });
                    }}
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
        </div>
      </section>
    </div>
  );
} 