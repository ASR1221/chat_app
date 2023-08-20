"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Layout({ children }: { children: ReactNode }) {
 
   const path = usePathname();

   return <div className="mt-20">
      <h1 className="w-fit mx-auto text-4xl">Colored Chat</h1>
      <h2 className="w-fit mx-auto my-10 text-3xl">{path === "/signup" ? "Sign Up" : path === "/login" ? "Log in" : path === "/signup/verify" ? "Verify" : "Info" }</h2>
      <div className="w-[65%] mx-auto max-w-md">{children}</div>
      <div className="w-fit mx-auto mt-10">
         {path === "/signup" ?
            <p>Already have an account? <Link href="/login" className="text-blue-700 hover:underline">Log in</Link></p>
            : path === "/login" ? <p>New here? <Link href="/signup" className="text-blue-700 hover:underline">Create an account</Link></p>
            : ""
         }
      </div>
      <Link href=""></Link>
   </div>
}