"use client";

import { useParams } from "next/navigation"

import ConversationsComp from "../../../../components/conversation/conversationsComp";

export default function Conversations() {

   const userId = useParams().id as string;

   return <div>
      <ConversationsComp userId={userId} />
   </div>;
}