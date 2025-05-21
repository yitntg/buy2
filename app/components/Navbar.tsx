'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaShoppingCart, FaSearch, FaUser, FaHeart, FaBars, FaTimes } from 'react-icons/fa';
import { useCartStore } from '@/app/lib/store';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { items } = useCartStore();
  
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  
  // 检测页面滚动
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 关闭导航栏项的列表
  const navLinks = [
    { href: '/', label: '首页' },
    { href: '/products', label: '全部商品' },
    { href: '/categories', label: '分类' },
    { href: '/deals', label: '优惠' },
    { href: '/about', label: '关于我们' },
  ];

  return (
    <nav className={`${isScrolled ? 'glass-effect shadow-md' : 'bg-transparent'} sticky top-0 z-50 py-4 px-6 md:px-10 transition-all duration-300`}>
      <div className="flex justify-between items-center">
        {/* 移动菜单按钮 */}
        <button 
          className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
        </button>
        
        {/* Logo */}
        <div className="flex-1">
          <Link href="/" className="block">
            <h1 className="text-2xl md:text-3xl font-bold text-gradient">炫酷商城</h1>
          </Link>
        </div>
        
        {/* 桌面导航链接 */}
        <div className="hidden md:flex space-x-6 flex-1 justify-center">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={`font-medium ${pathname === link.href ? 'text-primary-500' : 'hover:text-primary-500'} transition-colors`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        
        {/* 右侧按钮 */}
        <div className="flex space-x-4 flex-1 justify-end">
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <FaSearch className="text-xl" />
          </button>
          <Link href="/wishlist" className="p-2 rounded-full hover:bg-white/10 transition-colors inline-flex">
            <FaHeart className="text-xl" />
          </Link>
          <Link href="/account" className="p-2 rounded-full hover:bg-white/10 transition-colors inline-flex">
            <FaUser className="text-xl" />
          </Link>
          <Link href="/cart" className="p-2 rounded-full hover:bg-white/10 transition-colors relative inline-flex">
            <FaShoppingCart className="text-xl" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
      
      {/* 移动菜单 */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-white/10 backdrop-blur-md rounded-xl p-4 animate-fade-in">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`font-medium py-2 px-3 rounded-lg ${pathname === link.href ? 'bg-primary-500 text-white' : 'hover:bg-white/10'} transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 