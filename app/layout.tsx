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
  title: "Spotify Album Art Downloader",
  description: "Search and download high-quality album artwork from Spotify",
  icons: {
    icon: [
      {
        url: '/streaming.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/streaming.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
    shortcut: '/streaming.png',
    apple: {
      url: '/streaming.png',
      sizes: '180x180',
      type: 'image/png',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/streaming.png" type="image/png" />
        <link rel="shortcut icon" href="/streaming.png" type="image/png" />
        <link rel="apple-touch-icon" href="/streaming.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
