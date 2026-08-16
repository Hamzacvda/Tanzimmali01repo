import type { Metadata } from "next";
import { Cairo, Almarai } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["500", "600", "700", "800"],
});

const almarai = Almarai({
  variable: "--font-almarai",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "700", "800"],
});

export const metadata: Metadata = {
  title: "تنظيم مالي",
  description: "منصة تنظيم الميزانية الشخصية",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${almarai.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
