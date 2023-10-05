import './globals.css';
import type { Metadata } from 'next';
import { Oregano, Laila } from 'next/font/google';

const oregano = Oregano({
  subsets: ['latin'],
  weight: "400",
  variable: "--font-header",
  preload: true,
});

const laila = Laila({
  subsets: ['latin'],
  weight: ["400", "600"],
  variable: "--font-body",
  preload: true,
});

export const metadata: Metadata = {
  title: 'Chatty',
  description: 'Chat with whoever you want is fast, secure and fun with chatty',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en" className={`${oregano.variable} ${laila.variable}`}>
      <body className='overflow-x-hidden no-scrollbar'>
        {children}
      </body>
    </html>
  )
}
