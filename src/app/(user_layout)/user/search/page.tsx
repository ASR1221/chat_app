"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, type BaseSyntheticEvent } from "react";
import { Metadata } from "next";

import { useRealtime } from "@/providers/realtimeProvider";
import useTheme from "@/hooks/useTheme";
import { clientSupabase } from "@/utils/clientSupabase";
import { User } from "@/types/supabaseTables";

import SimpleNav from "@/components/simpleNav/simpleNav";
import UserListItem from "@/components/userListItem/userListItem";
import ConvoListItem from "@/components/convoListItem/convoListItem";
import EmptyList from "@/components/emptyList/emptyList";

export const metadata: Metadata = {
   title: 'Chatty | Search',
   description: 'Search for users or chats',
};

export default function Search() {

   const { convos, conts, userId } = useRealtime();
   const { isDark } = useTheme();

   const searchTerm = useSearchParams().get("term");
   const { push } = useRouter();

   const [inputValue, setInputVlaue] = useState("");
   const [users, setUsers] = useState<Omit<User, "created_at">[] | null>(null);
   const [conversations, setConversations] = useState<typeof convos | null>(null);
   const [isError, setIsError] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   function handleSubmit(e: BaseSyntheticEvent) {
      e.preventDefault();
      push(`/user/search?term=${inputValue.trim()}`);
   }

   useEffect(() => {

      setInputVlaue(searchTerm ?? "");
      setUsers(null);
      setConversations(null);
      setIsError(false);

      if (!searchTerm) return;

      if (searchTerm.startsWith("@")) {
         setIsLoading(true);
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
         
         setIsLoading(false);
         return;
      } 

      const convResult = convos?.filter(conv => conv.name.includes(searchTerm));
      setConversations(convResult);

   }, [searchTerm]);

   return <div className="absolute top-0 bottom-0 bg-bg-color w-[100%] px-5 py-24">
      <SimpleNav backPath="/user" header="Search" />

      <form onSubmit={handleSubmit}>
         <input
            type="text"
            placeholder="Search..."
            value={inputValue}
            onChange={(e) => setInputVlaue(e.target.value.trim())}
            className={`w-[100%] px-3 py-1 mb-8 rounded-md outline-none ${isDark ? "bg-gray-700/60" : "bg-gray-700/30"}`}
         />
      </form>

      <div>
         {
            isError ? <div className="w-fit mx-auto mt-32">
               <div className="w-[300px] mx-auto">
                  <img src="/images/illustrations/500 Internal Server Error-amico.svg" alt="Empty chat illustration" />
               </div>
               <p>Something went wrong. Please refresh the page and try again.</p>
            </div>
            : !searchTerm && conts && conts.length > 0 ? <>
               <h3 className="text-2xl">Contacts</h3>
               <div className="grid grid-rows-1 overflow-x-scroll no-scrollbar p-2">
                  {
                     conts.map(cont => <Link href={`/user/profile/${cont.users.id}`} key={cont.users.id} className="p-2 w-fit">
                        <div className="w-10 aspect-square bg-devider-line-color rounded-full">
                           {cont.users.profile_img_url && <img src={cont.users.profile_img_url} alt={`${cont.users.user_name} profile image`} />}
                        </div>
                        <p className="w-10 overflow-hidden text-center text-sm">{cont.users.user_name}</p>
                     </Link>)
                  }
               </div>
            </> : users && users.length > 0 ? <div className="[&>*:not(:last-child)]:border-b-[1px] [&>*]:border-devider-line-color">
               {
                  users.map(user => <UserListItem
                     key={user.id}
                     id={user.id}
                     profile_img_url={user.profile_img_url}
                     user_name={user.user_name}
                     full_name={user.full_name}
                  />)
               }
            </div> : conversations && conversations.length > 0 ? <div className="[&>*:not(:last-child)]:border-b-[1px] [&>*]:border-devider-line-color">
               {
                  conversations.map(conversation => <ConvoListItem key={conversation.id} convo={conversation} userId={userId} />)
               }
            </div> : !isLoading && <EmptyList text="Nothing found. Make sure you write your search correctly." />
         }
      </div>
   </div>
}