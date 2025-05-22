'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';

// 退款原因选项
const REFUND_REASONS = [
  { value: 'wrong_item', label: '商品与描述不符' },
  { value: 'defective', label: '商品有质量问题/损坏' },
  { value: 'better_price', label: '在其他地方找到更好的价格' },
  { value: 'changed_mind', label: '改变主意不想要了' },
  { value: 'duplicate', label: '重复订单' },
  { value: 'other', label: '其他原因' }
];

export default function RefundRequestPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const orderId = params.id;
  
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 提交退款申请
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!reason) {
      setError('请选择退款原因');
      return;
    }
    
    if (reason === 'other' && !customReason) {
      setError('请输入退款原因');
      return;
    }
    
    // 获取实际原因文本
    const actualReason = reason === 'other' 
      ? customReason 
      : REFUND_REASONS.find(r => r.value === reason)?.label || '';
    
    try {
      setLoading(true);
      setError(null);
      
      // 在实际应用中，这里应该调用API创建退款申请
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 创建成功后跳转
      router.push(`/order/${orderId}?refund_requested=true`);
    } catch (error: any) {
      console.error('提交退款申请失败:', error);
      setError(error.message || '提交退款申请失败，请稍后重试');
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen py-16 px-6 md:px-10">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-6">
          <Link href={`/order/${orderId}`} className="inline-flex items-center text-primary-500 hover:text-primary-600 transition-colors">
            <FaArrowLeft className="mr-2" /> 返回订单详情
          </Link>
        </div>
        
        <div className="glass-card p-6 md:p-8">
          <h1 className="text-2xl font-bold mb-6">申请退款</h1>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <FaExclamationTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  请确保您的退款申请符合我们的退款政策。退款申请将在1-3个工作日内处理。
                </p>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="reason" className="block text-sm font-medium mb-2">
                退款原因 <span className="text-red-500">*</span>
              </label>
              <select
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="">-- 请选择退款原因 --</option>
                {REFUND_REASONS.map(reason => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </select>
            </div>
            
            {reason === 'other' && (
              <div>
                <label htmlFor="customReason" className="block text-sm font-medium mb-2">
                  具体原因 <span className="text-red-500">*</span>
                </label>
                <input
                  id="customReason"
                  type="text"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="请简要说明退款原因"
                  required
                />
              </div>
            )}
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                详细说明
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="请提供更多详细信息（可选）"
              ></textarea>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? '提交中...' : '提交退款申请'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            <p>
              提交此表单后，我们的客服团队将审核您的退款申请。如有任何问题，请
              <Link href="/contact" className="text-primary-500 hover:text-primary-600 hover:underline">
                联系我们
              </Link>。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 