import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database';
 
export async function middleware(request: NextRequest) {

   const response = NextResponse.next();
   const supabase = createMiddlewareClient<Database>({ req: request, res: response }, {
      supabaseUrl: "https://mhlqhssqzsezzhgonlxp.supabase.co",
      supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1obHFoc3NxenNlenpoZ29ubHhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTEyNjExNDMsImV4cCI6MjAwNjgzNzE0M30.dqhY9nvZ-vOCsDfXFmg5dJ0tcNUflCaADgGLGy0SNsE",
   });

   const session = await supabase.auth.getSession();

   if (session.error) return NextResponse.redirect(new URL("/", request.url));

   if (request.nextUrl.pathname.startsWith('/user') || request.nextUrl.pathname.startsWith('/info')) {
      if (!session.data.session || session.data.session.expires_in < 1) return NextResponse.redirect(new URL("/", request.url));
   } else {
      if (session.data.session && session.data.session.expires_in > 1) return NextResponse.redirect(new URL("/user", request.url));
   }

   return NextResponse.next();
}

export const config = {
   matcher: ['/', '/login', '/signup/:path*', '/info/:path*', '/user/:path*'],
};