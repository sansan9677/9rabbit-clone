"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, User, ShoppingBag, Grid } from "lucide-react";

export default function MobileNavBar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-gray-100 bg-white py-1.5 md:hidden z-40 shadow-sm">
      <div className="grid grid-cols-5 gap-0 px-2">
        <Link href="/" className="flex flex-col items-center justify-center py-1">
          <Home
            size={22}
            className={isActive("/") ? "text-[#4ea4ad]" : "text-gray-500"}
            strokeWidth={1.5}
          />
          <span className={`text-[10px] mt-0.5 ${isActive("/") ? "text-[#4ea4ad] font-medium" : "text-gray-500"}`}>
            首页
          </span>
        </Link>

        <Link href="/collections" className="flex flex-col items-center justify-center py-1">
          <Grid
            size={22}
            className={isActive("/collections") ? "text-[#4ea4ad]" : "text-gray-500"}
            strokeWidth={1.5}
          />
          <span className={`text-[10px] mt-0.5 ${isActive("/collections") ? "text-[#4ea4ad] font-medium" : "text-gray-500"}`}>
            分类
          </span>
        </Link>

        <Link href="/search" className="flex flex-col items-center justify-center py-1">
          <Search
            size={22}
            className={isActive("/search") ? "text-[#4ea4ad]" : "text-gray-500"}
            strokeWidth={1.5}
          />
          <span className={`text-[10px] mt-0.5 ${isActive("/search") ? "text-[#4ea4ad] font-medium" : "text-gray-500"}`}>
            搜索
          </span>
        </Link>

        <Link href="/account" className="flex flex-col items-center justify-center py-1">
          <User
            size={22}
            className={isActive("/account") ? "text-[#4ea4ad]" : "text-gray-500"}
            strokeWidth={1.5}
          />
          <span className={`text-[10px] mt-0.5 ${isActive("/account") ? "text-[#4ea4ad] font-medium" : "text-gray-500"}`}>
            我的
          </span>
        </Link>

        <Link href="/cart" className="flex flex-col items-center justify-center py-1 relative">
          <div className="relative">
            <ShoppingBag
              size={22}
              className={isActive("/cart") ? "text-[#4ea4ad]" : "text-gray-500"}
              strokeWidth={1.5}
            />
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#d44d49] text-[10px] font-medium text-white">
              1
            </span>
          </div>
          <span className={`text-[10px] mt-0.5 ${isActive("/cart") ? "text-[#4ea4ad] font-medium" : "text-gray-500"}`}>
            购物车
          </span>
        </Link>
      </div>
    </div>
  );
}
