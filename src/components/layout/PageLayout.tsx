"use client";

import React from "react";
import Header from "./header";
import MobileNavBar from "./MobileNavBar";

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pb-20 md:pb-0">
        {children}
      </main>
      <MobileNavBar />
    </div>
  );
}
