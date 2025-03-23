"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { categoryAPI } from "@/lib/api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// 定义表单验证模式
const formSchema = z.object({
  email: z.string().email({ message: "请输入有效的邮箱地址" }),
  password: z.string().min(6, { message: "密码至少需要6个字符" }),
});

export default function AdminLogin() {
  const router = useRouter();
  const { login, user, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // 初始化表单
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 打印当前认证状态以便调试
  useEffect(() => {
    console.log("登录页认证状态:", { isAuthenticated, userRole: user?.role });
    const token = localStorage.getItem('token');
    console.log("本地存储令牌:", { exists: !!token });
  }, [isAuthenticated, user]);

  // 如果用户已经登录且是管理员，直接跳转到管理后台
  useEffect(() => {
    if (isAuthenticated && user?.role === 'ADMIN') {
      router.push("/admin/products");
    }
  }, [isAuthenticated, user, router]);

  const handleLogin = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setLoginError("");
    
    console.log("尝试登录:", { email: values.email });
    
    try {
      // 先清除可能存在的旧数据
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // 执行登录
      await login(values.email, values.password);
      
      // 验证登录状态
      // 增加延迟，确保数据已更新
      setTimeout(async () => {
        try {
          // 检查token和用户数据是否存在
          const token = localStorage.getItem('token');
          const userDataStr = localStorage.getItem('user');
          
          console.log("登录后验证:", {
            hasToken: !!token,
            tokenLength: token ? token.length : 0,
            hasUserData: !!userDataStr
          });
          
          if (!token || !userDataStr) {
            console.error("登录后验证失败: 缺少token或用户数据");
            setLoginError("认证失败，请重新登录");
            setIsLoading(false);
            return;
          }
          
          // 解析用户数据
          const userData = JSON.parse(userDataStr);
          
          // 检查用户角色
          if (userData.role !== 'ADMIN') {
            console.error("登录后验证失败: 用户不是管理员");
            setLoginError("您没有管理员权限");
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setIsLoading(false);
            return;
          }
          
          console.log("登录后验证通过，准备跳转");
          
          // 验证令牌有效性
          try {
            // 尝试使用令牌发送请求
            const categoryApi = await import('@/lib/api');
            const response = await categoryApi.categoryAPI.getAllCategories();
            console.log("令牌验证成功:", {
              status: '有效',
              categories: response.data?.length || 0
            });
          } catch (tokenErr: any) {
            console.error("令牌验证失败:", tokenErr);
            
            if (tokenErr.response && tokenErr.response.status === 401) {
              setLoginError("登录失败：认证令牌无效");
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setIsLoading(false);
              return;
            }
            
            // 如果是其他错误，可能是网络问题，仍然允许登录
            console.warn("令牌验证时遇到非401错误，仍继续登录流程");
          }
          
          // 登录成功，跳转到管理员商品页面
          router.push('/admin/products');
          
        } catch (verifyErr) {
          console.error("登录后验证出错:", verifyErr);
          setLoginError("登录验证失败，请重新尝试");
          setIsLoading(false);
        }
      }, 1000); // 增加延迟确保数据已更新
      
    } catch (error: any) {
      console.error("登录失败:", error);
      setLoginError(error.message || "邮箱或密码错误");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <div className="flex justify-center mb-4">
            <Image src="/logo.png" alt="九兔网" width={100} height={100} className="h-20 w-auto" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">管理员登录</CardTitle>
          <CardDescription className="text-center">
            登录到九兔网管理后台
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loginError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
              <AlertCircle size={18} className="mr-2" />
              {loginError}
            </div>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>邮箱</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="请输入邮箱" 
                        type="email" 
                        autoComplete="email"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密码</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="请输入密码" 
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          disabled={isLoading}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "登录中..." : "登录"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
