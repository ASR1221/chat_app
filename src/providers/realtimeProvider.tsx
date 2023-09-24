"use client";

import { createContext, useContext, useEffect, useState, SetStateAction, Dispatch } from "react";

import type { Message, ConversationUser, User, Conversation } from "@/types/supabaseTables";
import { clientSupabase } from "@/utils/clientSupabase";

export type OUser = Omit<User, "id" | "created_at" | "last_seen">;

export type Convo = Omit<Conversation, "created_at"> & {
   messages: Message[] | null,
   users: Array<Omit<User, "created_at" | "last_seen"> & {
      is_owner: {
         is_owner: boolean,
      }[],
   }>
};

type Contact = {
   users: Omit<User, "created_at">
};

type MsgPlaceHolder = {
   body: string;
   file_url: string;
}

export const realtimeContext = createContext<{
   userId: string,
   user: OUser,
   convos: Convo[],
   conts: Contact[],
   setConts: Dispatch<SetStateAction<Contact[]>>,
   setConvos: Dispatch<SetStateAction<Convo[]>>,
   msgPlaceHolder: { body: string, file_url: string }[],
   setMsgPlaceHolder: Dispatch<SetStateAction<MsgPlaceHolder[]>>,
}>({
   userId: "",
   user: {
      bio: "",
      full_name: "",
      profile_img_url: "",
      user_name: "",
   },
   convos: [],
   conts: [],
   setConts: () => {},
   setConvos: () => {},
   msgPlaceHolder: [],
   setMsgPlaceHolder: () => {},
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

   const [msgPlaceHolder, setMsgPlaceHolder] = useState<MsgPlaceHolder[]>([]);
   
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
               conversations(
                  id,
                  name,
                  group_img_url,
                  users(
                     id,
                     user_name,
                     full_name,
                     bio,
                     profile_img_url,
                     is_owner:conversation_user(is_owner)
                  )
               )
            `)
            .eq("id", userId);

         if (response.error || (response.data && response.data.length < 1)) throw new Error(response.error?.message);

         // get the last 10 message of every convo
         const promises = response.data[0].conversations.map((conv) =>
            clientSupabase
               .from("messages")
               .select()
               .eq("conversation_id", conv.id)
               .order("created_at", { ascending: false })
               .limit(15)
         );

         const response2 = await Promise.all(promises); // this should through an error if one does

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

         if (response3.error) throw new Error("Some thing went wrong. Please refresh the page.");

         setUser({
            user_name: response.data[0].user_name,
            full_name: response.data[0].full_name,
            bio: response.data[0].bio,
            profile_img_url: response.data[0].profile_img_url,
         });

         setConvos(final);

         const c = response3.data as unknown as Contact[];
         setConts(c)

      } catch (e: any) {
         throw new Error(e.message);
      }
   }


   function handleMessagesChanges(payload: any) {
         
      if (payload.errors) throw new Error("Some thing went wrong. Please refresh the page.");

      const newMessage = payload.new as Message;
      
      if (payload.eventType === "UPDATE") {
         
         setConvos(prev => {
            const updated = prev.map(c => {

               if (c.id === newMessage.conversation_id) {
                  const m = c.messages?.map(message => {
                     if (message.id === newMessage.id) return newMessage;
   
                     return message;
                  }) ?? null;
                  
                  return { ...c, messages: m };
               };
   
               return c;
            });
            return updated;
         });
         
      }

      if (payload.eventType === "DELETE") {
         setConvos(prev => {
            const updated = prev.map(c => {

               const updatedMessages = c.messages?.flatMap(message => {
                  if (message.id === payload.old.id)
                     return [];

                  return message;
               });

               return { ...c, messages: updatedMessages ?? [] };
            });
   
            return updated;
         });
      }

      if (payload.eventType === "INSERT") {
         
         if (newMessage.sender_id === userId)
            setMsgPlaceHolder(msgPlaceHolder.filter(f => f.body !== newMessage.body || f.file_url !== newMessage.file_url));
         
         setConvos(prev => {
            const updated = prev.map(c => {

               if (c.id === newMessage.conversation_id) {
                  const m = c.messages ?? [];
                  m.unshift(newMessage);
                  return { ...c, messages: m };
               };
   
               return c;
            });
            return updated;
         });
      }

   }


   function addNewConvo(payload: any) {
      if (payload.errors) throw new Error("Some thing went wrong. Please refresh the page.");
            
      if (payload.eventType === "DELETE") {
         setConvos(prev => prev.filter(c => c.id !== payload.old.conversation_id));
      }
      
      if (payload.eventType === "INSERT") {
         const newConvo = payload.new as ConversationUser;

         clientSupabase.from("conversations").select(`
            id,
            name,
            group_img_url,
            users(
               id,
               user_name,
               full_name,
               bio,
               profile_img_url,
               is_owner:conversation_user(is_owner)
            ),
            messages(*)
         `).eq("id", newConvo.conversation_id)
            .then(response => {
               
               if (response.error) throw new Error(response.error.message);
               
               if (response.data && response.data.length > 0) 
                  setConvos(prev => {
                     const updated = prev;
                     updated.push(response.data[0]);
                     return updated;
                  });
            });
      }
   }

   function updateConvoInfo(payload: any) {

      const newConvo = payload.new as Conversation;

      setConvos(p => p.map(convo => {
         if (convo.id === newConvo.id) return { ...convo, ...newConvo };
         return convo;
      }));
   }


   useEffect(() => {


      clientSupabase.auth.getSession().then(({ data: { session } }) => {
         setUserId(session?.user.id ?? null);
      });

      const { data: authListener } = clientSupabase.auth.onAuthStateChange(
         (event, session) => {
            setUserId(session?.user.id ?? null);
            console.log("Auth state changed: " + event);
         }
      );

      if (!userId) return;

      fetchAll();
      
      const messagesChannel = clientSupabase.channel("allMessages")
         .on("postgres_changes", { event: '*', schema: 'public', table: 'messages' }, handleMessagesChanges).subscribe();
      
      const convoChannel = clientSupabase.channel("allConversations")
         .on("postgres_changes", { event: '*', schema: 'public', table: 'conversation_user', filter: `user_id=eq.${userId}` }, addNewConvo).subscribe();

      const convoInfoChannel = clientSupabase.channel("allupdatesConvos")
         .on("postgres_changes", { event: 'UPDATE', schema: 'public', table: 'conversations' }, updateConvoInfo).subscribe();

      
      return () => {
         authListener.subscription.unsubscribe();
         messagesChannel.unsubscribe();
         convoChannel.unsubscribe();
         convoInfoChannel.unsubscribe();
      };

   }, [userId]);


   const value = {
      userId,
      user,
      convos,
      conts,
      setConts,
      setConvos,
      msgPlaceHolder,
      setMsgPlaceHolder,
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