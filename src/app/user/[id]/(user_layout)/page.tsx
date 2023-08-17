"use client";

import { useParams } from "next/navigation"
import Link from "next/link"; 

import ConversationsComp from "../../../../components/conversation/conversationsComp";

export default function Conversations() {

   const userId = useParams().id as string;

   return <div>
      <h1>
         <Link href="">nav</Link>
         <p role="heading" aria-level={2}>App name</p>
         <Link href=""></Link>
      </h1>
      {/* <ConversationsComp userId={userId} /> */}
   </div>;
}