"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  variantId?: string;
  variantName?: string;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (id: string, variantId?: string) => void;
  updateQuantity: (id: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  isCartLoading: boolean;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  // 计算购物车中的商品总数
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // 计算购物车总价
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // 从本地存储加载购物车
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error("Failed to load cart from local storage:", error);
      } finally {
        setIsCartLoading(false);
      }
    };
    
    loadCart();
  }, []);

  // 将购物车保存到本地存储
  useEffect(() => {
    if (!isCartLoading) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isCartLoading]);

  // 添加商品到购物车
  const addToCart = (item: Omit<CartItem, "quantity">, quantity: number = 1) => {
    setCart((prevCart) => {
      // 检查商品是否已经在购物车中
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => 
          cartItem.id === item.id && 
          (item.variantId ? cartItem.variantId === item.variantId : true)
      );

      if (existingItemIndex !== -1) {
        // 如果商品已存在，更新数量
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity,
        };
        toast.success("已更新购物车");
        return updatedCart;
      } else {
        // 否则添加新商品
        toast.success("已添加到购物车");
        return [...prevCart, { ...item, quantity }];
      }
    });
  };

  // 从购物车中删除商品
  const removeFromCart = (id: string, variantId?: string) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter(
        (item) => !(item.id === id && (!variantId || item.variantId === variantId))
      );
      toast.success("已从购物车移除");
      return updatedCart;
    });
  };

  // 更新购物车中商品的数量
  const updateQuantity = (id: string, quantity: number, variantId?: string) => {
    if (quantity < 1) {
      return removeFromCart(id, variantId);
    }
    
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.id === id && (!variantId || item.variantId === variantId)) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  // 清空购物车
  const clearCart = () => {
    setCart([]);
    toast.success("购物车已清空");
  };

  const value = {
    cart,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartLoading,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
} 