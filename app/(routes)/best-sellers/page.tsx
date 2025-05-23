'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Product } from '@/app/lib/types';
import ProductCard from '@/app/components/ProductCard';

export default function BestSellersPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('sales_count', { ascending: false })
          .limit(20);

        if (error) throw error;
        if (data) {
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching best sellers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  return (
    <div className="min-h-screen py-16 px-6 md:px-10">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8">畅销商品</h1>
        {loading ? (
          <div className="glass-card p-8 rounded-xl">
            <p className="text-lg">加载中...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 rounded-xl">
            <p className="text-lg">暂无畅销商品</p>
          </div>
        )}
      </div>
    </div>
  );
} 