import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MyProvider from "@/contextAPI/myProvider";
import { ToastContainer } from "react-toastify";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My calendar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <MyProvider >
        <ToastContainer />
        <body className={inter.className}>{children}</body>
      </MyProvider>
    </html>
  );
}
