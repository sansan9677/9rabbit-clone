import React from "react";
import Link from "next/link";
import Image from "next/image";

// Sample main categories with images
const mainCategories = [
  {
    name: "女生玩具",
    image: "https://ext.same-assets.com/3058330213/1729553909.webp",
    link: "/collections/vibrators",
  },
  {
    name: "男生玩具",
    image: "https://ext.same-assets.com/3058330213/1729553909.webp",
    link: "/collections/masturbator",
  },
  {
    name: "情趣内衣",
    image: "https://ext.same-assets.com/3058330213/1729553909.webp",
    link: "/collections/lingerie",
  },
  {
    name: "情趣S.M.",
    image: "https://ext.same-assets.com/3058330213/1729553909.webp",
    link: "/collections/sm",
  },
  {
    name: "安全套套",
    image: "https://ext.same-assets.com/3058330213/1729553909.webp",
    link: "/collections/condom",
  },
  {
    name: "情趣辅助",
    image: "https://ext.same-assets.com/3058330213/1729553909.webp",
    link: "/collections/lubricant",
  },
];

export default function CategoryGrid() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container px-4 mx-auto">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-10">
          热门分类
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-5">
          {mainCategories.map((category, index) => (
            <Link
              key={index}
              href={category.link}
              className="relative group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="aspect-square relative">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 40vw, (max-width: 768px) 33vw, 150px"
                  priority={index < 3}
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="text-sm sm:text-base font-medium text-gray-800">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
