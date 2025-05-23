'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { Product, ProductImage } from '@/app/lib/types';
import { useCartStore, useWishlistStore } from '@/app/lib/store';
import { supabase } from '@/app/lib/supabase';

interface ProductCardProps {
  product: Product;
  hoverEffect?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product,
  hoverEffect = true
}) => {
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, items: wishlistItems } = useWishlistStore();
  const [productImage, setProductImage] = useState<string | null>(null);
  
  const isInWishlist = wishlistItems.some(item => item.id === product.id);
  
  useEffect(() => {
    const fetchProductImage = async () => {
      const { data, error } = await supabase
        .from('product_images')
        .select('image_url')
        .eq('product_id', product.id)
        .order('sort_order', { ascending: true })
        .limit(1)
        .single();
        
      if (!error && data) {
        setProductImage(data.image_url);
      }
    };
    
    fetchProductImage();
  }, [product.id]);
  
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div className={`group glass-card p-4 rounded-xl overflow-hidden ${hoverEffect ? 'hover:-translate-y-2' : ''} transition-all duration-300`}>
        <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
          <Image 
            src={productImage || '/no-image.png'}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-3 right-3 z-10">
            <button 
              onClick={handleWishlistToggle}
              className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-colors"
            >
              <FaHeart className={`${isInWishlist ? 'text-red-500' : 'text-white'}`} />
            </button>
          </div>
          {product.is_new && (
            <div className="absolute top-3 left-3 z-10">
              <span className="px-3 py-1 bg-secondary-500 text-white text-sm font-medium rounded-full">
                新品
              </span>
            </div>
          )}
          {(product.original_price && product.original_price > product.price) && (
            <div className="absolute top-3 left-3 z-10">
              <span className="px-3 py-1 bg-accent-500 text-white text-sm font-medium rounded-full">
                优惠
              </span>
            </div>
          )}
        </div>
        
        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-500 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex justify-between items-end">
          <div>
            <p className="text-lg font-bold">¥{product.price.toFixed(2)}</p>
            {(product.original_price && product.original_price > product.price) && (
              <p className="text-sm text-gray-500 line-through">¥{product.original_price.toFixed(2)}</p>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="w-10 h-10 rounded-full bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center transition-colors"
          >
            <FaShoppingCart className="text-lg" />
          </button>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard; 