"use client";

import { useParams } from "next/navigation"
import { ReactNode, useEffect } from "react";

import { clientSupabase } from "@/utils/clientSupabase";

export default function UserLayout({ children }: { children: ReactNode}) {

   const userId = useParams().id as string;     

   fetchAll(userId).then(d => { }).catch(e => { });
   
   useEffect(() => {
      const messagesChannel = clientSupabase.channel("allMessages")
         .on("postgres_changes", { event: '*', schema: 'public', table: 'messages' }, (payload) => {
            console.log(payload)
         }).subscribe()
      
      const convoChannel = clientSupabase.channel("allConversations")
         .on("postgres_changes", { event: '*', schema: 'public', table: 'conversation_user', /* filter: `user_id=eq.${}` */ }, (payload) => {
            console.log(payload)
         }).subscribe()

      return () => {
         messagesChannel.unsubscribe();
         convoChannel.unsubscribe();
      }
   }, []);

   return <div>
      <>{children}</>
   </div>
}

async function fetchAll(userId: string) {

   try {
      
      // get all convo of  a user
      const response = await clientSupabase
         .from("users")
         .select(`
            user_name,
            full_name,
            bio,
            profile_img_url,
            conversations!conversation_user (
               id,
               name,
               owner_id,
               group_img_url,
               users!conversation_user (
                  id,
                  user_name
               )
            )
         `)
         .eq("id", userId);

      if (!response.data) throw new Error("Some thing went wrong, please refresh the page.");

      // get the last message of every convo
      const promises = response.data[0].conversations.map((conv) =>
         clientSupabase
            .from("messages")
            .select()
            .eq("conversation_id", conv.id)
            .order("created_at", { ascending: false })
            .limit(1)
      );

      const response2 = await Promise.all(promises);

      const final = response.data[0].conversations.map(
         (conv, i) => response2[i].data
      );

      return final;

   } catch (e) {
      throw new Error("Some thing went wrong, please refresh the page.");
   }
}
