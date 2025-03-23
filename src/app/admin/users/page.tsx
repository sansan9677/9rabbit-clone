"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  Users,
  UserPlus,
  MailPlus,
  User,
  MoreHorizontal,
  Edit,
  Lock,
  Ban,
  ShoppingBag,
  Calendar,
  Mail,
  MapPin
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

// Define User interface
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: "active" | "inactive" | "blocked";
  role: "user" | "vip" | "admin";
  lastLogin: string;
  registerDate: string;
  ordersCount: number;
  totalSpent: number;
  address?: string;
  notes?: string;
}

// Mock users data
const users: User[] = [
  {
    id: "1",
    name: "张三",
    email: "zhangsan@example.com",
    phone: "135****6789",
    avatar: "",
    status: "active",
    role: "user",
    lastLogin: "2023-05-28 18:23",
    registerDate: "2022-10-15",
    ordersCount: 8,
    totalSpent: 1365.50,
    address: "北京市朝阳区xxx街道xxx小区"
  },
  {
    id: "2",
    name: "李四",
    email: "lisi@example.com",
    phone: "139****1234",
    avatar: "",
    status: "active",
    role: "vip",
    lastLogin: "2023-05-28 10:12",
    registerDate: "2022-08-22",
    ordersCount: 15,
    totalSpent: 3254.75,
    address: "上海市浦东新区xxx路xxx号"
  },
  {
    id: "3",
    name: "王五",
    email: "wangwu@example.com",
    phone: "136****5678",
    avatar: "",
    status: "inactive",
    role: "user",
    lastLogin: "2023-04-15 09:45",
    registerDate: "2023-01-10",
    ordersCount: 2,
    totalSpent: 325.00,
    address: "广州市天河区xxx路xxx号"
  },
  {
    id: "4",
    name: "赵六",
    email: "zhaoliu@example.com",
    phone: "158****4321",
    avatar: "",
    status: "active",
    role: "vip",
    lastLogin: "2023-05-26 14:30",
    registerDate: "2022-06-18",
    ordersCount: 22,
    totalSpent: 5782.30,
    address: "深圳市南山区xxx街道xxx号",
    notes: "高价值客户，常购买高端产品"
  },
  {
    id: "5",
    name: "钱七",
    email: "qianqi@example.com",
    phone: "133****9876",
    avatar: "",
    status: "blocked",
    role: "user",
    lastLogin: "2023-03-04 11:20",
    registerDate: "2022-12-05",
    ordersCount: 1,
    totalSpent: 126.00,
    address: "成都市武侯区xxx路xxx号",
    notes: "帐户被封禁 - 多次投诉商品"
  },
  {
    id: "6",
    name: "孙八",
    email: "sunba@example.com",
    phone: "155****6543",
    avatar: "",
    status: "active",
    role: "admin",
    lastLogin: "2023-05-28 08:45",
    registerDate: "2022-05-01",
    ordersCount: 0,
    totalSpent: 0,
    address: "杭州市西湖区xxx街道xxx号"
  },
  {
    id: "7",
    name: "周九",
    email: "zhoujiu@example.com",
    phone: "139****2468",
    avatar: "",
    status: "active",
    role: "user",
    lastLogin: "2023-05-25 17:35",
    registerDate: "2023-02-14",
    ordersCount: 3,
    totalSpent: 456.25,
    address: "武汉市江汉区xxx路xxx号"
  }
];

// Status and role options for filter
const statusOptions = [
  { value: "all", label: "全部状态" },
  { value: "active", label: "活跃用户" },
  { value: "inactive", label: "不活跃" },
  { value: "blocked", label: "已封禁" }
];

const roleOptions = [
  { value: "all", label: "全部角色" },
  { value: "user", label: "普通用户" },
  { value: "vip", label: "VIP用户" },
  { value: "admin", label: "管理员" }
];

// Get status and role badge
const getStatusBadge = (status: User["status"]) => {
  switch (status) {
    case "active":
      return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">活跃</Badge>;
    case "inactive":
      return <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">不活跃</Badge>;
    case "blocked":
      return <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">已封禁</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getRoleBadge = (role: User["role"]) => {
  switch (role) {
    case "admin":
      return <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">管理员</Badge>;
    case "vip":
      return <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">VIP用户</Badge>;
    case "user":
      return <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">普通用户</Badge>;
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
};

// Get initials for avatar
const getInitials = (name: string) => {
  return name.charAt(0).toUpperCase();
};

// Get avatar color based on role
const getAvatarColor = (role: User["role"]) => {
  switch (role) {
    case "admin":
      return "bg-purple-200 text-purple-700";
    case "vip":
      return "bg-amber-200 text-amber-700";
    case "user":
      return "bg-blue-200 text-blue-700";
    default:
      return "bg-gray-200 text-gray-700";
  }
};

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentTab, setCurrentTab] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);

  // Handle viewing user details
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsUserDetailsOpen(true);
  };

  // Filter users based on search, filters and tab
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);

    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    const matchesTab = currentTab === "all" ||
      (currentTab === "active" && user.status === "active") ||
      (currentTab === "vip" && user.role === "vip") ||
      (currentTab === "new" && new Date(user.registerDate).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000);

    return matchesSearch && matchesStatus && matchesRole && matchesTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold">用户管理</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <MailPlus size={16} className="mr-1" />
            群发邮件
          </Button>
          <Button className="bg-[#4ea4ad] hover:bg-[#3d8b93]">
            <UserPlus size={16} className="mr-1" />
            添加用户
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">全部用户</TabsTrigger>
            <TabsTrigger value="active">活跃用户</TabsTrigger>
            <TabsTrigger value="vip">VIP用户</TabsTrigger>
            <TabsTrigger value="new">新注册 (30天)</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="搜索用户名, 邮箱或电话..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div>
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="状态筛选" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select
                    value={roleFilter}
                    onValueChange={setRoleFilter}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="角色筛选" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" className="mr-2" onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setRoleFilter("all");
                  }}>
                    重置筛选
                  </Button>
                  <Button variant="outline">
                    <Filter size={16} className="mr-1" />
                    更多筛选
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="px-4 py-3 text-left font-medium text-gray-500">用户</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500 hidden md:table-cell">联系方式</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-500">状态</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-500">角色</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-500 hidden md:table-cell">订单</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-500 hidden md:table-cell">消费</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-500">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b last:border-b-0 hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <Avatar className={getAvatarColor(user.role)}>
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                              </Avatar>
                              <div className="ml-3">
                                <p className="font-medium">{user.name}</p>
                                <p className="text-xs text-gray-500">注册于: {user.registerDate}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <div>
                              <p className="text-xs">{user.email}</p>
                              <p className="text-xs">{user.phone}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {getStatusBadge(user.status)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {getRoleBadge(user.role)}
                          </td>
                          <td className="px-4 py-3 text-center hidden md:table-cell">
                            {user.ordersCount}
                          </td>
                          <td className="px-4 py-3 text-center hidden md:table-cell">
                            ¥{user.totalSpent.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal size={16} />
                                  <span className="sr-only">操作</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-36">
                                <DropdownMenuLabel>用户操作</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleViewUser(user)}>
                                  <User size={14} className="mr-2" />
                                  <span>用户详情</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit size={14} className="mr-2" />
                                  <span>编辑用户</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Lock size={14} className="mr-2" />
                                  <span>重置密码</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Ban size={14} className="mr-2" />
                                  <span>{user.status === 'blocked' ? '解除封禁' : '封禁用户'}</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                          <Users size={40} className="mx-auto mb-2 text-gray-300" />
                          <p>没有找到用户</p>
                          <p className="text-sm">尝试更改筛选条件</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              显示 {filteredUsers.length} 个用户，共 {users.length} 个
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" disabled>上一页</Button>
              <Button variant="outline" className="bg-gray-100">1</Button>
              <Button variant="outline" disabled>下一页</Button>
            </div>
          </div>
        </TabsContent>

        {/* Other tabs content would be similar */}
        <TabsContent value="active" className="space-y-4">
          <div className="text-sm text-gray-500">显示活跃用户</div>
          {/* Same filter and table structure */}
        </TabsContent>

        <TabsContent value="vip" className="space-y-4">
          <div className="text-sm text-gray-500">显示VIP用户</div>
          {/* Same filter and table structure */}
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          <div className="text-sm text-gray-500">显示最近30天新注册用户</div>
          {/* Same filter and table structure */}
        </TabsContent>
      </Tabs>

      {/* User Details Dialog */}
      {selectedUser && (
        <Dialog open={isUserDetailsOpen} onOpenChange={setIsUserDetailsOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>用户详情</DialogTitle>
              <DialogDescription>
                用户ID: {selectedUser.id}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              {/* User Profile Summary */}
              <div className="flex items-center mb-6">
                <Avatar className={`h-16 w-16 ${getAvatarColor(selectedUser.role)}`}>
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback className="text-xl">{getInitials(selectedUser.name)}</AvatarFallback>
                </Avatar>
                <div className="ml-4">
                  <h2 className="text-xl font-bold">{selectedUser.name}</h2>
                  <div className="flex space-x-2 mt-1">
                    {getStatusBadge(selectedUser.status)}
                    {getRoleBadge(selectedUser.role)}
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-medium mb-2 flex items-center">
                    <Mail size={16} className="mr-2" />
                    联系信息
                  </h3>
                  <div className="bg-gray-50 p-3 rounded-md text-sm">
                    <p><span className="text-gray-500">邮箱:</span> {selectedUser.email}</p>
                    <p><span className="text-gray-500">电话:</span> {selectedUser.phone}</p>
                    {selectedUser.address && (
                      <p className="flex items-start">
                        <span className="text-gray-500 mr-1">地址:</span>
                        <span>{selectedUser.address}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2 flex items-center">
                    <Calendar size={16} className="mr-2" />
                    帐户信息
                  </h3>
                  <div className="bg-gray-50 p-3 rounded-md text-sm">
                    <p><span className="text-gray-500">注册日期:</span> {selectedUser.registerDate}</p>
                    <p><span className="text-gray-500">最后登录:</span> {selectedUser.lastLogin}</p>
                    <p><span className="text-gray-500">帐户状态:</span> {selectedUser.status === 'active' ? '活跃' : selectedUser.status === 'inactive' ? '不活跃' : '已封禁'}</p>
                  </div>
                </div>
              </div>

              {/* Purchase Information */}
              <div className="mb-6">
                <h3 className="font-medium mb-2 flex items-center">
                  <ShoppingBag size={16} className="mr-2" />
                  购买信息
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-md text-center">
                    <p className="text-2xl font-bold">{selectedUser.ordersCount}</p>
                    <p className="text-sm text-gray-500">订单总数</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md text-center">
                    <p className="text-2xl font-bold">¥{selectedUser.totalSpent.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">总消费金额</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedUser.notes && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">备注</h3>
                  <p className="text-sm bg-gray-50 p-3 rounded-md">{selectedUser.notes}</p>
                </div>
              )}
            </div>

            <DialogFooter className="flex justify-between items-center">
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setIsUserDetailsOpen(false)}>关闭</Button>
                <Button className="bg-[#4ea4ad] hover:bg-[#3d8b93]">
                  <Edit size={16} className="mr-1" />
                  编辑用户
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
