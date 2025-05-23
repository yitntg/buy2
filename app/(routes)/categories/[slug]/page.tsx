'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaFilter, FaArrowLeft, FaChevronDown, FaTimes } from 'react-icons/fa';
import ProductCard from '@/app/components/ProductCard';
import { supabase } from '@/app/lib/supabase';
import { Product, Category } from '@/app/lib/types';

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryInfo, setCategoryInfo] = useState<Category | null>(null);
  const [sortOrder, setSortOrder] = useState('popularity');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [isPriceFilterOpen, setIsPriceFilterOpen] = useState(false);
  const [showInStock, setShowInStock] = useState(false);
  const [showFeatured, setShowFeatured] = useState(false);
  const [showOnSale, setShowOnSale] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      // 获取分类信息
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select(`
          *,
          category_images (
            image_url
          )
        `)
        .eq('id', slug)
        .single();
        
      if (!categoryError && categoryData) {
        setCategoryInfo({
          ...categoryData,
          image_url: categoryData.category_images?.[0]?.image_url || '/no-image.png'
        });
      }
      
      // 获取该分类的商品
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', slug);
        
      if (!productsError && productsData) {
        setProducts(productsData);
      }
    };
    
    fetchData();
  }, [slug]);

  // 过滤和排序商品
  const filteredAndSortedProducts = products
    .filter(product => {
      if (showInStock && product.stock_quantity <= 0) return false;
      if (showFeatured && !product.is_featured) return false;
      if (showOnSale && (!product.original_price || product.original_price <= product.price)) return false;
      if (priceRange.min && product.price < Number(priceRange.min)) return false;
      if (priceRange.max && product.price > Number(priceRange.max)) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen">
      {/* 分类头部 */}
      {categoryInfo && (
        <div className="relative h-[30vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-800/70 to-purple-800/70 z-10"></div>
          <div className="absolute inset-0">
            <Image 
              src={categoryInfo.image_url || '/no-image.png'} 
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
      <section className="py-12 px-6 md:px-10">
        <div className="container mx-auto">
          {/* 面包屑导航 */}
          <div className="mb-8">
            <div className="flex items-center text-sm">
              <Link href="/" className="text-gray-500 hover:text-primary-500">首页</Link>
              <span className="mx-2 text-gray-400">/</span>
              <Link href="/categories" className="text-gray-500 hover:text-primary-500">分类</Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-900 dark:text-gray-100">{categoryInfo?.name}</span>
            </div>
          </div>

          {/* 过滤和排序 */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => setIsPriceFilterOpen(!isPriceFilterOpen)}
              >
                <FaFilter />
                <span>筛选</span>
              </button>
              
              {/* 价格筛选弹出框 */}
              {isPriceFilterOpen && (
                <div className="absolute z-50 mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">价格范围</h3>
                    <button onClick={() => setIsPriceFilterOpen(false)}>
                      <FaTimes />
                    </button>
                  </div>
                  <div className="flex gap-4 items-center">
                    <input
                      type="number"
                      placeholder="最低"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      className="w-24 px-3 py-2 border rounded-lg"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="最高"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      className="w-24 px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showInStock}
                    onChange={(e) => setShowInStock(e.target.checked)}
                    className="rounded text-primary-500"
                  />
                  有货
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showFeatured}
                    onChange={(e) => setShowFeatured(e.target.checked)}
                    className="rounded text-primary-500"
                  />
                  精选
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showOnSale}
                    onChange={(e) => setShowOnSale(e.target.checked)}
                    className="rounded text-primary-500"
                  />
                  特价
                </label>
              </div>
            </div>
            
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="appearance-none px-4 py-2 pr-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <option value="popularity">按热度</option>
                <option value="price-asc">价格从低到高</option>
                <option value="price-desc">价格从高到低</option>
                <option value="newest">最新上架</option>
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 商品网格 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* 空状态 */}
          {filteredAndSortedProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">暂无商品</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 