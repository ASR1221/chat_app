"use client";

import { createContext, useContext, useEffect, useState } from "react";

import type { Message, ConversationUser, User, Conversation } from "@/types/supabaseTables";
import { clientSupabase } from "@/utils/clientSupabase";

type OUser = Omit<User, "id" | "created_at" | "last_seen">;

export type Convo = Omit<Conversation, "created_at"> & {
   messages: Message[] | null,
   users: Omit<User, "created_at" | "last_seen">[],
};

type Contact = {
   users: Omit<User, "created_at">[]
};

export const realtimeContext = createContext<{
   userId: string,
   user: OUser,
   convos: Convo[],
   conts: Contact[],
}>({
   userId: "",
   user: {
      bio: "",
      full_name: "",
      profile_img_url: "",
      user_name: "",
   },
   convos: [],
   conts: []
});

export default function RealtimeProvider(props: any) {

   const [userId, setUserId] = useState<string | null>(null);
   const [conts, setConts] = useState<Contact[] | null>(null);
   const [user, setUser] = useState<OUser>({
      user_name: "",
      full_name: "",
      bio: null,
      profile_img_url: null,
   });
   const [convos, setConvos] = useState<Convo[]>([]);
   
   async function fetchAll() {

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
                     user_name,
                     full_name,
                     bio,
                     profile_img_url
                  )
               )
            `)
            .eq("id", userId);

         if (!response.data) throw new Error("Some thing went wrong, please refresh the page.");

         // get the last 10 message of every convo
         const promises = response.data[0].conversations.map((conv) =>
            clientSupabase
               .from("messages")
               .select()
               .eq("conversation_id", conv.id)
               .order("created_at", { ascending: false })
               .limit(10)
         );

         const response2 = await Promise.all(promises);

         const final = response.data[0].conversations.map(
            (conv, i) => ({
               ...conv,
               messages: response2[i].data?.flatMap(d => {
                  if (d.conversation_id === conv.id) return d
                  return [];
               }) ?? null
            })
         );

         const response3 = await clientSupabase.from("user_contact").select(`
            users!contact_id (
               id,
               user_name,
               full_name,
               bio,
               profile_img_url,
               last_seen
            )
         `).eq("user_id", userId);

         setUser({
            user_name: response.data[0].user_name,
            full_name: response.data[0].full_name,
            bio: response.data[0].bio,
            profile_img_url: response.data[0].profile_img_url,
         });

         setConvos(final);

         setConts(response3.data)

      } catch (e: any) {
         throw new Error(e.message);
      }
   }



   useEffect(() => {

      clientSupabase.auth.getSession().then(({ data: { session } }) => {
         setUserId(session?.user.id ?? null);
      });

      const { data: authListener } = clientSupabase.auth.onAuthStateChange(
         (event, session) => {
            setUserId(session?.user.id ?? null);
            console.log("Auth state changed:" + event);
         }
      );

      if (!userId) return;

      fetchAll();
      
      const messagesChannel = clientSupabase.channel("allMessages")
         .on("postgres_changes", { event: '*', schema: 'public', table: 'messages' }, (payload) => {
            
            console.log(payload);
            const newMessage = payload.new as Message;
            
            if (payload.eventType === "UPDATE") {
               const updated = convos.map(c => {

                  if (c.id === newMessage.conversation_id) {
                     const m = c.messages?.map(message => {
                        if (message.id === newMessage.id) return newMessage;

                        return message;
                     }) ?? null;
                     
                     return { ...c, messages: m };
                  };

                  return c;
               });

               setConvos(updated);
               
            }

            if (payload.eventType === "DELETE") {
               const updated = convos.map(c => {

                  if (c.id === payload.old.conversation_id) {
                     c.messages?.filter(message => message.id !== payload.old.id);
                  }

                  return c;
               });

               setConvos(updated);
            }

            if (payload.eventType === "INSERT") {
               const updated = convos.map(c => {

                  if (c.id === newMessage.conversation_id) {
                     const m = c.messages ?? [];
                     m.push(newMessage);
                     return { ...c, messages: m };
                  };

                  return c;
               });

               setConvos(updated);
            }

         }).subscribe()
      
      const convoChannel = clientSupabase.channel("allConversations")
         .on("postgres_changes", { event: '*', schema: 'public', table: 'conversation_user', filter: `user_id=eq.${userId}` }, (payload) => {

            console.log(payload);
            
            if (payload.eventType === "DELETE") {
               setConvos(convos.filter(c => c.id !== payload.old.conversation_id));
            }
            
            if (payload.eventType === "INSERT") {
               const newConvo = payload.new as ConversationUser;

               clientSupabase.from("conversations").select(`
                  id,
                  name,
                  owner_id,
                  group_img_url,
                  users!conversation_user (
                     id,
                     user_name,
                     full_name,
                     bio,
                     profile_img_url
                  ),
                  messages (*)
               `).eq("id", newConvo.conversation_id)
                  .then(response => {
                     const updated = convos;
                     if (response.error) throw new Error(response.error.message);
                     if (response.data) updated.push(response.data[0]);

                     setConvos(updated);
                  });
            }

         }).subscribe()

      return () => {
         authListener.subscription.unsubscribe();
         messagesChannel.unsubscribe();
         convoChannel.unsubscribe();
      };

   }, [userId]);





   const value = {
      userId,
      user,
      convos,
      conts,
   };

   return <realtimeContext.Provider value={value} {...props} />;
}



export function useRealtime() {
   const context = useContext(realtimeContext);
   if (context === undefined) {
      throw new Error("useRealtime must be used within a realtimeContextProvider.");
   }
   return context;
};