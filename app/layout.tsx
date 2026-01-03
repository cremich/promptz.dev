import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SearchProvider } from '@/components/search-provider'
import { SearchModal } from '@/components/search/search-modal'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Promptz - AI Development Resources for Kiro & Amazon Q Developer",
  description: "Discover and share AI development prompts, custom agents, steering documents, and Kiro powers. Community-driven library for AI-assisted development.",
  keywords: ["AI development", "Kiro", "Amazon Q Developer", "prompts", "agents", "steering", "powers", "hooks"],
  authors: [{ name: "Promptz Community" }],
  openGraph: {
    title: "Promptz - AI Development Resources",
    description: "Community-driven library for AI-assisted development with Kiro and Amazon Q Developer.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Promptz - AI Development Resources",
    description: "Community-driven library for AI-assisted development with Kiro and Amazon Q Developer.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <SearchProvider>
          {children}
          <SearchModal />
        </SearchProvider>
      </body>
    </html>
  );
}
