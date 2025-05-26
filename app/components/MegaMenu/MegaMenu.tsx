'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from './hooks/useDebounce';
import { MenuData } from './types';
import { MobileMenu } from './MobileMenu';

const menuData: MenuData[] = [
  {
    title: '珠宝首饰',
    categories: [
      {
        subtitle: '项链与吊坠',
        items: ['钻石项链', '珍珠项链', '宝石吊坠']
      },
      {
        subtitle: '戒指系列',
        items: ['订婚戒指', '结婚对戒', '时尚戒指']
      },
      {
        subtitle: '手链手镯',
        items: ['钻石手链', '宝石手镯', '珍珠手链']
      },
      {
        subtitle: '耳饰系列',
        items: ['钻石耳环', '珍珠耳钉', '宝石耳坠']
      }
    ],
    image: '/images/jewelry.jpg'
  },
  // ... 可以添加更多菜单项
];

export const MegaMenu: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // 使用防抖处理悬停事件
  const debouncedActiveMenu = useDebounce(activeMenu, 300);

  // 处理鼠标移入事件
  const handleMouseEnter = (title: string) => {
    setActiveMenu(title);
  };

  // 处理鼠标移出事件
  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  // 点击汉堡菜单按钮
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // 监听点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav ref={menuRef} className="relative z-50">
      {/* 桌面端菜单 */}
      <div className="hidden lg:block">
        <ul className="flex justify-center items-center h-16 bg-white">
          {menuData.map((item) => (
            <li
              key={item.title}
              className="relative px-6 h-full flex items-center"
              onMouseEnter={() => handleMouseEnter(item.title)}
              onMouseLeave={handleMouseLeave}
            >
              <span className="text-gray-800 hover:text-blue-600 cursor-pointer">
                {item.title}
              </span>
              
              {/* Mega Menu 下拉内容 */}
              {debouncedActiveMenu === item.title && (
                <div className="absolute top-full left-0 w-screen bg-white shadow-lg animate-fadeIn"
                     style={{
                       left: '50%',
                       transform: 'translateX(-50%)',
                       maxWidth: '100vw'
                     }}>
                  <div className="container mx-auto grid grid-cols-4 gap-8 p-8">
                    {/* 左侧分类列表 */}
                    {item.categories.map((category, idx) => (
                      <div key={idx} className="space-y-4">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {category.subtitle}
                        </h3>
                        <ul className="space-y-2">
                          {category.items.map((subItem, subIdx) => (
                            <li key={subIdx} className="text-gray-600 hover:text-blue-600 cursor-pointer">
                              {subItem}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* 移动端汉堡菜单按钮 */}
      <div className="lg:hidden">
        <button
          onClick={toggleMobileMenu}
          className="p-4 text-gray-600 hover:text-gray-900"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      {/* 移动端菜单 */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        menuData={menuData}
      />
    </nav>
  );
}; 