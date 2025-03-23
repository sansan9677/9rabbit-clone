"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
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
  Package,
  Plus,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Eye,
  Loader2
} from "lucide-react";
import { productAPI, categoryAPI } from "@/lib/api";
import toast from "react-hot-toast";

// 定义产品和分类的接口
interface Product {
  id: string;
  name: string;
  price: number;
  comparePrice?: number;
  stock: number;
  images: string[];
  category: {
    id: string;
    name: string;
  };
  featured: boolean;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
}

// Status options for filter
const statusOptions = [
  { value: "all", label: "全部状态" },
  { value: "active", label: "在售" },
  { value: "out_of_stock", label: "缺货" },
  { value: "discontinued", label: "已下架" },
];

// 获取商品状态
const getProductStatus = (product: Product): string => {
  if (product.stock <= 0) {
    return "out_of_stock";
  }
  return "active";
};

// 获取状态标签
const getStatusLabel = (status: string): string => {
  const option = statusOptions.find(opt => opt.value === status);
  return option ? option.label : status;
};

// 获取状态颜色
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'out_of_stock':
      return 'bg-red-100 text-red-800';
    case 'discontinued':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{value: string; label: string}[]>([
    { value: "all", label: "全部分类" }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [totalCount, setTotalCount] = useState(0);

  // 获取商品和分类数据
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // 获取分类数据
        const categoriesResponse = await categoryAPI.getAllCategories();
        if (categoriesResponse.success) {
          const categoriesData = categoriesResponse.data.map((cat: Category) => ({
            value: cat.id,
            label: cat.name
          }));
          setCategories([{ value: "all", label: "全部分类" }, ...categoriesData]);
        }
        
        // 获取产品数据
        const productsResponse = await productAPI.getAllProducts({
          limit: 100 // 获取所有产品，后续可以添加分页功能
        });
        
        if (productsResponse.success) {
          setProducts(productsResponse.data.products);
          setTotalCount(productsResponse.data.pagination.total);
        } else {
          setError("获取产品数据失败");
        }
      } catch (err) {
        console.error("获取数据错误:", err);
        setError("获取数据时发生错误，请稍后再试");
        toast.error("获取数据失败，请稍后再试");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // 过滤商品
  const filteredProducts = products.filter(product => {
    const productStatus = getProductStatus(product);
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category.id === categoryFilter;
    const matchesStatus = statusFilter === "all" || productStatus === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // 删除商品
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("确定要删除此商品吗？此操作无法撤销。")) {
      return;
    }
    
    try {
      const response = await productAPI.deleteProduct(productId);
      if (response.success) {
        toast.success("商品已成功删除");
        // 从列表中移除已删除的商品
        setProducts(products.filter(p => p.id !== productId));
      } else {
        toast.error(response.message || "删除商品失败");
      }
    } catch (err) {
      console.error("删除商品错误:", err);
      toast.error("删除商品时发生错误，请稍后再试");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold">商品管理</h1>
        <Link href="/admin/products/new">
          <Button className="bg-[#4ea4ad] hover:bg-[#3d8b93]">
            <Plus size={16} className="mr-1" />
            添加商品
          </Button>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="搜索商品名称..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="分类筛选" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

            <div className="flex justify-end">
              <Button variant="outline" className="mr-2" onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
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

      {/* Product Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">商品</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">价格</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 hidden md:table-cell">分类</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500 hidden md:table-cell">库存</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500">状态</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">操作</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      <Loader2 size={40} className="mx-auto mb-2 text-gray-300 animate-spin" />
                      <p>正在加载商品数据...</p>
                    </td>
                  </tr>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const productStatus = getProductStatus(product);
                    return (
                      <tr key={product.id} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                              {product.images && product.images.length > 0 ? (
                                <Image
                                  src={product.images[0]}
                                  alt={product.name}
                                  width={40}
                                  height={40}
                                  className="h-10 w-10 object-cover"
                                />
                              ) : (
                                <div className="flex h-10 w-10 items-center justify-center bg-gray-200 text-gray-500">
                                  <Package size={16} />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{product.name}</div>
                              <div className="text-gray-500">ID: {product.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium">{product.price.toFixed(2)}¥</div>
                          {product.comparePrice && (
                            <div className="text-sm text-gray-500 line-through">{product.comparePrice.toFixed(2)}¥</div>
                          )}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {product.category.name}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center hidden md:table-cell">
                          <span className={`font-medium ${product.stock > 0 ? 'text-gray-900' : 'text-red-600'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(productStatus)}`}>
                            {getStatusLabel(productStatus)}
                          </div>
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
                              <DropdownMenuLabel>操作</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Link href={`/products/${product.id}`} className="flex items-center w-full">
                                  <Eye size={14} className="mr-2" />
                                  <span>查看</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Link href={`/admin/products/${product.id}/edit`} className="flex items-center w-full">
                                  <Edit size={14} className="mr-2" />
                                  <span>编辑</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Link href={`/admin/products/${product.id}/duplicate`} className="flex items-center w-full">
                                  <Copy size={14} className="mr-2" />
                                  <span>复制</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteProduct(product.id)}>
                                <Trash2 size={14} className="mr-2" />
                                <span>删除</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      <Package size={40} className="mx-auto mb-2 text-gray-300" />
                      <p>没有找到商品</p>
                      <p className="text-sm">尝试更改筛选条件或添加新商品</p>
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
          显示 {filteredProducts.length} 个商品，共 {totalCount} 个
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" disabled>上一页</Button>
          <Button variant="outline" className="bg-gray-100">1</Button>
          <Button variant="outline" disabled>下一页</Button>
        </div>
      </div>
    </div>
  );
}
