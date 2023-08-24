"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";

import { useRealtime } from "@/providers/realtimeProvider";
import Message from "@/components/messages/message";

export default function Conversation() {

   const conversationId = useParams().conversationId;
   const { convos, setConvos, userId } = useRealtime();

   const conversation = useMemo(() => {
      return convos.find(conv => conv.id === conversationId);
   }, [convos, conversationId]);

   // useEffect(() => {
      
   // }, []);

   return <div>
      {
         conversation?.messages?.map(msg => {
            
            return <Message
               key={msg.id}
               body={msg.body}
               file_url={msg.file_url}
               time={msg.created_at}
               read_status={msg.read_status}
               sender_id={msg.sender_id}
               userId={userId}
            />
         })
      }
      

      {/* input */}
   </div>
}