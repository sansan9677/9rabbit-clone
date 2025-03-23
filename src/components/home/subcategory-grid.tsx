import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SubcategoryGridProps {
  title: string;
  categories: {
    name: string;
    count: number;
    link: string;
  }[];
  className?: string;
}

export default function SubcategoryGrid({ title, categories, className }: SubcategoryGridProps) {
  return (
    <section className={cn("py-12 bg-white", className)}>
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            {title}
          </h2>
          <Link
            href={`/collections/${title.toLowerCase().replace(/\s+/g, '-')}`}
            className="text-sm text-[#4ea4ad] hover:text-[#3a8b93] font-medium flex items-center"
          >
            查看全部 <span className="ml-1">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={category.link}
              className="group p-4 border border-gray-200 rounded-lg hover:border-[#4ea4ad] transition-colors duration-200 flex justify-between items-center"
            >
              <div>
                <h3 className="font-medium text-gray-800 group-hover:text-[#4ea4ad] transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {category.count} 产品
                </p>
              </div>
              <div className="text-[#4ea4ad] opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
