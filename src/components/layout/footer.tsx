"use client";

import React from "react";
import Link from "next/link";

// Define footer links
const footerLinks = {
  info: [
    { name: "退货政策", href: "/info/refund-policy" },
    { name: "邮寄政策", href: "/info/shipping-policy" },
    { name: "品牌授权", href: "/info/authorization" },
    { name: "隐私保护", href: "/info/privacy" },
    { name: "价格匹配", href: "/info/price-match" },
    { name: "加盟&批发", href: "/info/wholesale" },
    { name: "常见问题", href: "/info/faq" },
    { name: "联系我们", href: "/info/contact" }
  ],
  categories: [
    { name: "女生玩具", href: "/collections/vibrators" },
    { name: "男生玩具", href: "/collections/masturbator" },
    { name: "情趣内衣", href: "/collections/lingerie" },
    { name: "情趣S.M.", href: "/collections/sm" },
    { name: "安全套套", href: "/collections/condom" },
    { name: "实体娃娃", href: "/collections/sex-dolls" },
    { name: "情趣辅助", href: "/collections/lubricant" },
    { name: "清仓促销", href: "/collections/clearance" }
  ]
};

export default function Footer() {
  return (
    <footer className="bg-[#1d2424] text-gray-300 pt-10 pb-10">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info Section */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-medium mb-4">联系客服</h3>
            <div className="space-y-2">
              <p className="flex flex-wrap items-center">
                <span className="font-medium mr-2">客服微信：</span>
                <span>NineRabbit_Kefu</span>
              </p>
              <p className="flex flex-wrap items-center">
                <span className="font-medium mr-2">客服邮箱：</span>
                <span>info@fidelitech.ca</span>
              </p>
              <p className="flex flex-wrap items-center">
                <span className="font-medium mr-2">合作联系：</span>
                <span>admin@fidelitech.ca</span>
              </p>
            </div>
          </div>

          {/* Menu Links Section */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-medium mb-4">菜单链接</h3>
            <div className="grid grid-cols-2 gap-2">
              {footerLinks.info.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Product Categories Section */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-medium mb-4">产品类别</h3>
            <div className="grid grid-cols-2 gap-2">
              {footerLinks.categories.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
