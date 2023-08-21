"use client";

import Link from "next/link"; 

import ConversationsComp from "../../components/conversation/conversationsComp";

export default function Conversations() {

   return <div>
      <nav>
         {/* Complete this nav later */}
         <button>nav</button>
         <p role="heading" aria-level={2}>App name</p>
         <Link href="">search</Link>
      </nav>
      <ConversationsComp conversations={[]} userId="" />
   </div>;
}