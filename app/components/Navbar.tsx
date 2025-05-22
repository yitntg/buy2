'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { FaShoppingCart, FaSearch, FaUser, FaHeart, FaBars, FaTimes, FaSignOutAlt, FaCog, FaChevronDown } from 'react-icons/fa';
import { useCartStore, useWishlistStore } from '@/app/lib/store';
import { supabase } from '@/app/lib/supabase';
import { User } from '@supabase/supabase-js';

// 分类数据
const categories = [
  { 
    id: 'fashion', 
    name: '时尚', 
    description: '服装、鞋履和配饰',
    image: 'https://picsum.photos/600/400?random=1',
    subcategories: [
      { id: 'fashion-men', name: '男装' },
      { id: 'fashion-women', name: '女装' },
      { id: 'fashion-kids', name: '童装' },
      { id: 'fashion-shoes', name: '鞋履' },
      { id: 'fashion-bags', name: '包袋' },
    ]
  },
  { 
    id: 'electronics', 
    name: '电子', 
    description: '智能设备和配件',
    image: 'https://picsum.photos/600/400?random=2',
    subcategories: [
      { id: 'electronics-phones', name: '手机' },
      { id: 'electronics-computers', name: '电脑' },
      { id: 'electronics-tablets', name: '平板' },
      { id: 'electronics-audio', name: '音频设备' },
      { id: 'electronics-accessories', name: '配件' },
    ]
  },
  { 
    id: 'home', 
    name: '家居', 
    description: '家居装饰和家具',
    image: 'https://picsum.photos/600/400?random=3',
    subcategories: [
      { id: 'home-furniture', name: '家具' },
      { id: 'home-decor', name: '装饰' },
      { id: 'home-kitchen', name: '厨房' },
      { id: 'home-bath', name: '浴室' },
      { id: 'home-garden', name: '花园' },
    ]
  },
  { 
    id: 'beauty', 
    name: '美妆', 
    description: '美容和个人护理',
    image: 'https://picsum.photos/600/400?random=4',
    subcategories: [
      { id: 'beauty-skincare', name: '护肤' },
      { id: 'beauty-makeup', name: '彩妆' },
      { id: 'beauty-haircare', name: '护发' },
      { id: 'beauty-fragrance', name: '香水' },
      { id: 'beauty-tools', name: '美妆工具' },
    ]
  },
  { 
    id: 'sports', 
    name: '运动', 
    description: '运动装备和户外用品',
    image: 'https://picsum.photos/600/400?random=5',
    subcategories: [
      { id: 'sports-clothing', name: '运动服装' },
      { id: 'sports-shoes', name: '运动鞋' },
      { id: 'sports-equipment', name: '健身器材' },
      { id: 'sports-outdoor', name: '户外装备' },
      { id: 'sports-accessories', name: '运动配件' },
    ]
  }
];

// 模拟用户数据 - 用于测试，与AccountPage中保持一致
const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {
    full_name: '测试用户'
  }
};

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const pathname = usePathname();
  const { items } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const productsMenuRef = useRef<HTMLDivElement>(null);
  const menuTimeoutRef = useRef<NodeJS.Timeout>();

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
    // ===== 测试模式：使用模拟用户数据 =====
    setUser(mockUser as any);
    setLoading(false);
    
    // ===== 原始认证代码（暂时注释) =====
    /*
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
    */
  }, []);

  // 导航栏项的列表
  const navLinks = [
    { href: '/', label: '首页' },
    { href: '/products', label: '全部商品', hasSubmenu: true },
    { href: '/deals', label: '优惠' },
    { href: '/about', label: '关于我们' },
  ];

  const handleSignOut = async () => {
    // 测试模式：简单重定向到首页
    router.push('/');
    setIsUserMenuOpen(false);
    
    // 原始退出登录代码（暂时注释）
    /*
    try {
      await supabase.auth.signOut();
      router.push('/');
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
    */
  };

  // 处理菜单显示
  const handleMenuEnter = () => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    setIsProductsMenuOpen(true);
  };

  // 处理菜单隐藏
  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setIsProductsMenuOpen(false);
      setActiveCategory(null);
    }, 200); // 200ms 延迟，给用户足够时间移动到菜单
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (menuTimeoutRef.current) {
        clearTimeout(menuTimeoutRef.current);
      }
    };
  }, []);

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
            link.hasSubmenu ? (
              <div 
                key={link.href} 
                className="relative products-menu"
                onMouseEnter={handleMenuEnter}
                onMouseLeave={handleMenuLeave}
                ref={productsMenuRef}
              >
                <Link 
                  href={link.href}
                  className={`font-medium flex items-center hover:text-primary-500 transition-colors ${isProductsMenuOpen ? 'text-primary-500' : ''}`}
                >
                  {link.label} <FaChevronDown className={`ml-1 transition-transform ${isProductsMenuOpen ? 'rotate-180' : ''}`} />
                </Link>
                
                {isProductsMenuOpen && (
                  <div 
                    className="absolute left-0 mt-2 w-[800px] bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden z-50 animate-fade-in"
                    onMouseEnter={handleMenuEnter}
                    onMouseLeave={handleMenuLeave}
                  >
                    <div className="grid grid-cols-5 gap-4 p-6">
                      {categories.map(category => (
                        <div 
                          key={category.id} 
                          className={`group cursor-pointer${activeCategory === category.id ? ' bg-gray-50 dark:bg-gray-900' : ''}`}
                          onMouseEnter={() => setActiveCategory(category.id)}
                        >
                          <div className="relative h-32 mb-3 rounded-lg overflow-hidden select-none">
                            <Image 
                              src={category.image}
                              alt={category.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <h3 className="absolute bottom-2 left-2 text-white font-medium select-none">{category.name}</h3>
                          </div>
                          <div className="space-y-1">
                            {category.subcategories.map(subcat => (
                              <Link 
                                key={subcat.id}
                                href={`/products?category=${category.id}&subcategory=${subcat.id}`}
                                className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
                                onClick={() => setIsProductsMenuOpen(false)}
                              >
                                {subcat.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    {activeCategory && (
                      <div 
                        className="absolute top-0 left-0 w-full h-full bg-white dark:bg-gray-800 p-6 animate-fade-in pointer-events-auto"
                        onMouseEnter={handleMenuEnter}
                        onMouseLeave={handleMenuLeave}
                      >
                        <div className="flex">
                          <div className="w-1/3 select-none">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                              {categories.find(c => c.id === activeCategory)?.name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                              {categories.find(c => c.id === activeCategory)?.description}
                            </p>
                            <Link 
                              href={`/categories/${activeCategory}`}
                              className="inline-block px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                              onClick={() => setIsProductsMenuOpen(false)}
                            >
                              浏览全部
                            </Link>
                          </div>
                          <div className="w-2/3 pl-8">
                            <div className="grid grid-cols-3 gap-4">
                              {categories.find(c => c.id === activeCategory)?.subcategories.map(subcat => (
                                <Link 
                                  key={subcat.id}
                                  href={`/products?category=${activeCategory}&subcategory=${subcat.id}`}
                                  className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                  onClick={() => setIsProductsMenuOpen(false)}
                                >
                                  <h4 className="font-medium text-gray-800 dark:text-gray-200">{subcat.name}</h4>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`font-medium ${pathname === link.href ? 'text-primary-500' : 'hover:text-primary-500'} transition-colors`}
              >
                {link.label}
              </Link>
            )
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