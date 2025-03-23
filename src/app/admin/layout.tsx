"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Package, LayoutGrid, Users, ClipboardList, Settings, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

const navItems = [
  { icon: Package, label: "商品管理", href: "/admin/products" },
  { icon: LayoutGrid, label: "分类管理", href: "/admin/categories" },
  { icon: ClipboardList, label: "订单管理", href: "/admin/orders" },
  { icon: Users, label: "用户管理", href: "/admin/users" },
  { icon: Settings, label: "网站设置", href: "/admin/settings" },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // 检查用户是否为管理员
  useEffect(() => {
    // 如果用户未登录或不是管理员，重定向到登录页面
    // 等待isLoading结束后再检查，避免闪烁
    if (!isLoading && (!isAuthenticated || user?.role !== 'ADMIN')) {
      // 当前路径已经是登录页面时不需要重定向
      if (pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    }
  }, [isAuthenticated, user, router, isLoading, pathname]);

  // 登录页面不需要显示管理员布局
  if (pathname === '/admin/login') {
    return children;
  }

  // 如果在加载中或未通过权限验证，显示加载状态
  if (isLoading || (!isAuthenticated || user?.role !== 'ADMIN')) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">正在验证管理员权限...</h1>
        </div>
      </div>
    );
  }

  // 用户已登录且是管理员，显示管理员界面
  return (
    <div className="flex h-screen bg-gray-100">
      {/* 移动端侧边栏切换按钮 */}
      <button
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-md shadow"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 侧边导航栏 */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-30 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-center p-6 border-b">
            <span className="text-2xl font-bold text-gray-800">9Rabbit 管理后台</span>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item, idx) => {
                const IconComponent = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <li key={idx}>
                    <Link 
                      href={item.href}
                      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-[#4ea4ad] text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <IconComponent size={20} className="mr-3" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={() => {
                logout();
                router.push('/admin/login');
              }}
              className="flex items-center w-full px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} className="mr-3" />
              <span>退出登录</span>
            </button>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 md:ml-64 p-6 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
