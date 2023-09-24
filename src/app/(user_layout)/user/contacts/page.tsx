"use client";

import { useRealtime } from "@/providers/realtimeProvider";

import UserListItem from "@/components/userListItem/userListItem";
import SimpleNav from "@/components/simpleNav/simpleNav";

export default function Contacts() {

   const { conts } = useRealtime();

   return <div className="absolute top-0 bottom-0 bg-bg-color w-[100%] px-5 py-14">
      <SimpleNav backPath="/user" />
      <h2 className="text-3xl py-5">Contacts</h2>
      {
         conts?.length < 1 ? <div className="w-fit mx-auto mt-32">
            <div className="w-[300px] mx-auto">
               <img src="/images/illustrations/No data-pana.svg" alt="Empty chat illustration" />
            </div>
            <p>No Contacts yet. Add a contacts and it will be seen here.</p>
         </div> : conts?.flatMap(contact => {
            
            const user = contact.users;
            
            return <UserListItem
               key={user.id}
               id={user.id}
               profile_img_url={user.profile_img_url}
               user_name={user.user_name}
               full_name={user.full_name}
            />
         })
      }
   </div>
}