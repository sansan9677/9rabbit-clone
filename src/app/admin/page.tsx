"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Users,
  DollarSign,
  Package,
  TrendingUp,
  Clock,
  Truck,
  CheckCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for the dashboard
const stats = [
  {
    title: "总销售额",
    value: "¥128,430",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "bg-green-100 text-green-600"
  },
  {
    title: "订单总数",
    value: "1,243",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingBag,
    color: "bg-blue-100 text-blue-600"
  },
  {
    title: "注册用户",
    value: "3,567",
    change: "+15.3%",
    trend: "up",
    icon: Users,
    color: "bg-purple-100 text-purple-600"
  },
  {
    title: "商品总数",
    value: "498",
    change: "+3.1%",
    trend: "up",
    icon: Package,
    color: "bg-orange-100 text-orange-600"
  },
];

const recentOrders = [
  { id: "ORD-9845", customer: "张三", amount: "¥412", status: "已完成", date: "2023-05-28" },
  { id: "ORD-9844", customer: "李四", amount: "¥156", status: "已发货", date: "2023-05-28" },
  { id: "ORD-9843", customer: "王五", amount: "¥289", status: "处理中", date: "2023-05-27" },
  { id: "ORD-9842", customer: "赵六", amount: "¥542", status: "已完成", date: "2023-05-27" },
  { id: "ORD-9841", customer: "钱七", amount: "¥126", status: "已发货", date: "2023-05-26" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "已完成":
      return "bg-green-100 text-green-600";
    case "已发货":
      return "bg-blue-100 text-blue-600";
    case "处理中":
      return "bg-yellow-100 text-yellow-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "已完成":
      return <CheckCircle size={14} />;
    case "已发货":
      return <Truck size={14} />;
    case "处理中":
      return <Clock size={14} />;
    default:
      return null;
  }
};

export default function AdminDashboard() {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    // 仅在客户端更新时间
    setCurrentTime(new Date().toLocaleString("zh-CN"));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">控制面板</h1>
        <span className="text-sm text-gray-500">最后更新: {currentTime}</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  <div className={`flex items-center mt-1 text-xs font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    <TrendingUp size={14} className="mr-1" />
                    {stat.change} 较上月
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>快捷操作</CardTitle>
          <CardDescription>常用管理功能的快速访问</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/products/new" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 flex flex-col items-center text-center transition-colors">
              <Package size={24} className="mb-2 text-[#4ea4ad]" />
              <span>添加商品</span>
            </Link>
            <Link href="/admin/orders" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 flex flex-col items-center text-center transition-colors">
              <ShoppingBag size={24} className="mb-2 text-[#4ea4ad]" />
              <span>查看订单</span>
            </Link>
            <Link href="/admin/categories" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 flex flex-col items-center text-center transition-colors">
              <TrendingUp size={24} className="mb-2 text-[#4ea4ad]" />
              <span>促销管理</span>
            </Link>
            <Link href="/admin/settings" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 flex flex-col items-center text-center transition-colors">
              <Users size={24} className="mb-2 text-[#4ea4ad]" />
              <span>用户管理</span>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>最近订单</CardTitle>
            <CardDescription>最近5个订单及状态</CardDescription>
          </div>
          <Link href="/admin/orders" className="text-sm text-[#4ea4ad] hover:underline">
            查看全部
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">订单号</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">客户</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">金额</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">状态</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">日期</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{order.id}</td>
                    <td className="px-4 py-3">{order.customer}</td>
                    <td className="px-4 py-3">{order.amount}</td>
                    <td className="px-4 py-3">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
