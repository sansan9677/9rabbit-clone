"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PageLayout from "@/components/layout/PageLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import ProductCard from "@/components/products/product-card";

// Sample data for popular searches
const popularSearches = [
  "秒潮", "飞机杯", "震动", "跳蛋", "内衣", "丝袜", "冈本", "润滑液"
];

// Sample product data across categories for search results
const allProducts = [
  {
    id: "1",
    name: "KISTOY Polly Plus二代秒爱吮吸神器",
    price: 86.00,
    originalPrice: 125.00,
    image: "https://ext.same-assets.com/3058330213/2058260766.jpeg",
    slug: "polly-plus-second-gen",
    soldOut: true,
    category: "vibrators",
  },
  {
    id: "2",
    name: "小怪兽魔吻抑菌版HPV吮吸APP远程控制跳蛋-白夜魔版",
    price: 117.00,
    originalPrice: 156.00,
    image: "https://ext.same-assets.com/3058330213/1763494887.jpeg",
    slug: "monster-app-controlled",
    soldOut: false,
    category: "vibrators",
  },
  {
    id: "5",
    name: "网易春风TryFun元力2代智能旋转伸缩元宇宙飞机杯-5款内胆可选",
    price: 312.00,
    originalPrice: 312.00,
    image: "https://ext.same-assets.com/3058330213/3140610377.jpeg",
    slug: "tryfun-2nd-gen",
    soldOut: true,
    category: "masturbator",
  },
  {
    id: "6",
    name: "网易春风黑洞Plus全自动APP操控飞机杯-北美独家首发",
    price: 187.00,
    originalPrice: 312.00,
    image: "https://ext.same-assets.com/3058330213/3156523865.jpeg",
    slug: "netease-black-hole",
    soldOut: false,
    category: "masturbator",
  },
  {
    id: "9",
    name: "情趣内衣 - 猫女",
    price: 29.00,
    originalPrice: 39.00,
    image: "https://ext.same-assets.com/3058330213/936518610.jpeg",
    slug: "lingerie-cat",
    soldOut: false,
    category: "clothes",
  },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [searchResults, setSearchResults] = useState<typeof allProducts>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Simulating the search functionality
  useEffect(() => {
    if (queryParam) {
      // In a real app, this would be an API call to search products
      const results = allProducts.filter(product =>
        product.name.toLowerCase().includes(queryParam.toLowerCase())
      );
      setSearchResults(results);

      // Save to recent searches
      if (queryParam.trim() !== "") {
        setRecentSearches(prev => {
          const newSearches = [queryParam, ...prev.filter(s => s !== queryParam)].slice(0, 5);
          return newSearches;
        });
      }
    } else {
      setSearchResults([]);
    }
  }, [queryParam]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (searchQuery.trim() !== "") {
      // Using window.location to update the URL with the search query
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handlePopularSearch = (term: string) => {
    setSearchQuery(term);
    window.location.href = `/search?q=${encodeURIComponent(term)}`;
  };

  return (
    <div className="container px-4 py-6">
      <h1 className="text-2xl font-medium mb-6 text-center">搜索</h1>

      {/* Search bar */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="relative">
          <Input
            type="text"
            placeholder="搜索产品..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-12"
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-0 top-0 h-full rounded-l-none bg-[#4ea4ad] hover:bg-[#3d8b93]"
          >
            <SearchIcon size={18} className="text-white" />
          </Button>
        </form>
      </div>

      {queryParam ? (
        // Search results
        <div>
          <h2 className="text-lg font-medium mb-4">搜索结果: "{queryParam}"</h2>

          {searchResults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">没有找到与 "{queryParam}" 相关的产品。</p>
              <p className="text-sm">尝试使用不同的关键词搜索，或浏览我们的产品类别。</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5">
              {searchResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      ) : (
        // Search suggestions
        <div>
          {/* Recent searches */}
          {recentSearches.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-3">最近搜索</h2>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-8 rounded-full text-sm"
                    onClick={() => handlePopularSearch(term)}
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Popular searches */}
          <div>
            <h2 className="text-lg font-medium mb-3">热门搜索</h2>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-8 rounded-full text-sm"
                  onClick={() => handlePopularSearch(term)}
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <PageLayout>
      <Suspense fallback={
        <div className="container px-4 py-6">
          <h1 className="text-2xl font-medium mb-6 text-center">搜索</h1>
          <div className="text-center py-8">Loading...</div>
        </div>
      }>
        <SearchContent />
      </Suspense>
    </PageLayout>
  );
}
