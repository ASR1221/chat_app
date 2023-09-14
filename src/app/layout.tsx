"use client";

import './globals.css';
import type { Metadata } from 'next';
import { Oregano, Laila } from 'next/font/google';

import { useEffect } from 'react';

const oregano = Oregano({
  subsets: ['latin'],
  weight: "400",
  variable: "--font-header",
});

const laila = Laila({
  subsets: ['latin'],
  weight: ["400", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: 'Chatty',
  description: 'Chat with anyone with fun and security',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  
  useEffect(() => {
    let theme: "light" | "dark" = "light";

    if (localStorage && localStorage.getItem("theme")) {
      theme = localStorage.getItem("theme") as "light" | "dark";
    } else if (!window.matchMedia) {
      theme = "light";
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches){
      theme = "dark";
    }

    document.documentElement.setAttribute("data-theme", theme);

    function setTheme(isDark: boolean) {
      if (!(localStorage && localStorage.getItem("theme")))
        document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    }

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => setTheme(e.matches));

    return () => window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", e => setTheme(e.matches));

  }, []);

  return (
    <html lang="en" className={`${oregano.variable} ${laila.variable}`}>
      <body className='overflow-x-hidden'>
        {children}
      </body>
    </html>
  )
}
