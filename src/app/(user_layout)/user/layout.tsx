"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { type ReactNode, type KeyboardEvent, useState, useEffect } from "react";

import { useRealtime } from "@/providers/realtimeProvider";
import OptionsModal from "@/components/optionsModal/optionsModal";
import ConversationsComp from "@/components/conversation/conversationsComp";
import SearchIcon from "@/svgs/searchIcon";
import useTheme from "@/hooks/useTheme";

// TODO: make create convos with accept multiple users
// TODO: check if realtime needed for 'conversations'
// TODO: check how to show online status of a user

export default function UserLayout({ children }: { children: ReactNode }) {

   const { userId, convos } = useRealtime();

   const { isDark } = useTheme();

   const pathname = usePathname();
   const router = useRouter();
   // const params = useParams();

   // handle search submit
   // function handleSearch(e: KeyboardEvent<HTMLInputElement>) {
   //    if (e.key === "Enter") router.push(`/user/search?term=${e.currentTarget.value}`)
   // }


   return <>
      
      <nav className="grid grid-cols-[1fr_8fr_1fr] gap-5 items-center justify-between p-3 bg-convo-header-bg-color text-convo-header-text-color md:w-[370px]">
         <button onClick={() => router.push("/user?options=true")} className="grid grid-cols-1 gap-2 justify-center items-center p-1 min-w-[40px] max-w-[45px]">
            <div className="h-[2px] rounded-[2px] bg-convo-header-text-color"></div>
            <div className="h-[2px] rounded-[2px] bg-convo-header-text-color"></div>
            <div className="h-[2px] rounded-[2px] bg-convo-header-text-color"></div>
         </button>
         <h2 className="text-3xl text-convo-header-text-color">Chatty</h2>
         <Link href="/user/search"><SearchIcon isDark={isDark} width={25} /></Link>
      </nav>
      <OptionsModal />
      <div className="px-4 md:w-[370px]">
         <ConversationsComp conversations={convos} userId={userId} />
      </div>
      <Link
         href="/user/conversation/add"
         className="w-12 pt-1 grid justify-center items-center aspect-square rounded-sm absolute bottom-4 right-4 md:right-[calc(100vw-370px+1rem)] bg-convo-header-bg-color text-convo-header-text-color text-2xl font-bold shadow-basic hover:bg-btn-color transition-all duration-300"
      >+</Link>

      <div
         className={`w-[100vw] z-10 bg-bg-color absolute top-0 bottom-0 ${pathname === "/user" ? "left-[100vw]" : "left-[0]"} transition-all md:w-[calc(100vw-370px)] md:left-[370px] md:border-l-[1px] md:border-devider-line-color`}
      >{children}</div>
   </>
}

/* 
: pathname === "/user/search" ? <>
   <button onClick={() => router.back()}>Back</button>
   <input type="search" name="search" onKeyDown={handleSearch} className="border-2 border-black" placeholder="search..."/>
</>
: pathname.includes("/user/conversation/") ? <>
   <button onClick={() => pathname === `/user/conversation/${params.conversationId}/info` ? router.back() : router.push("/user")}>Back</button>
   {pathname !== "/user/conversation/add" && <p>{convos && convos.find(conv => conv.id === params.conversationId)?.name}</p>}
   {pathname !== "/user/conversation/add" && !pathname.includes("/info")
      ? <Link href={`/user/conversation/${params.conversationId}/info`}>Info</Link> : <div className="w-7"></div>}
</> : ""

*/