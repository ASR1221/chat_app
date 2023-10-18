"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useRealtime } from "@/providers/realtimeProvider";
import useTheme from "@/hooks/useTheme";

import OptionsModal from "@/components/optionsModal/optionsModal";
import SearchIcon from "@/svgs/searchIcon";
import OptionsIcon from "@/components/optionsIcon/optionsIcon";
import ConvoListItem from "@/components/convoListItem/convoListItem";
import EmptyList from "@/components/emptyList/emptyList";

export default function UserLayout({ children }: { children: ReactNode }) {

   const { userId, convos } = useRealtime();

   const { isDark } = useTheme();

   const pathname = usePathname();
   const router = useRouter();

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


   return <>
      
      <nav className="fixed grid grid-cols-[1fr_8fr_1fr] gap-5 items-center justify-between p-4 bg-convo-header-bg-color text-convo-header-text-color px-4 w-[100%] md:w-[370px]">
         <OptionsIcon clickFunc={() => router.push(`${pathname}?options=true`)}/>
         <h2 className="text-4xl text-convo-header-text-color">Chatty</h2>
         <Link href="/user/search"><SearchIcon isDark={isDark} width={25} /></Link>
      </nav>
      <OptionsModal />
      
      <div className="px-4 w-[100%] md:w-[370px] fixed mt-20">
         <section className="[&>*:not(:last-child)]:border-b-[1px] [&>*]:border-devider-line-color">
            {
               !convos.length ? <EmptyList text="No Conversation yet. Create a conversation and it will be seen here." />
               : convos.map(convo =>
                  <ConvoListItem
                     key={convo.id}
                     convo={convo}
                     userId={userId}
                  />
               )
            }
         </section>
      </div>
      <Link
         href="/user/conversation/add/members"
         className="w-12 pt-1 grid justify-center items-center aspect-square rounded-sm fixed bottom-4 right-4 md:right-[calc(100vw-370px+1rem)] bg-convo-header-bg-color text-convo-header-text-color text-2xl font-bold shadow-basic hover:bg-btn-color transition-all duration-300"
      >+</Link>

      <div className="w-[1px] bg-devider-line-color left-[370px] top-0 bottom-0 z-[100] md:fixed" />
      <div
         className={`w-[100vw] z-10 absolute ${pathname === "/user" ? "left-[100vw]" : "left-[0] top-0 bottom-0"} transition-all md:w-[calc(100vw-370px)] md:left-[370px]`}
      >{children}</div>
   </>;
}