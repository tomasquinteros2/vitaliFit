import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ProductProvider } from "@/context/ProductContext";
import { PromoProvider } from "@/context/PromoContext";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"], variable : "--font-inter" });

export const metadata: Metadata = {
  title: "VitaliFit - Suplementación Deportiva",
  description: "Tienda online de suplementos deportivos de alta calidad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ProductProvider>
          <PromoProvider>
            <AuthProvider>
                <CartProvider>
                  {children}
                </CartProvider>
            </AuthProvider>
          </PromoProvider>
        </ProductProvider>
      </body>
    </html>
  );
}
