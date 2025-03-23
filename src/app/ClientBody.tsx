"use client";

import React from 'react';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/lib/AuthContext';
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/lib/CartContext";

interface ClientBodyProps {
  children: React.ReactNode;
}

export default function ClientBody({ children }: ClientBodyProps) {
  // Remove any bottom navigation bars that might be injected
  useEffect(() => {
    // Remove any bottom navigation bars that might be injected
    const removeBottomNavs = () => {
      // Look for elements with fixed bottom positioning
      const bottomNavs = document.querySelectorAll('div[style*="bottom: 0"][style*="position: fixed"], nav[style*="bottom: 0"][style*="position: fixed"], div.bottom-navigation, div.mobile-nav, div.fixed-bottom');

      if (bottomNavs.length > 0) {
        bottomNavs.forEach(nav => {
          nav.remove();
        });
      }
    };

    // Run immediately
    removeBottomNavs();

    // Also set up an observer to remove any dynamically added elements
    const observer = new MutationObserver((mutations) => {
      removeBottomNavs();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <AuthProvider>
        <CartProvider>
          {children}
          <Toaster position="top-center" />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
