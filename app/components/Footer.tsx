import React from 'react';
import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { icon: <FaFacebookF />, href: '#', label: 'Facebook' },
    { icon: <FaTwitter />, href: '#', label: 'Twitter' },
    { icon: <FaInstagram />, href: '#', label: 'Instagram' },
    { icon: <FaYoutube />, href: '#', label: 'YouTube' },
    { icon: <FaLinkedinIn />, href: '#', label: 'LinkedIn' },
  ];
  
  const footerLinks = {
    '商品': [
      { label: '全部商品', href: '/products' },
      { label: '新品上市', href: '/new-arrivals' },
      { label: '畅销商品', href: '/best-sellers' },
      { label: '优惠活动', href: '/deals' },
    ],
    '客户服务': [
      { label: '联系我们', href: '/contact' },
      { label: '常见问题', href: '/faq' },
      { label: '配送信息', href: '/shipping' },
      { label: '退换政策', href: '/returns' },
    ],
    '关于我们': [
      { label: '公司简介', href: '/about' },
      { label: '隐私政策', href: '/privacy' },
      { label: '使用条款', href: '/terms' },
      { label: '加入我们', href: '/careers' },
    ],
  };

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 px-6 md:px-10">
      <div className="container mx-auto">
        {/* 上半部分 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo和社交媒体 */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gradient">炫酷商城</h3>
            <p className="text-gray-300 mb-4">提供最优质的购物体验</p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <span className="sr-only">{social.label}</span>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* 链接 */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-lg font-semibold mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href} 
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {/* 订阅 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">订阅我们</h4>
            <p className="text-gray-300 mb-4">获取最新优惠和新品信息</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="您的邮箱" 
                className="px-4 py-2 rounded-l-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent flex-1"
                required
              />
              <button 
                type="submit" 
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-r-lg transition-colors"
              >
                订阅
              </button>
            </form>
          </div>
        </div>
        
        {/* 底部版权 */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© {currentYear} 炫酷商城. 保留所有权利.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">隐私政策</Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">使用条款</Link>
            <Link href="/sitemap" className="text-gray-400 hover:text-white text-sm transition-colors">网站地图</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 