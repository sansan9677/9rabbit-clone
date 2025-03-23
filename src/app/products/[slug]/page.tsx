"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Heart, ShoppingCart, Truck, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageLayout from "@/components/layout/PageLayout";
import { useCart } from "@/lib/CartContext";
import { formatPrice } from "@/lib/utils";

// 模拟的产品数据，实际应用中应从API获取
const products = [
  {
    id: "1",
    slug: "polly-plus-second-gen",
    name: "KISTOY Polly Plus二代秒爱吮吸神器",
    price: 86.99,
    originalPrice: 129.99,
    description: "Polly Plus 二代是一款高端吮吸器，升级了强劲的吮吸马达和更舒适的人体工学设计。紧贴女性身体曲线，提供10种不同模式的吮吸和振动模式，可实现多重高潮体验。USB充电，防水设计，便于清洁。",
    rating: 4.8,
    reviewCount: 245,
    stock: 15,
    images: [
      "https://ext.same-assets.com/3058330213/2058260766.jpeg",
      "https://ext.same-assets.com/3058330213/2058260766.jpeg",
      "https://ext.same-assets.com/3058330213/2058260766.jpeg",
    ],
    specifications: [
      { name: "材质", value: "医用级别硅胶" },
      { name: "防水等级", value: "IPX7" },
      { name: "充电时间", value: "2小时" },
      { name: "使用时间", value: "1-2小时" },
      { name: "噪音", value: "<50dB" },
    ],
    variants: [
      { id: "1-pink", name: "樱花粉", price: 86.99, image: "https://ext.same-assets.com/3058330213/2058260766.jpeg", stock: 15 },
      { id: "1-purple", name: "浪漫紫", price: 86.99, image: "https://ext.same-assets.com/3058330213/2058260766.jpeg", stock: 10 },
    ],
  },
  {
    id: "2",
    slug: "netease-black-hole",
    name: "网易春风黑洞Plus全自动APP操控飞机杯-北美独家首发",
    price: 187.00,
    originalPrice: 249.99,
    description: "网易春风黑洞Plus是一款全自动飞机杯，配备智能APP控制，实现远程互动。配备10种不同的模式，模拟不同场景。内置加热功能，提供更真实的体验。采用医用级硅胶，触感舒适逼真。",
    rating: 4.9,
    reviewCount: 128,
    stock: 8,
    images: [
      "https://ext.same-assets.com/3058330213/3156523865.jpeg",
      "https://ext.same-assets.com/3058330213/3156523865.jpeg",
      "https://ext.same-assets.com/3058330213/3156523865.jpeg",
    ],
    specifications: [
      { name: "材质", value: "医用级别硅胶" },
      { name: "防水等级", value: "IPX6" },
      { name: "充电时间", value: "3小时" },
      { name: "使用时间", value: "1-2小时" },
      { name: "噪音", value: "<45dB" },
    ],
    variants: [],
  },
];

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const product = products.find(p => p.slug === slug);
  const { addToCart } = useCart();
  
  const [mainImage, setMainImage] = useState(product?.images[0] || "");
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  
  // 如果找不到产品，返回404
  if (!product) {
    notFound();
  }
  
  // 获取实际的价格
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentOriginalPrice = product.originalPrice;
  
  // 处理添加到购物车
  const handleAddToCart = () => {
    const itemToAdd = {
      id: product.id,
      name: product.name,
      price: currentPrice,
      originalPrice: currentOriginalPrice,
      image: mainImage || product.images[0],
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
    };
    
    addToCart(itemToAdd, quantity);
  };
  
  return (
    <PageLayout>
      <div className="container px-4 py-6 md:py-8">
        {/* 面包屑导航 */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-[#4ea4ad]">首页</Link>
          <ChevronRight size={16} className="mx-1" />
          <Link href="/collections/vibrators" className="hover:text-[#4ea4ad]">女生玩具</Link>
          <ChevronRight size={16} className="mx-1" />
          <span className="text-gray-700 line-clamp-1">{product.name}</span>
        </div>
        
        <div className="md:grid md:grid-cols-2 md:gap-8 lg:gap-12">
          {/* 产品图片 */}
          <div className="mb-6 md:mb-0">
            <div className="aspect-square relative rounded-lg overflow-hidden mb-4 border border-gray-100">
              <Image
                src={mainImage || product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  className="aspect-square relative rounded-md overflow-hidden border border-gray-200 hover:border-[#4ea4ad] focus:outline-none focus:ring-2 focus:ring-[#4ea4ad] focus:ring-opacity-50"
                  onClick={() => setMainImage(img)}
                >
                  <Image
                    src={img}
                    alt={`${product.name} - 图片 ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 12vw"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* 产品信息 */}
          <div>
            <h1 className="text-xl md:text-2xl font-medium mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {Array(5).fill(0).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600">{product.rating} ({product.reviewCount} 评价)</span>
            </div>
            
            {/* 价格 */}
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl md:text-2xl font-semibold">{formatPrice(currentPrice)}</span>
                {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                  <span className="text-gray-500 line-through">{formatPrice(currentOriginalPrice)}</span>
                )}
              </div>
              {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                <div className="text-sm text-green-600 mt-1">
                  节省 {formatPrice(currentOriginalPrice - currentPrice)} ({Math.round((1 - currentPrice / currentOriginalPrice) * 100)}% 优惠)
                </div>
              )}
            </div>
            
            {/* 库存状态 */}
            <div className="mb-6 text-sm flex items-center">
              {(selectedVariant ? selectedVariant.stock : product.stock) > 0 ? (
                <>
                  <Check size={16} className="text-green-600 mr-1" />
                  <span className="text-green-600">
                    {(selectedVariant ? selectedVariant.stock : product.stock) > 10 
                      ? "有货" 
                      : `仅剩 ${selectedVariant ? selectedVariant.stock : product.stock} 件`}
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle size={16} className="text-red-500 mr-1" />
                  <span className="text-red-500">缺货</span>
                </>
              )}
            </div>
            
            {/* 变体选择 */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">颜色</label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => {
                        setSelectedVariant(variant);
                        setMainImage(variant.image);
                      }}
                      className={`py-1 px-3 rounded-full border ${
                        selectedVariant?.id === variant.id
                          ? "border-[#4ea4ad] bg-[#4ea4ad] text-white"
                          : "border-gray-300 hover:border-[#4ea4ad]"
                      }`}
                      disabled={variant.stock <= 0}
                    >
                      {variant.name}
                      {variant.stock <= 0 && " (缺货)"}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* 数量选择和添加到购物车 */}
            <div className="flex items-start md:items-center flex-col md:flex-row gap-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  aria-label="减少数量"
                >
                  -
                </button>
                <span className="w-10 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  aria-label="增加数量"
                >
                  +
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-2 w-full md:flex-1">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 justify-center"
                  aria-label="添加到收藏"
                >
                  <Heart size={18} />
                  <span className="hidden md:inline">收藏</span>
                </Button>
                
                <Button
                  onClick={handleAddToCart}
                  className="flex items-center gap-2 justify-center bg-[#4ea4ad] hover:bg-[#3d8b93]"
                  disabled={(selectedVariant ? selectedVariant.stock : product.stock) <= 0}
                  aria-label="添加到购物车"
                >
                  <ShoppingCart size={18} />
                  <span>加入购物车</span>
                </Button>
              </div>
            </div>
            
            {/* 配送信息 */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex items-start gap-2 mb-2">
                <Truck size={18} className="text-[#4ea4ad] mt-0.5" />
                <div>
                  <p className="font-medium">快速配送</p>
                  <p className="text-sm text-gray-600">北美大陆1-3个工作日送达</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check size={18} className="text-[#4ea4ad] mt-0.5" />
                <div>
                  <p className="font-medium">私密包装</p>
                  <p className="text-sm text-gray-600">普通快递包装，没有敏感信息</p>
                </div>
              </div>
            </div>
            
            {/* 产品详情标签 */}
            <Tabs defaultValue="description" className="mt-8">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="description">产品详情</TabsTrigger>
                <TabsTrigger value="specifications">规格参数</TabsTrigger>
                <TabsTrigger value="shipping">配送与退换</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="text-gray-700">
                <p className="mb-4">{product.description}</p>
              </TabsContent>
              
              <TabsContent value="specifications">
                <ul className="space-y-2">
                  {product.specifications.map((spec, index) => (
                    <li key={index} className="flex border-b border-gray-100 pb-2">
                      <span className="font-medium min-w-[120px]">{spec.name}</span>
                      <span>{spec.value}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>
              
              <TabsContent value="shipping" className="text-gray-700">
                <h3 className="font-medium mb-2">配送政策</h3>
                <p className="mb-4">我们提供北美全境配送服务。订单确认后1个工作日内发货，通常1-3个工作日送达。所有商品均采用私密包装，包装上不会显示任何敏感信息。</p>
                
                <h3 className="font-medium mb-2">退换政策</h3>
                <p>出于卫生原因，本商品不支持非质量问题的退换。如收到商品有质量问题，请在收到商品后7天内联系客服处理。</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
