'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FaShoppingCart, FaSearch, FaUser, FaHeart, FaBars, FaTimes, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { useCartStore, useWishlistStore } from '@/app/lib/store';
import { supabase } from '@/app/lib/supabase';
import { User } from '@supabase/supabase-js';

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const pathname = usePathname();
  const { items } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  
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

  // 获取用户认证状态
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 关闭导航栏项的列表
  const navLinks = [
    { href: '/', label: '首页' },
    { href: '/products', label: '全部商品' },
    { href: '/categories', label: '分类' },
    { href: '/deals', label: '优惠' },
    { href: '/about', label: '关于我们' },
  ];

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // 点击其他地方关闭用户菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-menu') && isUserMenuOpen) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

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
        <div className="flex items-center space-x-4 flex-1 justify-end">
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <FaSearch className="text-xl" />
          </button>
          
          <Link href="/wishlist" className="p-2 rounded-full hover:bg-white/10 transition-colors inline-flex relative">
            <FaHeart className="text-xl" />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {wishlistItems.length > 99 ? '99+' : wishlistItems.length}
              </span>
            )}
          </Link>
          
          <Link href="/cart" className="p-2 rounded-full hover:bg-white/10 transition-colors relative inline-flex">
            <FaShoppingCart className="text-xl" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>
          
          {!loading && (
            <>
              {user ? (
                <div className="relative user-menu">
                  <button 
                    className="p-2 rounded-full hover:bg-white/10 transition-colors inline-flex"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <FaUser className="text-xl" />
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50 animate-fade-in">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">已登录为</p>
                        <p className="text-sm font-medium truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link 
                          href="/account" 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FaUser className="mr-2 text-gray-500 dark:text-gray-400" />
                          个人中心
                        </Link>
                        <Link 
                          href="/account/settings" 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FaCog className="mr-2 text-gray-500 dark:text-gray-400" />
                          账户设置
                        </Link>
                        <button 
                          onClick={handleSignOut}
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <FaSignOutAlt className="mr-2 text-gray-500 dark:text-gray-400" />
                          退出登录
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link 
                    href="/auth/login" 
                    className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-500 dark:hover:text-primary-400 transition-colors hidden sm:block"
                  >
                    登录
                  </Link>
                  <Link 
                    href="/auth/register" 
                    className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-full transition-colors hidden sm:block"
                  >
                    注册
                  </Link>
                  <Link 
                    href="/auth/login" 
                    className="p-2 rounded-full hover:bg-white/10 transition-colors inline-flex sm:hidden"
                  >
                    <FaUser className="text-xl" />
                  </Link>
                </div>
              )}
            </>
          )}
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
            
            {!user && (
              <>
                <div className="border-t border-gray-700 my-2"></div>
                <Link 
                  href="/auth/login" 
                  className="font-medium py-2 px-3 rounded-lg hover:bg-white/10 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  登录
                </Link>
                <Link 
                  href="/auth/register" 
                  className="font-medium py-2 px-3 rounded-lg bg-primary-500 text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  注册
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 