"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/layout/PageLayout";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice, cartCount } = useCart();
  const { isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  // 处理结账
  const handleCheckout = () => {
    if (!isAuthenticated) {
      // 如果用户未登录，重定向到登录页面
      router.push("/account?redirect=/checkout");
      return;
    }

    // 处理结账逻辑
    setIsProcessing(true);
    setTimeout(() => {
      router.push("/checkout");
      setIsProcessing(false);
    }, 500);
  };

  // 如果购物车为空
  if (cartCount === 0) {
    return (
      <PageLayout>
        <div className="container px-4 py-8 md:py-12">
          <h1 className="text-2xl font-medium mb-8 text-center">购物车</h1>
          
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-6">
              <ShoppingCart size={64} className="mx-auto text-gray-300" />
            </div>
            
            <h2 className="text-xl font-medium mb-3">您的购物车是空的</h2>
            <p className="text-gray-500 mb-6">
              看起来您还没有将任何物品添加到购物车中。
            </p>
            
            <Link href="/collections/new-products">
              <Button className="bg-[#4ea4ad] hover:bg-[#3d8b93]">
                继续购物
              </Button>
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container px-4 py-8 md:py-12">
        <h1 className="text-2xl font-medium mb-8 text-center">购物车</h1>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* 购物车商品列表 */}
            <div className="md:col-span-2">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.variantId || ''}`} className="flex border border-gray-200 rounded-lg p-4">
                    <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          {item.variantName && (
                            <p className="text-sm text-gray-500">{item.variantName}</p>
                          )}
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item.id, item.variantId)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.variantId)}
                            className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-2 py-1 min-w-[40px] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.variantId)}
                            className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-medium">{formatPrice(item.price * item.quantity)}</div>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <div className="text-sm text-gray-500 line-through">
                              {formatPrice(item.originalPrice * item.quantity)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearCart}
                  className="text-gray-500"
                >
                  清空购物车
                </Button>
                
                <Link href="/" className="text-[#4ea4ad] hover:underline text-sm">
                  继续购物
                </Link>
              </div>
            </div>
            
            {/* 订单摘要 */}
            <div className="md:col-span-1">
              <div className="border border-gray-200 rounded-lg p-6 sticky top-24">
                <h2 className="text-lg font-medium mb-4">订单摘要</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">小计</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">配送费</span>
                    <span>免费</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between font-medium">
                    <span>总计</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-[#4ea4ad] hover:bg-[#3d8b93]"
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  {isProcessing ? "处理中..." : "结账"}
                </Button>
                
                <div className="mt-4 text-xs text-gray-500 text-center">
                  结账即表示您同意我们的
                  <Link href="/terms" className="text-[#4ea4ad] hover:underline mx-1">
                    条款和条件
                  </Link>
                  和
                  <Link href="/privacy" className="text-[#4ea4ad] hover:underline ml-1">
                    隐私政策
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
