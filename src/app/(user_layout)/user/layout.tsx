"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { type ReactNode, type KeyboardEvent, useState, useEffect } from "react";

import { useRealtime } from "@/providers/realtimeProvider";
import OptionsModal from "@/components/optionsModal/optionsModal";

// TODO: make create convos with accept multiple users
// TODO: check if realtime needed for 'conversations'
// TODO: check how to show online status of a user

export default function UserLayout({ children }: { children: ReactNode }) {

   const pathname = usePathname();
   const router = useRouter();
   const params = useParams();
   const { convos } = useRealtime();

   // handle search submit
   function handleSearch(e: KeyboardEvent<HTMLInputElement>) {
      if (e.key === "Enter") router.push(`/user/search?term=${e.currentTarget.value}`)
   }


   return <>
      <nav className="flex justify-between p-3 bg-slate-400">
         {
            pathname === "/user" ? <>
               <button onClick={() => router.push("/user?options=true")}>Options</button>
               <p role="heading" aria-level={2} className="text-lg">App name</p>
               <Link href="/user/search">search</Link>
            </>
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
         }
      </nav>
      <OptionsModal />
      <div>{children}</div>
   </>
}
