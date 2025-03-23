import React from "react";
import ProductCard from "@/components/products/product-card";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FeaturedProductsProps {
  title: string;
  className?: string;
}

// Sample featured products data
const featuredProducts = [
  {
    id: "1",
    name: "情趣按摩棒多功能",
    image: "https://ext.same-assets.com/3058330213/1729553909.webp",
    price: 49.99,
    originalPrice: 79.99,
    soldOut: false,
    slug: "vibrator-1",
  },
  {
    id: "2",
    name: "情趣内衣高腰式",
    image: "https://ext.same-assets.com/3058330213/1729553909.webp",
    price: 29.99,
    originalPrice: 39.99,
    soldOut: false,
    slug: "lingerie-1",
  },
  {
    id: "3",
    name: "男士飞机杯自动",
    image: "https://ext.same-assets.com/3058330213/1729553909.webp",
    price: 59.99,
    originalPrice: 89.99,
    soldOut: true,
    slug: "masturbator-1",
  },
  {
    id: "4",
    name: "秒潮神器震动按摩器",
    image: "https://ext.same-assets.com/3058330213/1729553909.webp",
    price: 39.99,
    originalPrice: 49.99,
    soldOut: false,
    slug: "vibrator-2",
  },
];

export default function FeaturedProducts({ title, className }: FeaturedProductsProps) {
  return (
    <section className={cn("py-12", className)}>
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            {title}
          </h2>
          <Link
            href={`/collections/${title === "女生玩具" ? "vibrators" : "masturbator"}`}
            className="text-sm text-[#4ea4ad] hover:text-[#3a8b93] font-medium flex items-center"
          >
            查看全部 <span className="ml-1">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
