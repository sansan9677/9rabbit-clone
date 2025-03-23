"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, User, ShoppingBag, Menu, ChevronDown, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-hot-toast";
import { useCart } from "@/lib/CartContext";

interface Category {
  name: string;
  link: string;
  subcategories?: { name: string; link: string }[];
}

const categories: Category[] = [
  {
    name: "首页",
    link: "/",
  },
  {
    name: "新品爆款",
    link: "/collections/new-products",
  },
  {
    name: "女生玩具",
    link: "/collections/vibrators",
    subcategories: [
      { name: "秒潮神器", link: "/collections/clitoral-stimulator" },
      { name: "仙女棒", link: "/collections/vibrator-dildo" },
      { name: "跳蛋 | 穿戴 | 远程", link: "/collections/kegel-ball" },
      { name: "仿真阳具 - 按摩阳具", link: "/collections/dildos" },
    ]
  },
  {
    name: "男生玩具",
    link: "/collections/masturbator",
    subcategories: [
      { name: "自动飞机杯", link: "/collections/auto-masturbator" },
      { name: "手动飞机杯", link: "/collections/manual-masturbator" },
      { name: "名器倒模", link: "/collections/torso" },
      { name: "臀模&半身倒模", link: "/collections/half-torso" },
      { name: "飞机杯配件", link: "/collections/masturbator-accessories" },
      { name: "后庭/前列腺按摩", link: "/collections/anal-massage" },
    ]
  },
  {
    name: "情趣服饰",
    link: "/collections/clothes",
    subcategories: [
      { name: "情趣内衣", link: "/collections/lingerie" },
      { name: "情趣配件", link: "/collections/accessories" },
    ]
  },
  {
    name: "情趣S.M.",
    link: "/collections/sm",
    subcategories: [
      { name: "S.M.套装", link: "/collections/sm-set" },
      { name: "鞭子&眼罩", link: "/collections/whip-blindfold" },
    ]
  },
  {
    name: "安全套套",
    link: "/collections/condom",
    subcategories: [
      { name: "轻薄润滑", link: "/collections/thin-condom" },
      { name: "延迟增大", link: "/collections/delay-condom" },
    ]
  },
  {
    name: "情趣辅助",
    link: "/collections/lubricant",
    subcategories: [
      { name: "润滑液", link: "/collections/lubricant-gel" },
      { name: "清洁护理", link: "/collections/cleaner" },
    ]
  },
  {
    name: "实体娃娃",
    link: "/collections/sex-dolls",
  },
  {
    name: "清仓促销",
    link: "/collections/clearance",
  },
];

export default function Header() {
  const [openCategories, setOpenCategories] = useState<Set<number>>(new Set());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();

  const toggleCategory = (index: number) => {
    const newOpenCategories = new Set(openCategories);
    if (newOpenCategories.has(index)) {
      newOpenCategories.delete(index);
    } else {
      newOpenCategories.add(index);
    }
    setOpenCategories(newOpenCategories);
  };

  const handleLogout = () => {
    logout();
    toast.success("已成功退出登录");
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Dialog open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2 focus:outline-none hover:bg-gray-100">
                  <Menu size={24} className="text-gray-700" />
                </Button>
              </DialogTrigger>
              <DialogContent className="left-0 w-[85%] max-w-[300px] h-svh overflow-y-auto p-6 pt-16 rounded-r-xl rounded-l-none">
                <DialogTitle className="sr-only">导航菜单</DialogTitle>
                <div className="space-y-4">
                  {categories.map((category, index) => (
                    <div key={index} className="py-2 border-b border-gray-100 last:border-b-0">
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => category.subcategories && toggleCategory(index)}
                      >
                        <Link
                          href={category.link}
                          className="text-gray-800 hover:text-[#4ea4ad] text-base font-medium"
                          onClick={() => !category.subcategories && setIsMobileMenuOpen(false)}
                        >
                          {category.name}
                        </Link>
                        {category.subcategories && (
                          <ChevronDown
                            size={18}
                            className={cn(
                              "transition-transform duration-200 text-gray-500",
                              openCategories.has(index) ? "transform rotate-180" : ""
                            )}
                          />
                        )}
                      </div>
                      {category.subcategories && openCategories.has(index) && (
                        <div className="pl-4 mt-2 space-y-2">
                          {category.subcategories.map((subcategory, subIndex) => (
                            <Link
                              key={subIndex}
                              href={subcategory.link}
                              className="block py-1 text-sm text-gray-600 hover:text-[#4ea4ad]"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {subcategory.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <Link href="/" className="flex items-center">
              <Image
                src="https://ext.same-assets.com/3058330213/3300747421.png"
                alt="9Rabbit"
                width={120}
                height={40}
                className="h-8 sm:h-10 w-auto"
                priority
              />
            </Link>
          </div>

          <div className="flex items-center space-x-1">
            <Link href="/search">
              <Button variant="ghost" size="icon" className="focus:outline-none hover:bg-gray-100">
                <Search size={20} className="text-gray-700" />
              </Button>
            </Link>
            
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative focus:outline-none hover:bg-gray-100 rounded-full overflow-hidden">
                    {user.avatar ? (
                      <Image 
                        src={user.avatar} 
                        alt={user.name || user.email} 
                        width={32} 
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#4ea4ad] text-white flex items-center justify-center text-sm font-semibold">
                        {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/account">
                    <DropdownMenuItem className="cursor-pointer">
                      个人中心
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/account/orders">
                    <DropdownMenuItem className="cursor-pointer">
                      我的订单
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/account/wishlist">
                    <DropdownMenuItem className="cursor-pointer">
                      我的收藏
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/account/settings">
                    <DropdownMenuItem className="cursor-pointer">
                      账户设置
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>退出登录</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/account">
                <Button variant="ghost" size="icon" className="focus:outline-none hover:bg-gray-100">
                  <User size={20} className="text-gray-700" />
                </Button>
              </Link>
            )}
            
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative focus:outline-none hover:bg-gray-100">
                <ShoppingBag size={20} className="text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#d44d49] text-[10px] font-medium text-white">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
