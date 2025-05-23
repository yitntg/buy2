'use client';

import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: '如何创建账户？',
    answer: '点击网站右上角的"登录"按钮，然后选择"注册新账户"。填写必要信息即可完成注册。'
  },
  {
    question: '如何跟踪我的订单？',
    answer: '登录您的账户后，在"我的订单"页面可以查看所有订单的状态和物流信息。'
  },
  {
    question: '支持哪些支付方式？',
    answer: '我们支持支付宝、微信支付、银联卡等多种支付方式。'
  },
  {
    question: '如何申请退款？',
    answer: '在订单详情页面，点击"申请退款"按钮，按照提示填写退款原因并提交申请。'
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen py-16 px-6 md:px-10">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8">常见问题</h1>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="glass-card overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-semibold">{faq.question}</span>
                {openIndex === index ? (
                  <FaChevronUp className="text-primary-500" />
                ) : (
                  <FaChevronDown className="text-primary-500" />
                )}
              </button>
              <div
                className={`px-6 transition-all duration-300 ${
                  openIndex === index ? 'py-4' : 'py-0 h-0'
                }`}
              >
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 