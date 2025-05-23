'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { supabase } from '@/app/lib/supabase';
import { Category } from '@/app/lib/types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select(`
            *,
            category_images (
              image_url
            )
          `)
          .order('id');

        if (error) {
          console.error('Error fetching categories:', error);
          return;
        }

        if (data) {
          // 获取每个分类的商品数量
          const categoriesWithCount = await Promise.all(
            data.map(async (category) => {
              const { count } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true })
                .eq('category_id', category.id);
              
              return {
                ...category,
                image_url: category.category_images?.[0]?.image_url || '/no-image.png',
                itemCount: count || 0
              };
            })
          );

          setCategories(categoriesWithCount);
        }
      } catch (err) {
        console.error('Error in fetchCategories:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-6 md:px-10">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-center">商品分类</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/categories/${category.id}`}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-64">
                <Image
                  src={category.image_url || '/no-image.png'}
                  alt={category.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
                  <p className="text-white/80 mb-4 line-clamp-2">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{category.itemCount} 个商品</span>
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 