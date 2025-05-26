'use client';

import React, { useState } from 'react';
import { MobileMenuProps } from './types';

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, menuData }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCategory = (title: string) => {
    setExpandedCategory(expandedCategory === title ? null : title);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* 菜单内容 */}
      <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl overflow-y-auto">
        <div className="p-4 border-b">
          <button
            onClick={onClose}
            className="p-2 float-right text-gray-600 hover:text-gray-900"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="px-4 py-6">
          {menuData.map((item) => (
            <div key={item.title} className="mb-4">
              <button
                className="flex items-center justify-between w-full py-2 text-left"
                onClick={() => toggleCategory(item.title)}
              >
                <span className="text-lg font-medium">{item.title}</span>
                <svg
                  className={`w-4 h-4 transform transition-transform ${
                    expandedCategory === item.title ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {expandedCategory === item.title && (
                <div className="mt-2 space-y-4">
                  {item.categories.map((category, idx) => (
                    <div key={idx} className="pl-4">
                      <h3 className="font-medium text-gray-900 mb-2">
                        {category.subtitle}
                      </h3>
                      <ul className="space-y-2">
                        {category.items.map((subItem, subIdx) => (
                          <li
                            key={subIdx}
                            className="text-gray-600 hover:text-blue-600 cursor-pointer pl-2"
                          >
                            {subItem}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}; 