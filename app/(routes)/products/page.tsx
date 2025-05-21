import React from 'react';
import Image from 'next/image';
import { FaFilter, FaSort } from 'react-icons/fa';
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
                <div className="flex overflow-x-auto space-x-2 py-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={`whitespace-nowrap px-4 py-2 rounded-full ${
                        category.id === 'all' 
                          ? 'bg-primary-500 text-white' 
                          : 'bg-white/10 hover:bg-white/20 text-gray-700 dark:text-gray-200'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 过滤器 - 桌面 */}
            <div className="hidden md:block w-full md:w-64 h-fit">
              <div className="glass-card p-6 sticky top-24">
                <h3 className="text-xl font-semibold mb-6">过滤</h3>
                
                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-3">分类</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center">
                        <input
                          type="radio"
                          id={category.id}
                          name="category"
                          defaultChecked={category.id === 'all'}
                          className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                        />
                        <label htmlFor={category.id} className="ml-2 text-gray-700 dark:text-gray-200">
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-3">价格区间</h4>
                  <div className="flex space-x-4">
                    <input
                      type="number"
                      placeholder="最低"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="number"
                      placeholder="最高"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                      />
                      <label htmlFor="on-sale" className="ml-2 text-gray-700 dark:text-gray-200">
                        优惠商品
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <button className="w-full py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">
                    应用过滤
                  </button>
                </div>
              </div>
            </div>
            
            {/* 产品网格 */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-8">
                <p className="text-gray-700 dark:text-gray-200">
                  显示 <span className="font-semibold">{mockProducts.length}</span> 个结果
                </p>
                <div className="flex items-center space-x-2">
                  <span className="hidden md:inline text-gray-700 dark:text-gray-200">排序:</span>
                  <select className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="popularity">热门程度</option>
                    <option value="price-low">价格: 低到高</option>
                    <option value="price-high">价格: 高到低</option>
                    <option value="newest">最新上架</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {/* 分页 */}
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
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductsPage; 