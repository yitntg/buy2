'use client';

import { useState } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 安全的图片组件，处理图片加载错误
 */
export default function SafeImage({
  src,
  alt,
  fallbackSrc = 'https://placehold.co/600x400?text=Image+Not+Found',
  width,
  height,
  fill = false,
  className = '',
  style = {}
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  
  // 处理图片加载错误
  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };
  
  // 决定是否使用fill属性
  if (fill) {
    return (
      <div className={`relative ${className}`} style={style}>
        <Image
          src={imgSrc}
          alt={alt}
          fill
          style={{ objectFit: 'cover' }}
          onError={handleError}
        />
      </div>
    );
  }
  
  // 使用宽高属性
  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width || 300}
      height={height || 300}
      className={className}
      style={style}
      onError={handleError}
    />
  );
} 