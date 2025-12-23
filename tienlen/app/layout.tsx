import type { Metadata } from "next";
import "./globals.scss";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Tien Len Online",
  description: "Play Tien Len card game online with friends!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <nav>
          <Link href="/"><Image src="/logo.png" alt="Tien Len Logo" width={40} height={40} />Tiến Lên Online</Link>
          <Link href="https://github.com/DanHChampion/TienLen"
            target="_blank" rel="noopener noreferrer"
            ><Image src="/github.png" alt="GitHub Logo" width={40} height={40} />
          </Link>
        </nav>
        {children}
        <footer>
          Created by <Link href="https://www.danchampion.dev/">Dan Champion</Link>
        </footer>
      </body>
    </html>
  );
}