'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from './api';

// 用户类型定义
export type User = {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  avatar?: string;
  role: 'ADMIN' | 'CUSTOMER' | 'MERCHANT';
};

// 认证上下文类型定义
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { email: string; password: string; name?: string; phone?: string; }) => Promise<void>;
  logout: () => void;
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供者
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 从本地存储加载用户
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        console.log("AuthContext初始化 - 检查存储的用户数据", { 
          hasUserData: !!storedUser,
          hasToken: !!token
        });
        
        if (storedUser && token) {
          const parsedUser = JSON.parse(storedUser);
          console.log("AuthContext初始化 - 已找到用户数据", { role: parsedUser.role });
          setUser(parsedUser);
        } else {
          console.log("AuthContext初始化 - 未找到完整的用户数据或令牌");
          // 如果缺少任一项，清除可能存在的不完整数据
          if (storedUser || token) {
            console.log("AuthContext初始化 - 清除不完整的认证数据");
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('加载用户数据失败:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    if (typeof window !== 'undefined') {
      loadUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  // 登录
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("AuthContext - 尝试登录:", { email });
      
      // 清除之前的登录数据
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      const response = await authAPI.login({ email, password });
      
      console.log("AuthContext - 登录响应:", { 
        success: response.success,
        message: response.message,
        hasToken: !!response.data?.token,
        hasUser: !!response.data?.user,
        tokenType: response.data?.token ? typeof response.data.token : 'undefined'
      });
      
      if (!response.success) {
        console.error("AuthContext - 登录失败:", response.message);
        throw new Error(response.message || "登录失败");
      }
      
      if (!response.data?.token) {
        console.error("AuthContext - 登录缺少令牌");
        throw new Error("登录失败：服务器未返回认证令牌");
      }
      
      if (!response.data?.user) {
        console.error("AuthContext - 登录缺少用户数据");
        throw new Error("登录失败：服务器未返回用户数据");
      }
      
      const { user, token } = response.data;
      
      // 验证用户数据完整性
      if (!user.id || !user.email || !user.role) {
        console.error("AuthContext - 用户数据不完整:", user);
        throw new Error("登录失败：用户数据不完整");
      }
      
      // 确保令牌非空
      if (typeof token !== 'string' || token.trim() === '') {
        console.error("AuthContext - 无效的令牌格式");
        throw new Error("登录失败：无效的认证令牌");
      }
      
      // 确保token不包含Bearer前缀，因为我们在请求拦截器中会添加
      const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
      
      // 检查令牌格式
      if (cleanToken.length < 10) {
        console.error("AuthContext - 令牌格式异常，长度不足");
        throw new Error("登录失败：异常的认证令牌");
      }
      
      // 保存到localStorage
      localStorage.setItem('token', cleanToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log("AuthContext - 登录成功，用户数据已保存:", { 
        userId: user.id,
        role: user.role,
        tokenLength: cleanToken.length
      });
      
      setUser(user);
    } catch (error) {
      console.error('登录失败:', error);
      // 清除可能存在的部分数据
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 注册
  const register = async (userData: { email: string; password: string; name?: string; phone?: string; }) => {
    setIsLoading(true);
    try {
      console.log("AuthContext - 尝试注册新用户");
      
      // 清除之前的登录数据
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      const response = await authAPI.register(userData);
      
      console.log("AuthContext - 注册响应:", { 
        success: response.success,
        message: response.message,
        hasToken: !!response.data?.token,
        hasUser: !!response.data?.user
      });
      
      if (!response.success) {
        console.error("AuthContext - 注册失败:", response.message);
        throw new Error(response.message || "注册失败");
      }
      
      if (!response.data?.token || !response.data?.user) {
        console.error("AuthContext - 注册缺少令牌或用户数据");
        throw new Error("注册失败：服务器响应数据不完整");
      }
      
      const { user, token } = response.data;
      
      // 验证用户数据完整性
      if (!user.id || !user.email || !user.role) {
        console.error("AuthContext - 用户数据不完整:", user);
        throw new Error("注册失败：用户数据不完整");
      }
      
      // 确保令牌非空
      if (typeof token !== 'string' || token.trim() === '') {
        console.error("AuthContext - 无效的令牌格式");
        throw new Error("注册失败：无效的认证令牌");
      }
      
      // 确保token不包含Bearer前缀
      const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
      
      localStorage.setItem('token', cleanToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log("AuthContext - 注册成功，用户数据已保存:", {
        userId: user.id,
        role: user.role,
        tokenLength: cleanToken.length
      });
      
      setUser(user);
    } catch (error) {
      console.error('注册失败:', error);
      // 清除可能存在的部分数据
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 登出
  const logout = () => {
    console.log("AuthContext - 用户登出");
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/account');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 使用认证上下文的钩子
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 