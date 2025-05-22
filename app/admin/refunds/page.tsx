'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaCheck, FaTimes, FaExclamationTriangle, FaArrowLeft, FaSpinner } from 'react-icons/fa';

// 模拟的退款请求数据
const mockRefundRequests = [
  {
    id: 'REF-001',
    order_id: 'ORD20230001',
    payment_intent_id: 'int_mock_123456',
    amount: 699,
    reason: '商品不符合预期',
    customer_name: '张三',
    status: 'pending',
    created_at: '2023-10-15T10:30:00Z'
  },
  {
    id: 'REF-002',
    order_id: 'ORD20230004',
    payment_intent_id: 'int_mock_789012',
    amount: 899,
    reason: '订单重复',
    customer_name: '李四',
    status: 'pending',
    created_at: '2023-10-17T14:20:00Z'
  }
];

export default function AdminRefundsPage() {
  const [refundRequests, setRefundRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingRefund, setProcessingRefund] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  useEffect(() => {
    // 模拟加载退款请求数据
    const fetchRefundRequests = async () => {
      try {
        setLoading(true);
        // 在实际应用中，这里应该从API获取数据
        await new Promise(resolve => setTimeout(resolve, 800));
        setRefundRequests(mockRefundRequests);
      } catch (err) {
        console.error('加载退款请求失败:', err);
        setError('加载退款请求失败，请刷新页面重试');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRefundRequests();
  }, []);
  
  // 处理退款
  const handleProcessRefund = async (request: any) => {
    try {
      setProcessingRefund(request.id);
      setError(null);
      setSuccess(null);
      
      // 调用退款API
      const response = await fetch('/api/payments/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentIntentId: request.payment_intent_id,
          amount: request.amount,
          reason: request.reason,
          orderId: request.order_id
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '处理退款失败');
      }
      
      const result = await response.json();
      
      // 更新退款请求状态
      const updatedRequests = refundRequests.map(req => 
        req.id === request.id 
          ? { ...req, status: 'completed', refund_id: result.refund_id } 
          : req
      );
      
      setRefundRequests(updatedRequests);
      setSuccess(`订单 ${request.order_id} 的退款已成功处理`);
      
    } catch (error: any) {
      console.error('处理退款失败:', error);
      setError(error.message || '处理退款失败，请稍后重试');
    } finally {
      setProcessingRefund(null);
    }
  };
  
  // 拒绝退款
  const handleRejectRefund = (request: any) => {
    if (!confirm(`确定要拒绝此退款请求吗？订单ID: ${request.order_id}`)) {
      return;
    }
    
    // 更新退款请求状态
    const updatedRequests = refundRequests.map(req => 
      req.id === request.id 
        ? { ...req, status: 'rejected' } 
        : req
    );
    
    setRefundRequests(updatedRequests);
    setSuccess(`订单 ${request.order_id} 的退款请求已被拒绝`);
  };
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // 获取状态标签
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full text-xs">待处理</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs">已完成</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full text-xs">已拒绝</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full text-xs">{status}</span>;
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen py-16 px-6 md:px-10">
        <div className="container mx-auto max-w-6xl">
          <div className="glass-card p-10 flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3">加载退款请求...</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-16 px-6 md:px-10">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6">
          <Link href="/admin" className="inline-flex items-center text-primary-500 hover:text-primary-600 transition-colors">
            <FaArrowLeft className="mr-2" /> 返回管理面板
          </Link>
        </div>
        
        <div className="glass-card p-6 md:p-10">
          <h1 className="text-2xl font-bold mb-6">退款管理</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              <div className="flex">
                <FaExclamationTriangle className="h-5 w-5 text-red-500 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
              <div className="flex">
                <FaCheck className="h-5 w-5 text-green-500 mr-2" />
                <span>{success}</span>
              </div>
            </div>
          )}
          
          {refundRequests.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600 dark:text-gray-400">目前没有待处理的退款请求</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                    <th className="pb-3 font-semibold">请求ID</th>
                    <th className="pb-3 font-semibold">订单ID</th>
                    <th className="pb-3 font-semibold">客户</th>
                    <th className="pb-3 font-semibold">金额</th>
                    <th className="pb-3 font-semibold">原因</th>
                    <th className="pb-3 font-semibold">状态</th>
                    <th className="pb-3 font-semibold">时间</th>
                    <th className="pb-3 font-semibold text-right">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {refundRequests.map(request => (
                    <tr key={request.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-4 font-medium">{request.id}</td>
                      <td className="py-4">
                        <Link href={`/order/${request.order_id}`} className="text-primary-500 hover:text-primary-600 transition-colors">
                          {request.order_id}
                        </Link>
                      </td>
                      <td className="py-4">{request.customer_name}</td>
                      <td className="py-4 font-medium">¥{request.amount.toFixed(2)}</td>
                      <td className="py-4 max-w-xs truncate">{request.reason}</td>
                      <td className="py-4">{getStatusBadge(request.status)}</td>
                      <td className="py-4">{formatDate(request.created_at)}</td>
                      <td className="py-4 text-right">
                        {request.status === 'pending' && (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleProcessRefund(request)}
                              disabled={processingRefund === request.id}
                              className="px-3 py-1 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                              {processingRefund === request.id ? (
                                <>
                                  <FaSpinner className="animate-spin mr-1" /> 处理中
                                </>
                              ) : (
                                <>
                                  <FaCheck className="mr-1" /> 批准
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleRejectRefund(request)}
                              disabled={processingRefund === request.id}
                              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                              <FaTimes className="mr-1" /> 拒绝
                            </button>
                          </div>
                        )}
                        
                        {request.status === 'completed' && (
                          <span className="text-green-600 dark:text-green-400 text-sm">已退款</span>
                        )}
                        
                        {request.status === 'rejected' && (
                          <span className="text-red-600 dark:text-red-400 text-sm">已拒绝</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 