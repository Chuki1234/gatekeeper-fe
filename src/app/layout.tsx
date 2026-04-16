import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Navigation } from "@/components/shared/navigation";
import { Footer } from "@/components/shared/footer";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gatekeeper — Virus & URL Scanner",
  description:
    "Scan files and URLs for viruses, malware, and threats. Fast, private, and powered by multiple security engines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream text-charcoal pt-16">
        <Navigation />
        <main className="max-w-6xl mx-auto w-full flex-1 px-6 pb-24">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
