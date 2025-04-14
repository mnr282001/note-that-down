import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Note That Down",
  description: "Capture your thoughts, organize your ideas",
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    title: 'Note That Down',
    description: 'Elevate your standups. Capture your progress. Organize your workflow.',
    images: ['/logo.png'],
    url: 'https://note-that-down.com/coming-soon',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
