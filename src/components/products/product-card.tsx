import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  soldOut: boolean;
  slug: string;
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn("block group", className)}
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-all duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
        />
        {product.soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="bg-black text-white px-3 py-1 text-xs font-medium uppercase">售罄</span>
          </div>
        )}
        {discount >= 5 && (
          <div className="absolute top-2 right-2 bg-[#d44d49] text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </div>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="text-sm md:text-base font-medium text-gray-800 line-clamp-2 leading-tight group-hover:text-[#4ea4ad] transition-colors">
          {product.name}
        </h3>
        <div className="flex flex-wrap items-center">
          <span className="text-sm font-medium text-[#d44d49]">${product.price.toFixed(2)} USD</span>
          {product.originalPrice && (
            <span className="ml-2 text-xs text-gray-500 line-through">${product.originalPrice.toFixed(2)} USD</span>
          )}
        </div>
      </div>
    </Link>
  );
}
