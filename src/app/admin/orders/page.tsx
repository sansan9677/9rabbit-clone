"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
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
  ClipboardList,
  Eye,
  MoreHorizontal,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  CalendarRange,
  Download
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

// Define Order interface
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  orderNumber: string;
  date: string;
  status: "completed" | "processing" | "shipped" | "cancelled" | "refunded";
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  items: OrderItem[];
  total: number;
  shippingAddress: string;
  shippingMethod: string;
  notes?: string;
}

// Mock orders data
const orders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-9845",
    customer: {
      name: "张三",
      email: "zhangsan@example.com",
      phone: "135****6789"
    },
    date: "2023-05-28 14:32",
    status: "completed",
    paymentStatus: "paid",
    items: [
      { id: "1", name: "KISTOY Polly Plus二代秒爱吮吸神器", price: 86.00, quantity: 1 },
      { id: "2", name: "情趣润滑剂", price: 25.00, quantity: 2 }
    ],
    total: 136.00,
    shippingAddress: "北京市朝阳区xxx街道xxx小区",
    shippingMethod: "顺丰速运"
  },
  {
    id: "2",
    orderNumber: "ORD-9844",
    customer: {
      name: "李四",
      email: "lisi@example.com",
      phone: "139****1234"
    },
    date: "2023-05-28 09:17",
    status: "shipped",
    paymentStatus: "paid",
    items: [
      { id: "1", name: "小怪兽魔吻抑菌版HPV吮吸APP远程控制跳蛋-白夜魔版", price: 117.00, quantity: 1 },
      { id: "2", name: "安全套套-超薄款", price: 39.00, quantity: 1 }
    ],
    total: 156.00,
    shippingAddress: "上海市浦东新区xxx路xxx号",
    shippingMethod: "圆通快递"
  },
  {
    id: "3",
    orderNumber: "ORD-9843",
    customer: {
      name: "王五",
      email: "wangwu@example.com",
      phone: "136****5678"
    },
    date: "2023-05-27 21:03",
    status: "processing",
    paymentStatus: "paid",
    items: [
      { id: "1", name: "小怪兽魔炮抑菌版HPV智能APP远程遥控振动棒-白夜魔版", price: 125.00, quantity: 1 },
      { id: "2", name: "情趣内衣-蕾丝吊带", price: 88.00, quantity: 1 },
      { id: "3", name: "情趣润滑剂", price: 25.00, quantity: 3 }
    ],
    total: 289.00,
    shippingAddress: "广州市天河区xxx路xxx号",
    shippingMethod: "京东物流",
    notes: "请用隐私包装"
  },
  {
    id: "4",
    orderNumber: "ORD-9842",
    customer: {
      name: "赵六",
      email: "zhaoliu@example.com",
      phone: "158****4321"
    },
    date: "2023-05-27 16:45",
    status: "completed",
    paymentStatus: "paid",
    items: [
      { id: "1", name: "网易春风黑洞Plus全自动APP操控飞机杯", price: 187.00, quantity: 1 },
      { id: "2", name: "对子哈特Toysheart R20飞机杯", price: 70.00, quantity: 1 },
      { id: "3", name: "情趣润滑剂", price: 25.00, quantity: 2 },
      { id: "4", name: "安全套套-超薄款", price: 39.00, quantity: 3 }
    ],
    total: 542.00,
    shippingAddress: "深圳市南山区xxx街道xxx号",
    shippingMethod: "顺丰速运"
  },
  {
    id: "5",
    orderNumber: "ORD-9841",
    customer: {
      name: "钱七",
      email: "qianqi@example.com",
      phone: "133****9876"
    },
    date: "2023-05-26 10:12",
    status: "shipped",
    paymentStatus: "paid",
    items: [
      { id: "1", name: "情趣内衣-透视装", price: 126.00, quantity: 1 }
    ],
    total: 126.00,
    shippingAddress: "成都市武侯区xxx路xxx号",
    shippingMethod: "中通快递",
    notes: "需要发票"
  },
  {
    id: "6",
    orderNumber: "ORD-9840",
    customer: {
      name: "孙八",
      email: "sunba@example.com",
      phone: "155****6543"
    },
    date: "2023-05-26 08:30",
    status: "cancelled",
    paymentStatus: "refunded",
    items: [
      { id: "1", name: "网易春风TryFun元力2代智能旋转伸缩元宇宙飞机杯", price: 312.00, quantity: 1 }
    ],
    total: 312.00,
    shippingAddress: "杭州市西湖区xxx街道xxx号",
    shippingMethod: "申通快递",
    notes: "客户取消订单"
  },
  {
    id: "7",
    orderNumber: "ORD-9839",
    customer: {
      name: "周九",
      email: "zhoujiu@example.com",
      phone: "139****2468"
    },
    date: "2023-05-25 19:55",
    status: "processing",
    paymentStatus: "pending",
    items: [
      { id: "1", name: "谜姬-桥本有菜の印象东京-名器倒膜电动飞机杯-三代升级版", price: 101.00, quantity: 1 },
      { id: "2", name: "情趣辅助道具套装", price: 199.00, quantity: 1 }
    ],
    total: 300.00,
    shippingAddress: "武汉市江汉区xxx路xxx号",
    shippingMethod: "韵达快递"
  }
];

// Status options and colors
const orderStatusOptions = [
  { value: "all", label: "全部状态" },
  { value: "processing", label: "处理中" },
  { value: "shipped", label: "已发货" },
  { value: "completed", label: "已完成" },
  { value: "cancelled", label: "已取消" },
  { value: "refunded", label: "已退款" }
];

const getStatusBadge = (status: Order["status"]) => {
  switch (status) {
    case "processing":
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200 flex gap-1 items-center"><Clock size={12} /> 处理中</Badge>;
    case "shipped":
      return <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 flex gap-1 items-center"><Truck size={12} /> 已发货</Badge>;
    case "completed":
      return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 flex gap-1 items-center"><CheckCircle size={12} /> 已完成</Badge>;
    case "cancelled":
      return <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 flex gap-1 items-center"><XCircle size={12} /> 已取消</Badge>;
    case "refunded":
      return <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200 flex gap-1 items-center"><Download size={12} /> 已退款</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentTab, setCurrentTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);

  // Handle viewing order details
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };

  // Filter orders based on search, filter and tab
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    const matchesTab = currentTab === "all" ||
      (currentTab === "recent" && new Date(order.date).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000) ||
      (currentTab === "processing" && order.status === "processing") ||
      (currentTab === "shipped" && order.status === "shipped") ||
      (currentTab === "completed" && order.status === "completed");

    return matchesSearch && matchesStatus && matchesTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">订单管理</h1>
        <Button className="bg-[#4ea4ad] hover:bg-[#3d8b93]">
          <Download size={16} className="mr-1" />
          导出订单
        </Button>
      </div>

      <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">全部订单</TabsTrigger>
            <TabsTrigger value="recent">最近7天</TabsTrigger>
            <TabsTrigger value="processing">处理中</TabsTrigger>
            <TabsTrigger value="shipped">已发货</TabsTrigger>
            <TabsTrigger value="completed">已完成</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="搜索订单号或客户..."
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
                      <SelectValue placeholder="订单状态筛选" />
                    </SelectTrigger>
                    <SelectContent>
                      {orderStatusOptions.map((option) => (
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

          {/* Orders Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="px-4 py-3 text-left font-medium text-gray-500">订单号</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">客户</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">日期</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-500">总金额</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-500">状态</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-500">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b last:border-b-0 hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                          <td className="px-4 py-3">
                            <div>
                              <p>{order.customer.name}</p>
                              <p className="text-xs text-gray-500">{order.customer.email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            <div className="flex items-center">
                              <CalendarRange size={14} className="mr-1" />
                              {order.date}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center font-medium">¥{order.total.toFixed(2)}</td>
                          <td className="px-4 py-3 text-center">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                              <Eye size={14} className="mr-1" />
                              查看
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          <ClipboardList size={40} className="mx-auto mb-2 text-gray-300" />
                          <p>没有找到订单</p>
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
              显示 {filteredOrders.length} 个订单，共 {orders.length} 个
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" disabled>上一页</Button>
              <Button variant="outline" className="bg-gray-100">1</Button>
              <Button variant="outline" disabled>下一页</Button>
            </div>
          </div>
        </TabsContent>

        {/* Other tab contents would be similar, so just reuse the same content for simplicity */}
        <TabsContent value="recent" className="space-y-4">
          <div className="text-sm text-gray-500">显示最近7天内的订单</div>
          {/* Same filter and table structure would go here */}
        </TabsContent>

        <TabsContent value="processing" className="space-y-4">
          <div className="text-sm text-gray-500">显示处理中的订单</div>
          {/* Same filter and table structure would go here */}
        </TabsContent>

        <TabsContent value="shipped" className="space-y-4">
          <div className="text-sm text-gray-500">显示已发货的订单</div>
          {/* Same filter and table structure would go here */}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="text-sm text-gray-500">显示已完成的订单</div>
          {/* Same filter and table structure would go here */}
        </TabsContent>
      </Tabs>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>订单详情</DialogTitle>
              <DialogDescription>
                订单号: {selectedOrder.orderNumber}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-medium">客户信息</h3>
                  <div className="text-sm mt-2">
                    <p><span className="text-gray-500">姓名:</span> {selectedOrder.customer.name}</p>
                    <p><span className="text-gray-500">邮箱:</span> {selectedOrder.customer.email}</p>
                    <p><span className="text-gray-500">电话:</span> {selectedOrder.customer.phone}</p>
                  </div>
                </div>

                <div className="text-right">
                  <h3 className="font-medium">订单信息</h3>
                  <div className="text-sm mt-2">
                    <p><span className="text-gray-500">日期:</span> {selectedOrder.date}</p>
                    <p><span className="text-gray-500">状态:</span> {getStatusBadge(selectedOrder.status)}</p>
                    <p>
                      <span className="text-gray-500">支付状态:</span>
                      <Badge variant="outline" className={`ml-1 ${
                        selectedOrder.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                        selectedOrder.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        selectedOrder.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {selectedOrder.paymentStatus === 'paid' ? '已支付' :
                         selectedOrder.paymentStatus === 'pending' ? '待支付' :
                         selectedOrder.paymentStatus === 'failed' ? '支付失败' :
                         '已退款'}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="mb-6">
                <h3 className="font-medium mb-2">订单商品</h3>
                <div className="bg-gray-50 rounded-md">
                  <div className="grid grid-cols-12 gap-2 p-3 text-sm font-medium text-gray-500 border-b">
                    <div className="col-span-6">商品</div>
                    <div className="col-span-2 text-center">单价</div>
                    <div className="col-span-2 text-center">数量</div>
                    <div className="col-span-2 text-right">小计</div>
                  </div>

                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 p-3 text-sm border-b last:border-b-0">
                      <div className="col-span-6">{item.name}</div>
                      <div className="col-span-2 text-center">¥{item.price.toFixed(2)}</div>
                      <div className="col-span-2 text-center">{item.quantity}</div>
                      <div className="col-span-2 text-right font-medium">¥{(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}

                  <div className="grid grid-cols-12 gap-2 p-3 text-sm font-medium">
                    <div className="col-span-10 text-right">总计:</div>
                    <div className="col-span-2 text-right">¥{selectedOrder.total.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-medium mb-2">收货地址</h3>
                  <p className="text-sm">{selectedOrder.shippingAddress}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">配送方式</h3>
                  <p className="text-sm">{selectedOrder.shippingMethod}</p>
                </div>
              </div>

              {selectedOrder.notes && (
                <>
                  <Separator className="my-4" />
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">订单备注</h3>
                    <p className="text-sm bg-gray-50 p-3 rounded-md">{selectedOrder.notes}</p>
                  </div>
                </>
              )}
            </div>

            <DialogFooter className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Button variant="outline" className="text-blue-600">
                  <Download size={16} className="mr-1" />
                  打印订单
                </Button>
                <Button variant="outline" className="text-blue-600">
                  <Download size={16} className="mr-1" />
                  导出PDF
                </Button>
              </div>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setIsOrderDetailsOpen(false)}>关闭</Button>
                {selectedOrder.status === "processing" && (
                  <Button className="bg-[#4ea4ad] hover:bg-[#3d8b93]">
                    <Truck size={16} className="mr-1" />
                    标记为已发货
                  </Button>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
