"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { type ReactNode, type KeyboardEvent, useState, useEffect } from "react";

import { useRealtime } from "@/providers/realtimeProvider";
import useTheme from "@/hooks/useTheme";

import OptionsModal from "@/components/optionsModal/optionsModal";
import SearchIcon from "@/svgs/searchIcon";
import OptionsIcon from "@/components/optionsIcon/optionsIcon";
import ConvoListItem from "@/components/convoListItem/convoListItem";

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
      
      <nav className="fixed grid grid-cols-[1fr_8fr_1fr] gap-5 items-center justify-between p-4 bg-convo-header-bg-color text-convo-header-text-color px-4 w-[100%] md:w-[370px]">
         <OptionsIcon clickFunc={() => router.push("/user?options=true")}/>
         <h2 className="text-4xl text-convo-header-text-color">Chatty</h2>
         <Link href="/user/search"><SearchIcon isDark={isDark} width={25} /></Link>
      </nav>
      <OptionsModal />
      
      <div className="px-4 w-[100%] md:w-[370px] fixed mt-20">
         <section className="[&>*:not(:last-child)]:border-b-[1px] [&>*]:border-devider-line-color">
            {
               !convos.length ? <div className="w-fit mx-auto mt-32">
                  <div className="w-[300px] mx-auto">
                     <img src="/images/illustrations/No data-pana.svg" alt="Empty chat illustration" />
                  </div>
                  <p>No Conversation yet. Create a conversation and it will be seen here.</p>
               </div> : convos.map(convo =>
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
         href="/user/conversation/add"
         className="w-12 pt-1 grid justify-center items-center aspect-square rounded-sm fixed bottom-4 right-4 md:right-[calc(100vw-370px+1rem)] bg-convo-header-bg-color text-convo-header-text-color text-2xl font-bold shadow-basic hover:bg-btn-color transition-all duration-300"
      >+</Link>

      <div className="w-[1px] bg-devider-line-color left-[370px] top-0 bottom-0 z-[100] md:fixed" />
      <div
         className={`w-[100vw] z-10 absolute top-0 bottom-0 ${pathname === "/user" ? "left-[100vw]" : "left-[0]"} transition-all md:w-[calc(100vw-370px)] md:left-[370px]`}
      >{children}</div>
   </>;
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