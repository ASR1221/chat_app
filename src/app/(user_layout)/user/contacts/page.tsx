"use client";

import { BaseSyntheticEvent, useEffect, useState } from "react";

import { useRealtime } from "@/providers/realtimeProvider";
import useTheme from "@/hooks/useTheme";

import UserListItem from "@/components/userListItem/userListItem";
import SimpleNav from "@/components/simpleNav/simpleNav";
import EmptyList from "@/components/emptyList/emptyList";

export default function Contacts() {

   const { conts } = useRealtime();
   const { isDark } = useTheme();

   const [currentConts, setCurrenConts] = useState<typeof conts | null>(null);

   function handleChange(e: BaseSyntheticEvent) {
      const text = e.target.value.trim();
      if (!text) setCurrenConts(conts);
      else setCurrenConts(conts.filter(c => c.users.full_name.includes(text) || c.users.user_name.includes(text)));
   }

   useEffect(() => {
      setCurrenConts(conts)
   }, [conts]);

   return <div className="absolute top-0 bottom-0 bg-bg-color w-[100%] px-5 py-20">
      <SimpleNav backPath="/user" header="Contacts" />

      <form>
         <input
            type="text"
            placeholder="Search..."
            onChange={handleChange}
            className={`w-[100%] px-3 py-1 mb-8 rounded-md outline-none ${isDark ? "bg-gray-700/60" : "bg-gray-700/30"}`}
         />
      </form>

      <section className="[&>*:not(:last-child)]:border-b-[1px] [&>*]:border-devider-line-color">
         {
            currentConts && (currentConts.length < 1 ? <EmptyList text="No Contacts yet. Add a contacts and it will be seen here." />
            : currentConts?.flatMap(contact => {
               
               const user = contact.users;
               
               return <div key={user.id}>
                  <UserListItem
                     id={user.id}
                     profile_img_url={user.profile_img_url}
                     user_name={user.user_name}
                     full_name={user.full_name}
                  />
               </div>
            }))
         }
      </section>
   </div>
}