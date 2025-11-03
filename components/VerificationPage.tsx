import React, { useState } from 'react';
import * as authService from '../services/authService';
import { LoadingIcon } from './Icons';

interface VerificationPageProps {
  userIdentifier: string;
  onVerificationSuccess: () => void;
}

export const VerificationPage: React.FC<VerificationPageProps> = ({ userIdentifier, onVerificationSuccess }) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: Replace with your actual Weidian store link
  const weidianStoreLink = "https://weidian.com/";

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const success = await authService.verifyActivationCode(userIdentifier, code);
      if (success) {
        onVerificationSuccess();
      } else {
         setError('验证码无效或已被使用，请联系客服。');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white text-center mb-4">
          激活您的账户
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
          您的账户尚未激活。请先完成支付以解锁全部功能。
        </p>
        
        <div className="bg-orange-50 dark:bg-gray-700/50 p-6 rounded-lg mb-6 text-center">
            <h2 className="text-xl font-semibold text-orange-800 dark:text-orange-300 mb-3">第一步：前往微店支付</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">点击下方链接，在我们的微店中完成下单。</p>
            <a 
                href={weidianStoreLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 font-bold bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
                前往微店
            </a>
        </div>
        
        <div className="bg-orange-50 dark:bg-gray-700/50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-orange-800 dark:text-orange-300 mb-3 text-center">第二步：输入激活码</h2>
            <p className="mb-4 text-center text-gray-700 dark:text-gray-300">支付成功后，联系客服获取激活码，并在此处输入。</p>
            <form onSubmit={handleVerify}>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="请输入客服提供的激活码"
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white mb-4"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center px-6 py-3 font-bold bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:bg-orange-400"
              >
                {isLoading ? <LoadingIcon className="w-6 h-6" /> : '激活账户'}
              </button>
            </form>
        </div>
        
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      </div>
    </div>
  );
};