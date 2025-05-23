'use client';

import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function ContactPage() {
  return (
    <div className="min-h-screen py-16 px-6 md:px-10">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8">联系我们</h1>
        <div className="glass-card p-8 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <FaEnvelope className="text-4xl text-primary-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">电子邮件</h3>
              <p>support@example.com</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <FaPhone className="text-4xl text-primary-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">电话</h3>
              <p>+86 123 4567 8900</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <FaMapMarkerAlt className="text-4xl text-primary-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">地址</h3>
              <p>上海市浦东新区XX路XX号</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 