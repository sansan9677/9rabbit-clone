"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import ProductCard from "@/components/products/product-card";

// Sample product data across categories
const productsByCategory = {
  "vibrators": [
    {
      id: "1",
      name: "KISTOY Polly Plus二代秒爱吮吸神器",
      price: 86.00,
      originalPrice: 125.00,
      image: "https://ext.same-assets.com/3058330213/2058260766.jpeg",
      slug: "polly-plus-second-gen",
      soldOut: true,
    },
    {
      id: "2",
      name: "小怪兽魔吻抑菌版HPV吮吸APP远程控制跳蛋-白夜魔版",
      price: 117.00,
      originalPrice: 156.00,
      image: "https://ext.same-assets.com/3058330213/1763494887.jpeg",
      slug: "monster-app-controlled",
      soldOut: false,
    },
    {
      id: "3",
      name: "小怪兽魔炮抑菌版HPV智能APP远程遥控振动棒-白夜魔版",
      price: 125.00,
      originalPrice: 156.00,
      image: "https://ext.same-assets.com/3058330213/2926568838.jpeg",
      slug: "monster-vibrator-app-controlled",
      soldOut: false,
    },
    {
      id: "4",
      name: "小怪兽抑菌版HPV掌控蛋少女掌机跳蛋-白夜魔版",
      price: 62.00,
      originalPrice: 78.00,
      image: "https://ext.same-assets.com/3058330213/1001198126.jpeg",
      slug: "monster-egg-vibrator",
      soldOut: false,
    },
  ],
  "masturbator": [
    {
      id: "5",
      name: "网易春风TryFun元力2代智能旋转伸缩元宇宙飞机杯-5款内胆可选",
      price: 312.00,
      originalPrice: 312.00,
      image: "https://ext.same-assets.com/3058330213/3140610377.jpeg",
      slug: "tryfun-2nd-gen",
      soldOut: true,
    },
    {
      id: "6",
      name: "网易春风黑洞Plus全自动APP操控飞机杯-北美独家首发",
      price: 187.00,
      originalPrice: 312.00,
      image: "https://ext.same-assets.com/3058330213/3156523865.jpeg",
      slug: "netease-black-hole",
      soldOut: false,
    },
    {
      id: "7",
      name: "对子哈特Toysheart R20飞机杯",
      price: 70.00,
      originalPrice: 101.00,
      image: "https://ext.same-assets.com/3058330213/3696521518.jpeg",
      slug: "toysheart-r20",
      soldOut: false,
    },
    {
      id: "8",
      name: "谜姬-桥本有菜の印象东京-名器倒膜电动飞机杯-三代升级版",
      price: 101.00,
      originalPrice: 133.00,
      image: "https://ext.same-assets.com/3058330213/3113618536.jpeg",
      slug: "mizuki-tokyo",
      soldOut: false,
    },
  ],
  "clothes": [
    {
      id: "9",
      name: "情趣内衣 - 猫女",
      price: 29.00,
      originalPrice: 39.00,
      image: "https://ext.same-assets.com/3058330213/936518610.jpeg",
      slug: "lingerie-cat",
      soldOut: false,
    },
    {
      id: "10",
      name: "情趣内衣 - 旗袍",
      price: 45.00,
      originalPrice: 59.00,
      image: "https://ext.same-assets.com/3058330213/132765296.jpeg",
      slug: "lingerie-qipao",
      soldOut: true,
    },
  ],
  // Default for other categories
  "default": [
    {
      id: "11",
      name: "9Rabbit产品",
      price: 99.00,
      originalPrice: 129.00,
      image: "https://ext.same-assets.com/3058330213/3300747421.png",
      slug: "9rabbit-product",
      soldOut: false,
    },
  ]
};

const categoryTitles: Record<string, string> = {
  "vibrators": "情趣玩具 - 情趣用品",
  "masturbator": "飞机杯 - 男生玩具",
  "clothes": "情趣服饰",
  "accessories": "情趣S.M.",
  "condom": "安全套套",
  "lubricant": "情趣辅助",
  "sex-dolls": "实体娃娃",
  "clearance": "清仓促销",
  "new-products": "新品爆款",
};

export default function CategoryPage() {
  const params = useParams();
  const category = params?.category as string || "default";
  const products = productsByCategory[category as keyof typeof productsByCategory] || productsByCategory.default;
  const title = categoryTitles[category] || category;

  return (
    <PageLayout>
      <div className="container px-4 py-6 md:py-8">
        <h1 className="text-xl md:text-2xl font-medium text-center mb-2">{title}</h1>

        <p className="text-sm md:text-base text-gray-600 text-center mb-6 max-w-2xl mx-auto">
          9Rabbit提供多种高品质情趣玩具，震动按摩棒，自慰按摩棒，舌舔吮吸器，潮喷仪，让女生勇敢地表达自己的欲望，也让男生帮助另一半获得前所未有的高潮。
        </p>

        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
