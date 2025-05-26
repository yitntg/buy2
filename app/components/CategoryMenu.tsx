import React, { useState } from 'react';
import Link from 'next/link';

const categories = [
  {
    title: '按类别选购',
    items: [
      { name: '钻石戒指', slug: 'diamond-rings' },
      { name: '婚戒', slug: 'wedding-rings' },
      { name: '宝石戒指', slug: 'gemstone-rings' },
      { name: '所有戒指', slug: 'all-rings' },
    ]
  },
  {
    title: '精选商店',
    items: [
      { name: '新品上市', slug: 'new-arrivals' },
      { name: '畅销商品', slug: 'best-sellers' },
      { name: '限时特惠', slug: 'special-offers' },
      { name: '独家定制', slug: 'custom-made' },
    ]
  },
  {
    title: '按系列选购',
    items: [
      { name: '经典系列', slug: 'classic-collection' },
      { name: '时尚系列', slug: 'fashion-collection' },
      { name: '奢华系列', slug: 'luxury-collection' },
      { name: '查看全部', slug: 'view-all' },
    ]
  }
];

const CategoryMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* 分类按钮 */}
      <button className="py-2 px-3 hover:text-primary-500 transition-colors">
        分类
      </button>

      {/* 下拉菜单 */}
      <div
        className={`absolute left-1/2 top-full z-50 w-full max-w-xl -translate-x-1/2 bg-white shadow-lg transition-all duration-300 ${
          isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
        }`}
      >
        <div className="py-8 px-8">
          <div className="grid grid-cols-3 gap-x-8">
            {categories.map((category, index) => (
              <div key={index} className="space-y-6">
                <h3 className="font-medium text-gray-900">
                  {category.title}
                </h3>
                <div className="space-y-4">
                  {category.items.map((item, itemIndex) => (
                    <Link
                      key={itemIndex}
                      href={`/products/${item.slug}`}
                      className="block text-gray-600 hover:text-primary-500 transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryMenu; 