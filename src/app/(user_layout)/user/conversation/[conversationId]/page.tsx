"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, Fragment, type KeyboardEvent } from "react";

import { useRealtime } from "@/providers/realtimeProvider";
import { clientSupabase } from "@/utils/clientSupabase";

import Message from "@/components/messages/message";

export default function Conversation() {

   const [inputValue, setInputValue] = useState('');
   const [isError, setIsError] = useState(false);

   const containerRef = useRef<HTMLDivElement | null>(null);
   const fetchNumberRef = useRef(1)

   const conversationId = useParams().conversationId as string;
   const { convos, setConvos, userId } = useRealtime();

   const conversation = useMemo(() => {
      return convos.find(conv => conv.id === conversationId);
   }, [convos, conversationId]);


   async function handleSendMessage(e: KeyboardEvent<HTMLInputElement>) {
      if (e.key === "Enter" && e.currentTarget.value && conversationId) {
         const response = await clientSupabase.from("messages").insert([{
            body: inputValue,
            sender_id: userId,
            conversation_id: conversationId,
         }]);
         if (response.error) setIsError(true);
         else setInputValue('');
      }
   }

   useEffect(() => {
      // TODO: check if there are 10 messages, then fetch more
      async function getMoreMessages() {
         clientSupabase.from("messages").select()
            .eq("conversation_id", conversationId)
            .order("created_at")
            .range(10 * fetchNumberRef.current, 50 * fetchNumberRef.current)
            .then(response => {
               if (response.error) return;
               if (response.data.length < 1) return;

               fetchNumberRef.current++;
               
               const updated = conversation?.messages;
               response.data.map(d => updated?.unshift(d))

               if (updated && updated.length > 0)
                  setConvos(convos.map(conv => {
                     if (conv.id === conversationId)
                        return { ...conv, messages: updated };
                     return conv;
                  }));
            });
      }

      if (conversation?.messages && (conversation?.messages?.length < 10 || conversation?.messages?.length % 50 === 0)) return;
      
      getMoreMessages();

      const observer = new IntersectionObserver(([entry]) => {
         if (entry.isIntersecting) {
            getMoreMessages();
         }
      });

      if (containerRef.current) observer.observe(containerRef.current)

      return () => {
         if (containerRef.current) observer.unobserve(containerRef.current);
      }
      
   }, [conversationId]);

   return <div>
      {
         conversation?.messages?.map((msg, i) => {
            
            return <Fragment key={i}>
               {(i+1) % fetchNumberRef.current === 0 && <div ref={containerRef}></div>}
               <Message
                  id={msg.id}
                  body={msg.body}
                  file_url={msg.file_url}
                  time={msg.created_at}
                  read_status={msg.read_status}
                  sender_id={msg.sender_id}
                  userId={userId}
               />
            </Fragment>
         })
      }
      

      <div className="fixed bottom-0 w-full p-1 border-t-2 border-black">
         <input
            type="text"
            className=" w-full p-1 border-2 border-blue-600" onKeyDown={handleSendMessage}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
         />
      </div>
   </div>
}