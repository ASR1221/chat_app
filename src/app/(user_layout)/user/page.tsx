"use client";

import Link from "next/link";

import ConversationsComp from "../../../components/conversation/conversationsComp";
import { useRealtime } from "@/providers/realtimeProvider";

export default function Conversations() {
   const { userId, convos } = useRealtime();

   return <>
      <ConversationsComp conversations={convos} userId={userId} />
      <div>
         <Link href="/user/conversation/add">Add A Conversation</Link>
      </div>
   </>;
}
