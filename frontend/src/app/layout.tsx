import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Birthday Wheel App",
  description: "Birthday Wheel App to celebrate birthdays in a fun way!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-violet-600 via-pink-500 to-orange-400 flex items-center justify-center`}>
        {children}
      </body>
    </html>
  );
}
