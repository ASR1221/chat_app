"use client";

import ConversationsComp from "../../../components/conversation/conversationsComp";
import { useRealtime } from "@/providers/realtimeProvider";

export default function Conversations() {
   const { userId, convos } = useRealtime();

   return <ConversationsComp conversations={convos} userId={userId} />;
}
