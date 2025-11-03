import React, { useState } from 'react';
import * as authService from '../services/authService';
import { LoadingIcon } from './Icons';

interface LoginPageProps {
  onLoginSuccess: (user: { identifier: string }) => void;
}

type Step = 'phone_input' | 'otp_input';

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<Step>('phone_input');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{11}$/.test(phone)) { // Simple validation for Chinese phone numbers
      setError('请输入有效的11位手机号码。');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await authService.sendOtp(phone);
      setStep('otp_input');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
     if (!/^\d{6}$/.test(code)) {
      setError('请输入6位数字验证码。');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const user = await authService.verifyOtp(phone, code);
      if (user) {
        onLoginSuccess(user);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-orange-600 dark:text-orange-400">
              AI 发音教练
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">
              Pronunciation Coach
            </p>
            <p className="text-md text-gray-600 dark:text-gray-300 mt-4">
              使用手机号登录或注册
            </p>
        </div>

        {step === 'phone_input' ? (
          <form onSubmit={handleSendCode}>
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">手机号</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="请输入您的手机号"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                autoComplete="tel"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center px-6 py-3 font-bold bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:bg-orange-400"
            >
              {isLoading ? <LoadingIcon className="w-6 h-6" /> : '发送验证码'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode}>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">验证码已发送至 {phone}</p>
            <div className="mb-4">
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">验证码</label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="请输入6位验证码"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                autoComplete="one-time-code"
              />
            </div>
             <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center px-6 py-3 font-bold bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:bg-orange-400"
            >
              {isLoading ? <LoadingIcon className="w-6 h-6" /> : '登录 / 注册'}
            </button>
            <button
              type="button"
              onClick={() => { setStep('phone_input'); setError(null); }}
              className="w-full text-center mt-4 text-sm text-orange-600 dark:text-orange-400 hover:underline"
            >
              返回
            </button>
          </form>
        )}

        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      </div>
    </div>
  );
};