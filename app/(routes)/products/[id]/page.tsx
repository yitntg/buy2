'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaHeart, FaShoppingCart, FaStar, FaShare, FaTruck, FaShieldAlt, FaCreditCard, FaPlay, FaPause } from 'react-icons/fa';
import { useCartStore, useWishlistStore } from '@/app/lib/store';
import { Product, ProductImage } from '@/app/lib/types';
import { supabase } from '@/app/lib/supabase';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [productMedia, setProductMedia] = useState<ProductImage[]>([]);
  const [relatedProductImages, setRelatedProductImages] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, items: wishlistItems } = useWishlistStore();
  
  const isInWishlist = wishlistItems.some(item => item.id === product?.id);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        // 获取商品详情
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (productError) throw productError;
        if (productData) {
          setProduct(productData);
          
          // 获取商品媒体（图片和视频）
          const { data: mediaData, error: mediaError } = await supabase
            .from('product_images')
            .select('*')
            .eq('product_id', id)
            .order('sort_order', { ascending: true });

          if (mediaError) throw mediaError;
          if (mediaData && mediaData.length > 0) {
            setProductMedia(mediaData);
          }

          // 获取同分类的相关商品
          const { data: relatedData, error: relatedError } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', productData.category_id)
            .neq('id', id)
            .limit(4);

          if (relatedError) throw relatedError;
          if (relatedData) {
            setRelatedProducts(relatedData);
            
            // 获取相关商品的图片
            const relatedImages: {[key: string]: string} = {};
            await Promise.all(
              relatedData.map(async (relatedProduct) => {
                const { data: relatedImageData } = await supabase
                  .from('product_images')
                  .select('image_url')
                  .eq('product_id', relatedProduct.id)
                  .order('sort_order', { ascending: true })
                  .limit(1)
                  .single();
                
                relatedImages[relatedProduct.id] = relatedImageData?.image_url || '/no-image.png';
              })
            );
            setRelatedProductImages(relatedImages);
          }
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  // 处理视频播放/暂停
  const handleVideoToggle = () => {
    const videoElement = document.getElementById('product-video') as HTMLVideoElement;
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // 渲染媒体项（图片或视频）
  const renderMediaItem = (media: ProductImage, isMain: boolean = false) => {
    if (media.type === 'video') {
      return (
        <div className="relative w-full h-full">
          <video
            id="product-video"
            src={media.image_url}
            poster={media.thumbnail_url}
            className="w-full h-full object-cover"
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          <button
            onClick={handleVideoToggle}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
          >
            {isPlaying ? (
              <FaPause className="text-white text-4xl" />
            ) : (
              <FaPlay className="text-white text-4xl" />
            )}
          </button>
        </div>
      );
    } else {
      return (
        <Image
          src={media.image_url}
          alt={product?.name || '商品图片'}
          fill
          style={{ objectFit: 'cover' }}
          className={isMain ? "transition-all duration-300" : ""}
        />
      );
    }
  };

  // 商品图片数组，优先用 productMedia
  const imagesToShow = productMedia.length > 0 ? productMedia.map(media => media.image_url) : [
    '/no-image.png',
    '/no-image.png',
    '/no-image.png',
    '/no-image.png',
  ];
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };
  
  const handleWishlistToggle = () => {
    if (!product) return;
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  
  const handleQuantityChange = (value: number) => {
    if (product && value >= 1 && value <= product.stock_quantity) {
      setQuantity(value);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-6 md:px-10">
        <div className="container mx-auto">
          <div className="glass-card p-10 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen py-16 px-6 md:px-10">
        <div className="container mx-auto">
          <div className="glass-card p-10 text-center">
            <h1 className="text-3xl font-bold mb-6">商品未找到</h1>
            <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
              抱歉，该商品不存在或已被下架。
            </p>
            <Link href="/products" className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-full transition-all transform hover:scale-105 hover:shadow-lg inline-block">
              返回商品列表
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-6 md:px-10">
      <div className="container mx-auto">
        {/* 面包屑导航 */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-gray-500 hover:text-primary-500 transition-colors">首页</Link>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-gray-400">/</span>
              <Link href="/products" className="text-gray-500 hover:text-primary-500 transition-colors">商品</Link>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-gray-400">/</span>
              <Link 
                href={`/categories/${product.category_id}`} 
                className="text-gray-500 hover:text-primary-500 transition-colors"
              >
                {product.category_id}
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-gray-400">/</span>
              <span className="text-gray-700 dark:text-gray-300">{product.name}</span>
            </li>
          </ol>
        </nav>
        
        {/* 产品详情 */}
        <div className="flex flex-col lg:flex-row gap-10 mb-16">
          {/* 产品媒体 */}
          <div className="w-full lg:w-1/2">
            <div className="flex flex-col-reverse md:flex-row gap-4">
              {/* 缩略图 */}
              <div className="grid grid-cols-4 gap-4 mt-4">
                {productMedia.map((media, index) => (
                  <button
                    key={index}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      activeMediaIndex === index 
                        ? 'border-primary-500 scale-95' 
                        : 'border-transparent hover:border-primary-300'
                    }`}
                    onClick={() => setActiveMediaIndex(index)}
                  >
                    {media.type === 'video' ? (
                      <Image
                        src={media.thumbnail_url || '/no-image.png'}
                        alt={`${product?.name} - 视频预览`}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <Image
                        src={media.image_url}
                        alt={`${product?.name} - 图片 ${index + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                    {media.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <FaPlay className="text-white text-xl" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              
              {/* 主媒体展示 */}
              <div className="relative h-[500px] md:flex-1 glass-card rounded-xl overflow-hidden">
                {productMedia[activeMediaIndex] && renderMediaItem(productMedia[activeMediaIndex], true)}
                {product.is_new && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-3 py-1 bg-secondary-500 text-white text-sm font-medium rounded-full">
                      新品
                    </span>
                  </div>
                )}
                {(product.original_price && product.original_price > product.price) && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-3 py-1 bg-accent-500 text-white text-sm font-medium rounded-full">
                      优惠 {Math.round((1 - product.price / product.original_price) * 100)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* 产品信息 */}
          <div className="w-full lg:w-1/2">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">4.0 (16 评价)</span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">销量: 68</span>
            </div>
            
            <div className="mb-6">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-bold text-primary-600">¥{product.price.toFixed(2)}</span>
                {product.original_price && (
                  <span className="text-xl text-gray-500 line-through">¥{product.original_price.toFixed(2)}</span>
                )}
              </div>
              {product.stock_quantity > 0 ? (
                <p className="text-green-600 mt-1">有货 ({product.stock_quantity} 件)</p>
              ) : (
                <p className="text-red-500 mt-1">缺货</p>
              )}
            </div>
            
            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6 mb-6">
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {product.description.slice(0, 150)}...
              </p>
              
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <FaTruck className="text-primary-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">免费配送</h4>
                    <p className="text-sm text-gray-500">满399元免运费</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <FaShieldAlt className="text-primary-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">品质保证</h4>
                    <p className="text-sm text-gray-500">30天无理由退换</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <FaCreditCard className="text-primary-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">安全支付</h4>
                    <p className="text-sm text-gray-500">多种支付方式</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 数量选择 */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">数量</h3>
              <div className="flex items-center">
                <button 
                  className="w-10 h-10 rounded-l-lg border border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-16 h-10 border-t border-b border-gray-300 dark:border-gray-700 text-center bg-transparent"
                />
                <button 
                  className="w-10 h-10 rounded-r-lg border border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock_quantity}
                >
                  +
                </button>
              </div>
            </div>
            
            {/* 购买按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-full transition-all transform hover:scale-105 hover:shadow-lg flex items-center justify-center"
              >
                <FaShoppingCart className="mr-2" />
                加入购物车
              </button>
              <button
                onClick={handleWishlistToggle}
                className={`flex-1 px-6 py-3 border ${
                  isInWishlist 
                    ? 'bg-red-50 border-red-500 text-red-500' 
                    : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                } font-medium rounded-full transition-all flex items-center justify-center`}
              >
                <FaHeart className={`mr-2 ${isInWishlist ? 'text-red-500' : ''}`} />
                {isInWishlist ? '已收藏' : '收藏'}
              </button>
              <button
                className="px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium rounded-full transition-all flex items-center justify-center"
              >
                <FaShare />
              </button>
            </div>
            
            {/* 产品标签 */}
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                商品编号: {product.id}
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                分类: {product.category_id}
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                标签: 时尚, 新品
              </span>
            </div>
          </div>
        </div>
        
        {/* 产品详情选项卡 */}
        <div className="mb-16">
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex overflow-x-auto space-x-8">
              <button
                className={`px-4 py-2 font-medium text-lg border-b-2 ${
                  activeTab === 'description' 
                    ? 'border-primary-500 text-primary-500' 
                    : 'border-transparent hover:text-gray-700 dark:hover:text-gray-300'
                } transition-colors`}
                onClick={() => setActiveTab('description')}
              >
                商品详情
              </button>
              <button
                className={`px-4 py-2 font-medium text-lg border-b-2 ${
                  activeTab === 'specifications' 
                    ? 'border-primary-500 text-primary-500' 
                    : 'border-transparent hover:text-gray-700 dark:hover:text-gray-300'
                } transition-colors`}
                onClick={() => setActiveTab('specifications')}
              >
                规格参数
              </button>
              <button
                className={`px-4 py-2 font-medium text-lg border-b-2 ${
                  activeTab === 'reviews' 
                    ? 'border-primary-500 text-primary-500' 
                    : 'border-transparent hover:text-gray-700 dark:hover:text-gray-300'
                } transition-colors`}
                onClick={() => setActiveTab('reviews')}
              >
                用户评价 (3)
              </button>
            </div>
          </div>
          
          {/* 选项卡内容 */}
          <div className="glass-card p-6 rounded-xl">
            {activeTab === 'description' && (
              <div className="prose max-w-none dark:prose-invert">
                <h3>商品详情</h3>
                <p>
                  {product.description}
                </p>
                <p>
                  我们的产品采用最高品质的材料精心制作而成，每一个细节都经过精心设计，以确保最佳的使用体验。无论是日常使用还是特殊场合，这款产品都能满足您的需求，展现您的独特品味。
                </p>
                <p>
                  产品特点：
                </p>
                <ul>
                  <li>优质材料，耐用持久</li>
                  <li>时尚设计，简约大方</li>
                  <li>多种场合适用</li>
                  <li>简单易用，方便实用</li>
                  <li>完美礼品选择</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="relative h-64 rounded-xl overflow-hidden">
                    <Image 
                      src={productMedia[0]?.image_url || '/no-image.png'}
                      alt="Product detail 1"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="relative h-64 rounded-xl overflow-hidden">
                    <Image 
                      src={productMedia[1]?.image_url || '/no-image.png'}
                      alt="Product detail 2"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">规格参数</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <table className="w-full">
                      <tbody>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <td className="py-3 text-gray-500">商品名称</td>
                          <td className="py-3 font-medium">{product.name}</td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <td className="py-3 text-gray-500">品牌</td>
                          <td className="py-3 font-medium">炫酷商城</td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <td className="py-3 text-gray-500">材质</td>
                          <td className="py-3 font-medium">优质面料</td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <td className="py-3 text-gray-500">尺寸</td>
                          <td className="py-3 font-medium">标准尺寸</td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <td className="py-3 text-gray-500">颜色</td>
                          <td className="py-3 font-medium">多色可选</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <table className="w-full">
                      <tbody>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <td className="py-3 text-gray-500">产地</td>
                          <td className="py-3 font-medium">中国</td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <td className="py-3 text-gray-500">保质期</td>
                          <td className="py-3 font-medium">3年</td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <td className="py-3 text-gray-500">包装</td>
                          <td className="py-3 font-medium">精美礼盒</td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <td className="py-3 text-gray-500">适用人群</td>
                          <td className="py-3 font-medium">青年男女</td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <td className="py-3 text-gray-500">适用场景</td>
                          <td className="py-3 font-medium">日常/商务/休闲</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">用户评价 (3)</h3>
                  <button className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors">
                    写评价
                  </button>
                </div>
                
                <div className="mb-8">
                  <div className="flex items-center space-x-8 mb-6">
                    <div>
                      <div className="text-3xl font-bold">4.0</div>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">共 16 条评价</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="w-24 text-sm">5 星</div>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                        <div className="w-12 text-right text-sm text-gray-500">60%</div>
                      </div>
                      <div className="flex items-center mb-2">
                        <div className="w-24 text-sm">4 星</div>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                        <div className="w-12 text-right text-sm text-gray-500">25%</div>
                      </div>
                      <div className="flex items-center mb-2">
                        <div className="w-24 text-sm">3 星</div>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: '10%' }}></div>
                        </div>
                        <div className="w-12 text-right text-sm text-gray-500">10%</div>
                      </div>
                      <div className="flex items-center mb-2">
                        <div className="w-24 text-sm">2 星</div>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: '5%' }}></div>
                        </div>
                        <div className="w-12 text-right text-sm text-gray-500">5%</div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-24 text-sm">1 星</div>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                        <div className="w-12 text-right text-sm text-gray-500">0%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* 相关商品 */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">相关商品</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(product => (
                <Link 
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="block group"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                    <Image
                      src={relatedProductImages[product.id] || '/no-image.png'}
                      alt={product.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="transition-all duration-300 group-hover:scale-110"
                    />
                    {product.is_new && (
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 bg-secondary-500 text-white text-sm font-medium rounded-full">
                          新品
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium group-hover:text-primary-500 transition-colors">
                    {product.name}
                  </h3>
                  <div className="mt-1">
                    <span className="text-lg font-semibold text-primary-600">
                      ¥{product.price.toFixed(2)}
                    </span>
                    {product.original_price && (
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        ¥{product.original_price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 