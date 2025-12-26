import { Inter } from "next/font/google";
import "./globals.css";
import AIChat from "@/components/AIChat";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Kripto AI Analiz Platformu",
  description: "Yapay zeka destekli günlük kripto piyasa analizleri, teknik göstergeler ve profesyonel yorumlar",
  keywords: "bitcoin, kripto, analiz, yapay zeka, AI, trading, yatırım",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        {children}
        <AIChat />
      </body>
    </html>
  );
}
