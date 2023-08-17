"use client";

import Link from "next/link";
import { useParams } from "next/navigation"
import { ReactNode } from "react";

// contain user conversations
export default function UserLayout({ children }: { children: ReactNode}) {

   const userId = useParams().id;      

   return <div>
      <h1>
         <Link href="">nav</Link>
         <p role="heading" aria-level={2}>App name</p>
         <Link href=""></Link>
      </h1>
      <>{children}</>
   </div>
}