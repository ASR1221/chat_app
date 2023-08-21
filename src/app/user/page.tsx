"use client";

import Link from "next/link"; 

import ConversationsComp from "../../components/conversation/conversationsComp";
import { Convo, useRealtime } from "@/providers/realtimeProvider";

export default function Conversations() {

   const { userId, convos } = useRealtime() as { userId: string, convos: Convo[]};

   return <>
      <nav className="flex justify-between p-3">
         {/* Complete this nav later */}
         <button>Options</button>
         <p role="heading" aria-level={2} className="text-lg">App name</p>
         <Link href="">search</Link>
      </nav>
      <ConversationsComp conversations={convos} userId={userId} />
   </>;
}