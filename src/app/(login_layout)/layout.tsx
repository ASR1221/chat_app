"use client";

import { useEffect , type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import Logo from "@/svgs/logo";
import useTheme from "@/hooks/useTheme";

export default function Layout({ children }: { children: ReactNode }) {
 
   const path = usePathname();
   const { isDark } = useTheme();

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

   return <div className={path === "/signup/verify" ? "mt-10" : "mt-20"}>
      <div className="w-fit mx-auto">
         {
            path === "/signup/verify" ? <img src="/images/illustrations/Key-rafiki.svg" alt="Key image" width={300}/>
            : <Logo isDark={isDark} width={120} />
         }
      </div>
      <h2 className="w-fit mx-auto my-10 text-4xl">{path === "/signup" ? "Sign Up" : path === "/login" ? "Log in" : "" }</h2>
      <div className="w-[65%] mx-auto max-w-md">{children}</div>
      <div className="w-fit mx-auto mt-10">
         {path === "/signup" ?
            <p>Already have an account? <Link href="/login" className="text-blue-500 hover:underline">Log in</Link></p>
            : path === "/login" ? <p>New here? <Link href="/signup" className="text-blue-500 hover:underline">Create an account</Link></p>
            : ""
         }
      </div>
   </div>
}