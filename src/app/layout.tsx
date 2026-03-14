import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NorthLend Financial - Investor Portal",
  description: "Secure investor portal for NorthLend Financial private mortgage investments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  );
}
