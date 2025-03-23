"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/layout/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/lib/AuthContext";

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 如果用户已登录，显示用户信息和控制面板
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("用户已登录", user);
    }
  }, [isAuthenticated, user]);

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register form state
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // 表单验证
    if (!email || !password) {
      toast.error("请填写所有必填字段");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('登录尝试:', { email });
      await login(email, password);
      toast.success("登录成功");
      router.push('/');
    } catch (error: any) {
      console.error("登录失败:", error);
      // 提供更详细的错误信息
      const errorMessage = error.response?.data?.message || "登录失败，请重试";
      console.log('错误详情:', {
        status: error.response?.status,
        message: errorMessage,
        data: error.response?.data
      });
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // 表单验证
    if (!registerEmail || !registerPassword || !confirmPassword) {
      toast.error("请填写所有必填字段");
      return;
    }

    if (registerPassword !== confirmPassword) {
      toast.error("两次输入的密码不一致");
      return;
    }

    try {
      setIsSubmitting(true);
      const userData = {
        email: registerEmail,
        password: registerPassword,
        name: name || undefined,
        phone: phone || undefined,
      };
      
      await register(userData);
      toast.success("注册成功");
      router.push('/');
    } catch (error: any) {
      console.error("注册失败:", error);
      toast.error(error.response?.data?.message || "注册失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("已成功退出登录");
  };

  // 如果用户已登录，显示用户信息和控制面板
  if (isAuthenticated && user) {
    return (
      <PageLayout>
        <div className="container px-4 py-6 md:py-8">
          <h1 className="text-xl md:text-2xl font-medium mb-6 text-center">我的账户</h1>
          
          <div className="max-w-md mx-auto">
            <div className="mb-8 p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name || user.email} 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#4ea4ad] text-white flex items-center justify-center text-xl font-semibold">
                    {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                  </div>
                )}
                
                <div>
                  <h2 className="font-medium text-lg">{user.name || '用户'}</h2>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                  {user.phone && <p className="text-gray-500 text-sm">{user.phone}</p>}
                </div>
              </div>
              
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="w-full"
              >
                退出登录
              </Button>
            </div>
            
            <div className="mt-8 md:mt-12">
              <h2 className="text-lg font-medium mb-4">用户中心</h2>
              <div className="space-y-3">
                <Link href="/account/orders" className="flex items-center justify-between p-3 md:p-4 border border-gray-200 rounded-md hover:border-[#4ea4ad] group transition-colors">
                  <span className="font-medium">我的订单</span>
                  <ChevronRight className="text-gray-400 group-hover:text-[#4ea4ad] transition-colors" size={18} />
                </Link>

                <Link href="/account/wishlist" className="flex items-center justify-between p-3 md:p-4 border border-gray-200 rounded-md hover:border-[#4ea4ad] group transition-colors">
                  <span className="font-medium">我的收藏</span>
                  <ChevronRight className="text-gray-400 group-hover:text-[#4ea4ad] transition-colors" size={18} />
                </Link>

                <Link href="/account/address" className="flex items-center justify-between p-3 md:p-4 border border-gray-200 rounded-md hover:border-[#4ea4ad] group transition-colors">
                  <span className="font-medium">地址管理</span>
                  <ChevronRight className="text-gray-400 group-hover:text-[#4ea4ad] transition-colors" size={18} />
                </Link>

                <Link href="/account/settings" className="flex items-center justify-between p-3 md:p-4 border border-gray-200 rounded-md hover:border-[#4ea4ad] group transition-colors">
                  <span className="font-medium">账户设置</span>
                  <ChevronRight className="text-gray-400 group-hover:text-[#4ea4ad] transition-colors" size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  // 未登录状态，显示登录/注册表单
  return (
    <PageLayout>
      <div className="container px-4 py-6 md:py-8">
        <h1 className="text-xl md:text-2xl font-medium mb-6 text-center">账户</h1>

        <div className="max-w-md mx-auto">
          <Tabs
            defaultValue="login"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "login" | "register")}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="login">登录</TabsTrigger>
              <TabsTrigger value="register">注册</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="text-right">
                  <Link href="/forgot-password" className="text-sm text-[#4ea4ad] hover:underline">
                    忘记密码?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 bg-[#4ea4ad] hover:bg-[#3d8b93]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "登录中..." : "登录"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <div className="mb-4 text-sm text-gray-600">
                <p>
                  注册以获取早期销售访问权以及量身定制的新品推荐和促销信息。要选择退出，请单击我们电子邮件中的取消订阅。
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    className="h-11"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Input
                    type="text"
                    placeholder="姓名（选填）"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Input
                    type="text"
                    placeholder="手机号（选填）"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-11"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    className="h-11"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-11"
                    disabled={isSubmitting}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 bg-[#4ea4ad] hover:bg-[#3d8b93]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "注册中..." : "注册"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
}
