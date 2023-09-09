import './globals.css'
import type { Metadata } from 'next'

// import AuthProvider from "../providers/supabaseProvider"; //! check if needed later


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
    <html lang="en">
      <body>
        {/* <AuthProvider> */}
          {children}
        {/* </AuthProvider> */}
      </body>
    </html>
  )
}
