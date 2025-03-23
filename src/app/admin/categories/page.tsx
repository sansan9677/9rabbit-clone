"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
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
  LayoutGrid,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  FolderPlus
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Define Category interface
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  featured: boolean;
}

// Mock categories data
const categories: Category[] = [
  {
    id: "1",
    name: "女生玩具",
    slug: "vibrators",
    description: "为女性设计的各种情趣用品，包括振动棒、跳蛋等",
    image: "https://ext.same-assets.com/3058330213/2058260766.jpeg",
    productCount: 42,
    featured: true
  },
  {
    id: "2",
    name: "男生玩具",
    slug: "masturbator",
    description: "为男性设计的各种情趣用品，包括飞机杯等",
    image: "https://ext.same-assets.com/3058330213/3140610377.jpeg",
    productCount: 36,
    featured: true
  },
  {
    id: "3",
    name: "情趣内衣",
    slug: "lingerie",
    description: "各类情趣内衣、内裤、丝袜等",
    image: "https://ext.same-assets.com/3058330213/2563551977.jpeg",
    productCount: 28,
    featured: true
  },
  {
    id: "4",
    name: "情趣S.M.",
    slug: "sm",
    description: "各类情趣SM道具，包括手铐、眼罩等",
    image: "https://ext.same-assets.com/3058330213/3635478225.jpeg",
    productCount: 19,
    featured: false
  },
  {
    id: "5",
    name: "安全套套",
    slug: "condom",
    description: "各种品牌、各种型号的安全套",
    image: "https://ext.same-assets.com/3058330213/2639747204.jpeg",
    productCount: 15,
    featured: true
  },
  {
    id: "6",
    name: "情趣辅助",
    slug: "lubricant",
    description: "各种润滑剂、情趣香水等辅助产品",
    image: "https://ext.same-assets.com/3058330213/3429743205.jpeg",
    productCount: 22,
    featured: false
  }
];

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    featured: false
  });

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle opening edit dialog
  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setIsEditDialogOpen(true);
  };

  // Reset form when closing dialogs
  const handleCloseDialog = () => {
    setNewCategory({
      name: "",
      slug: "",
      description: "",
      image: "",
      featured: false
    });
    setSelectedCategory(null);
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
  };

  // Handle add category (mock)
  const handleAddCategory = () => {
    // In a real app, you would submit to an API endpoint
    console.log("Adding new category:", newCategory);
    handleCloseDialog();
  };

  // Handle edit category (mock)
  const handleEditCategory = () => {
    // In a real app, you would submit to an API endpoint
    console.log("Editing category:", selectedCategory);
    handleCloseDialog();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold">分类管理</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#4ea4ad] hover:bg-[#3d8b93]">
              <Plus size={16} className="mr-1" />
              添加分类
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>添加新分类</DialogTitle>
              <DialogDescription>
                创建一个新的商品分类。分类创建后将立即显示在网站上。
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">分类名称</Label>
                <Input
                  id="name"
                  placeholder="例如：女性玩具"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slug">URL 标识</Label>
                <Input
                  id="slug"
                  placeholder="例如：female-toys"
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory({...newCategory, slug: e.target.value})}
                />
                <p className="text-xs text-gray-500">用于 URL 的唯一标识符，仅使用小写字母、数字和连字符</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">分类描述</Label>
                <Input
                  id="description"
                  placeholder="简要描述该分类"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">分类图片 URL</Label>
                <Input
                  id="image"
                  placeholder="输入图片链接"
                  value={newCategory.image}
                  onChange={(e) => setNewCategory({...newCategory, image: e.target.value})}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={newCategory.featured}
                  onChange={(e) => setNewCategory({...newCategory, featured: e.target.checked})}
                  className="h-4 w-4 rounded border-gray-300 text-[#4ea4ad] focus:ring-[#4ea4ad]"
                />
                <Label htmlFor="featured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  设为首页推荐分类
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>取消</Button>
              <Button className="bg-[#4ea4ad] hover:bg-[#3d8b93]" onClick={handleAddCategory}>保存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Category Dialog */}
        {selectedCategory && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>编辑分类</DialogTitle>
                <DialogDescription>
                  修改分类信息。所有更改将立即生效。
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">分类名称</Label>
                  <Input
                    id="edit-name"
                    value={selectedCategory.name}
                    onChange={(e) => setSelectedCategory({...selectedCategory, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-slug">URL 标识</Label>
                  <Input
                    id="edit-slug"
                    value={selectedCategory.slug}
                    onChange={(e) => setSelectedCategory({...selectedCategory, slug: e.target.value})}
                  />
                  <p className="text-xs text-gray-500">用于 URL 的唯一标识符，仅使用小写字母、数字和连字符</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">分类描述</Label>
                  <Input
                    id="edit-description"
                    value={selectedCategory.description}
                    onChange={(e) => setSelectedCategory({...selectedCategory, description: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-image">分类图片 URL</Label>
                  <Input
                    id="edit-image"
                    value={selectedCategory.image}
                    onChange={(e) => setSelectedCategory({...selectedCategory, image: e.target.value})}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-featured"
                    checked={selectedCategory.featured}
                    onChange={(e) => setSelectedCategory({...selectedCategory, featured: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300 text-[#4ea4ad] focus:ring-[#4ea4ad]"
                  />
                  <Label htmlFor="edit-featured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    设为首页推荐分类
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseDialog}>取消</Button>
                <Button className="bg-[#4ea4ad] hover:bg-[#3d8b93]" onClick={handleEditCategory}>保存更改</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="搜索分类名称或标识..."
              className="pl-8 w-full md:w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <div className="relative h-40 w-full">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
                {category.featured && (
                  <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
                    首页推荐
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription className="text-sm text-gray-500 mt-1">
                      /{category.slug}
                    </CardDescription>
                  </div>
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
                      <DropdownMenuItem onClick={() => handleEditClick(category)}>
                        <Edit size={14} className="mr-2" />
                        <span>编辑</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FolderPlus size={14} className="mr-2" />
                        <span>添加子分类</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 size={14} className="mr-2" />
                        <span>删除</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 line-clamp-2 mb-2">{category.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">{category.productCount} 个商品</span>
                  <Link href={`/collections/${category.slug}`}>
                    <Button variant="outline" size="sm">查看商品</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg">
            <LayoutGrid size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-medium">没有找到分类</h3>
            <p className="text-gray-500 mb-4">尝试更改搜索条件或添加新分类</p>
            <DialogTrigger asChild>
              <Button className="bg-[#4ea4ad] hover:bg-[#3d8b93]">
                <Plus size={16} className="mr-1" />
                添加分类
              </Button>
            </DialogTrigger>
          </div>
        )}
      </div>
    </div>
  );
}
