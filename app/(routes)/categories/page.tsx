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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/categories/${category.id}`}
              className="glass-card p-6 rounded-xl hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
              {category.description && (
                <p className="text-gray-600 dark:text-gray-400 line-clamp-2">{category.description}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 