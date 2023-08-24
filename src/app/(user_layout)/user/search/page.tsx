"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";

import { useRealtime } from "@/providers/realtimeProvider";
import { clientSupabase } from "@/utils/clientSupabase";
import { User } from "@/types/supabaseTables";

export default function Search() {

   const { convos, conts } = useRealtime();

   const searchTerm = useSearchParams().get("term");

   const [users, setUsers] = useState<Omit<User, "created_at">[] | null>(null);
   const [conversations, setConversations] = useState<typeof convos>();
   const [isError, setIsError] = useState(false);
   const [contacts, setContacts] = useState(conts);

   useEffect(() => {

      if (!searchTerm) return;

      if (searchTerm.includes("@")) {
         clientSupabase.from("users")
            .select("bio, full_name, id, last_seen, profile_img_url, user_name")
            .eq("user_name", searchTerm.split("@")[1])
            .then(response => {
               if (response.error) {
                  setIsError(true);
                  return;
               }
               setUsers(response.data);
            });
      } else {
         const convResult = convos?.filter(conv => conv.name === searchTerm);
         setConversations(convResult);
   
         const contsResult = conts?.filter(cont => cont.users[0].full_name === searchTerm || cont.users[0].user_name === searchTerm);
         setContacts(contsResult);
      }

   }, [searchTerm]);

   return <div>
      {
         !users && conts && conts.length > 0 && <div>
            {
               conts.map(cont => <Link href={`/user/contacts/${cont.users[0].id}`} key={cont.users[0].id}>
                  <div>{cont.users[0].profile_img_url && <img src={cont.users[0].profile_img_url} alt={`${cont.users[0].full_name} profile image`} />}</div>
                  <p>{cont.users[0].full_name}</p>
               </Link>)
            }
         </div>
      }
      {
         users && users.length > 0 && <div>
            {
               users.map(user => <Link href={`/user/profile/${user.id}`} key={user.id}>
                  <div>{user.profile_img_url && <img src={user.profile_img_url} alt={`${user.full_name} profile image`} />}</div>
                  <p>{user.full_name}</p>
                  <p>{user.user_name}</p>
               </Link>)
            }
         </div>
      }
      {
         !users && conversations && conversations.length > 0 && <div>
            {
               conversations.map(conversation => <Link href={`/user/conversation/${conversation.id}`} key={conversation.id}>
                  <div>{conversation.group_img_url && <img src={conversation.group_img_url} alt={`${conversation.name} group image`} />}</div>
                  <p>{conversation.name}</p>
               </Link>)
            }
         </div>
      }
   </div>
}