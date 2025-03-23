import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Banner() {
  return (
    <section className="relative w-full">
      {/* Desktop Banner */}
      <div className="hidden sm:block relative w-full aspect-[16/5] overflow-hidden">
        <Image
          src="https://ext.same-assets.com/3058330213/1729553909.webp"
          alt="9Rabbit Banner"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-center">
          <div className="container px-4 mx-auto">
            <div className="max-w-md space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                北美质量情趣用品精选
              </h1>
              <p className="text-white/90 text-lg">
                精心挑选各类优质情趣用品，全面提升你的体验
              </p>
              <Link
                href="/collections/new-products"
                className="inline-block bg-[#4ea4ad] hover:bg-[#3a8b93] text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                立即购买
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Banner */}
      <div className="sm:hidden relative w-full aspect-square overflow-hidden">
        <Image
          src="https://ext.same-assets.com/3058330213/1729553909.webp"
          alt="9Rabbit Banner Mobile"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end">
          <div className="p-4 space-y-3">
            <h1 className="text-2xl font-bold text-white leading-tight">
              北美质量情趣用品精选
            </h1>
            <p className="text-white/90 text-sm">
              精心挑选各类优质情趣用品
            </p>
            <Link
              href="/collections/new-products"
              className="inline-block bg-[#4ea4ad] hover:bg-[#3a8b93] text-white px-5 py-2 rounded-lg font-medium text-sm transition-colors"
            >
              立即购买
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
