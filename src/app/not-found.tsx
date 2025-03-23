import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/layout/PageLayout';

export default function NotFound() {
  return (
    <PageLayout>
      <div className="container px-4 py-12 md:py-20">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">页面未找到</h2>
          <p className="text-gray-600 mb-8">
            很抱歉，您访问的页面不存在或已被移除。请检查URL是否正确，或返回首页继续浏览。
          </p>
          <Link href="/">
            <Button className="bg-[#4ea4ad] hover:bg-[#3d8b93]">
              返回首页
            </Button>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
} 