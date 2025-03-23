import type { Metadata, Viewport } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jost",
});

export const metadata: Metadata = {
  title: "9Rabbit - 北美情趣用品",
  description: "9Rabbit专注于打造北美华人成人情趣用品精选, 我们会从各方研究, 考核, 挑选和提供各类型高品质成人用品, 情趣用品, 震动棒, 飞机杯, 情趣内衣, 安全套, 情趣辅助用品等等.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#4ea4ad"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" className={jost.variable}>
      <head>
        <Script id="remove-bottom-nav" strategy="beforeInteractive">
          {`
            // This script runs early to prevent any bottom navigation from showing
            (function() {
              // Function to remove bottom navigation
              function removeBottomNav() {
                var elements = document.querySelectorAll('div[style*="bottom: 0"][style*="position: fixed"], nav[style*="bottom: 0"][style*="position: fixed"], div.bottom-navigation, div.mobile-nav, div.fixed-bottom');
                elements.forEach(function(el) {
                  if (el && el.parentNode) {
                    el.parentNode.removeChild(el);
                  }
                });
              }

              // Run immediately
              removeBottomNav();

              // Create an observer to watch for dynamically added elements
              var observer = new MutationObserver(function() {
                removeBottomNav();
              });

              // Start observing when the DOM is ready
              document.addEventListener('DOMContentLoaded', function() {
                observer.observe(document.body, { childList: true, subtree: true });
                removeBottomNav();
              });

              // Also run periodically
              setInterval(removeBottomNav, 1000);
            })();
          `}
        </Script>
      </head>
      <body className="antialiased">
        <ClientBody>
          {children}
        </ClientBody>
      </body>
    </html>
  );
}
