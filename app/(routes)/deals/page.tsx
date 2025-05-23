'use client';

import React from 'react';
import Link from 'next/link';

export default function DealsPage() {
  return (
    <div className="min-h-screen py-16 px-6 md:px-10">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8">优惠商品</h1>
        <div className="glass-card p-8 rounded-xl">
          <p className="text-lg mb-6">
            抱歉，当前没有可用的优惠商品。
          </p>
          <Link 
            href="/products" 
            className="inline-block px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
          >
            浏览所有商品
          </Link>
        </div>
      </div>
    </div>
  );
} 