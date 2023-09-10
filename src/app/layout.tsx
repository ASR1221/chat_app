import './globals.css'
import type { Metadata } from 'next'
import { Oregano, Laila } from 'next/font/google';

// import AuthProvider from "../providers/supabaseProvider"; //! check if needed later

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${oregano.variable} ${laila.variable}`}>
      <body>
        {/* <AuthProvider> */}
          {children}
        {/* </AuthProvider> */}
      </body>
    </html>
  )
}
