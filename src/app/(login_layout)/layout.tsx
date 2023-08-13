"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Layout({ children }: { children: ReactNode }) {
 
   const path = usePathname();

   return <div>
      <h1>Colored Chat</h1>
      <h2>{path === "/signup" ? "Sign Up" : "Log In"}</h2>
      {children}
      <div>
         {path === "/signup" ?
            <p>Already have an account? <Link href="/login">Log in</Link></p>
            : <p>New here? <Link href="/signup">Create an account</Link></p>
         }
      </div>
      <Link href=""></Link>
   </div>
}