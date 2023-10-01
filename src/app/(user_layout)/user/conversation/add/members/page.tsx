"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo, useEffect, type BaseSyntheticEvent} from "react";

import useTheme from "@/hooks/useTheme";
import { useRealtime } from "@/providers/realtimeProvider";

import SimpleNav from "@/components/simpleNav/simpleNav";
import UserListItem from "@/components/userListItem/userListItem";
import EmptyList from "@/components/emptyList/emptyList";

export default function AddGroupMembers() {

   const { push } = useRouter();

   const { conts } = useRealtime();
   const { isDark } = useTheme();

   const [currentConts, setCurrenConts] = useState<typeof conts>([]);
   const [selectedConts, setSelectedConts] = useState<typeof conts>([]);

   function handleChange(e: BaseSyntheticEvent) {
      const text = e.target.value.trim();
      if (!text) setCurrenConts(conts);
      else setCurrenConts(conts.filter(c => c.users.full_name.includes(text) || c.users.user_name.includes(text)));
   }

   function handleAddToSelected(contact: typeof conts[0]) {
      setSelectedConts(p => p ? [...p, contact].sort((current, prev) => current.users.user_name.localeCompare(prev.users.user_name)) : [contact]);
      setCurrenConts(p => p?.filter(c => c.users.id !== contact.users.id) ?? []);
   }

   function handleRemoveFromSelected(contact: typeof conts[0]) {
      setSelectedConts(p => p?.filter(c => c.users.id !== contact.users.id) ?? []);
      setCurrenConts(p => p ? [...p, contact].sort((current, prev) => current.users.user_name.localeCompare(prev.users.user_name)) : [contact]);
   }

   function finish() {
      const contsIds = selectedConts.map(c => c.users.id);
      push(`/user/conversation/add/conversation?ids=${contsIds.join(",")}`);
   }

   useEffect(() => {
      if (conts)
         setCurrenConts(conts);
   }, [conts]);

   return <div className="absolute top-0 bottom-0 bg-bg-color w-[100%] px-5 py-20">
   <SimpleNav header="Chat Members" />

   <form>
      <input
         type="text"
         placeholder="Search..."
         onChange={handleChange}
         className={`w-[100%] px-3 py-1 mb-8 rounded-md outline-none ${isDark ? "bg-gray-700/60" : "bg-gray-700/30"}`}
      />
   </form>

   {selectedConts?.length > 0 && <section className="border-b-[1px] border-text-color py-3">
      {
         selectedConts.flatMap((contact, i) => {
            
            const user = contact.users;
            
            return <div key={user.id} className="grid grid-cols-[1fr_6fr] gap-2">
               <button
                  type="button"
                  className="text-red-color text-5xl p-2 -mt-1"
                  onClick={() => handleRemoveFromSelected(contact)}
               >-</button>

               <div className={`px-2 ${i === selectedConts.length - 1 ? "" : "border-b-[1px]"} border-devider-line-color`}>
                  <UserListItem
                     id={user.id}
                     profile_img_url={user.profile_img_url}
                     user_name={user.user_name}
                     full_name={user.full_name}
                  />
               </div>
            </div>
         })
      }
      
      <div className="w-fit ml-auto mr-3">
         <button
            type="button"
            className="bg-btn-color hover:bg-btn-border-color px-2 py-1 rounded-md"
            onClick={finish}
         >Add Seleced</button>
      </div>
   </section>}
      
   <section className="py-3">
      {
         currentConts && (currentConts.length > 0 ? currentConts.flatMap((contact, i) => {
            
            const user = contact.users;
            
            return <div key={user.id} className="grid grid-cols-[1fr_6fr] items-center gap-2">
               <button
                  type="button"
                  className={`p-4 relative`}
                  onClick={() => handleAddToSelected(contact)}
               >
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 bg-green-color h-[2px] w-[40%] rounded-md" />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-color h-[2px] w-[40%] rounded-md" />
               </button>

               <div className={`px-2 ${i === currentConts.length - 1 ? "" : "border-b-[1px]"} border-devider-line-color`}>
                  <UserListItem
                     id={user.id}
                     profile_img_url={user.profile_img_url}
                     user_name={user.user_name}
                     full_name={user.full_name}
                  />
               </div>
            </div>
         }) : selectedConts && selectedConts.length > 0 ? null
            : <EmptyList text="No Contacts yet. Add a contacts then you can add a member." />) 
      }
   </section>
</div>
}