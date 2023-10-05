"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type BaseSyntheticEvent } from "react";

import { useRealtime } from "@/providers/realtimeProvider";
import { clientSupabase } from "@/utils/clientSupabase";
import { User } from "@/types/supabaseTables";

import SimpleNav from "@/components/simpleNav/simpleNav";
import UserListItem from "@/components/userListItem/userListItem";

export default function CreateNewConvo() {
   
   const { push } = useRouter();
   const idsString = useSearchParams().get("ids");

   const { userId } = useRealtime();

   const [isLoading, setIsLoading] = useState(false);
   const [isError, setIsError] = useState(false);

   const [users, setUsers] = useState<User[]>([]);
   const [img, setImg] = useState<File | null>(null);

   async function handleSubmit(e: BaseSyntheticEvent) {
      e.preventDefault();
      const chatName = e.target[1].value.trim();

      if (!chatName) {
         setIsError(true);
         return;
      }

      setIsLoading(true);
      
      const newConvoId = crypto.randomUUID();
      const newConvo: {
         id: string,
         name: string,
         group_img_url?: string,
      } = {
         id: newConvoId,
         name: chatName,
      };

      if (img) {
         const fileResponse = await clientSupabase.storage.from("chat")
            .upload(`group_images/${Date.now()}-${img.name}`, img);
         
         if (fileResponse.error) {
            setIsError(true);
            return;
         }

         const imagePath = fileResponse.data?.path;
         newConvo.group_img_url = `https://mhlqhssqzsezzhgonlxp.supabase.co/storage/v1/object/public/chat/${imagePath}`;;
      }

      const convoResponse = await clientSupabase.from("conversations").insert([newConvo]);

      if (convoResponse.error) {
         if (newConvo.group_img_url)
            clientSupabase.storage.from("chat").remove([newConvo.group_img_url.split("public/chat/")[1]]);

         setIsError(true);
         setIsLoading(false);
         return;
      }

      const convoOwnerResponse = await clientSupabase.from("conversation_user")
         .insert({
            user_id: userId,
            conversation_id: newConvoId,
            is_owner: true,
         });
      
      if (convoOwnerResponse.error) {
         clientSupabase.from("conversations").delete().eq("id", newConvoId);
         if (newConvo.group_img_url)
            clientSupabase.storage.from("chat").remove([newConvo.group_img_url.split("public/chat/")[1]]);

         setIsError(true);
         setIsLoading(false);
         return;
      }

      const payload = users.map(u => ({
         user_id: u.id,
         conversation_id: newConvoId,
         is_owner: false,
      }));

      const convoDUserResponse = await clientSupabase.from("conversation_user").insert(payload);
      
      if (convoDUserResponse.error) {
         clientSupabase.from("conversation_user").delete().eq("id", newConvoId).eq("user_id", userId);
         clientSupabase.from("conversations").delete().eq("id", newConvoId);
         if (newConvo.group_img_url)
            clientSupabase.storage.from("chat").remove([newConvo.group_img_url.split("public/chat/")[1]]);

         setIsError(true);
         setIsLoading(false);
         return;
      }

      await clientSupabase.from("messages")
         .insert([{
            sender_id: userId,
            body: "Hi, I just created this chat.",
            conversation_id: newConvoId,
         }]);

      setIsLoading(false);
      push(`/user/conversation/${newConvoId}`);
   }

   useEffect(() => {
      if (!idsString) return;

      const ids = idsString.split(",");

      const promises: any = [];
      ids.forEach(id => promises.push(clientSupabase.from("users").select().eq("id", id)));

      Promise.all(promises).then(res => {
         res.map(userRes => {
            if (userRes.error) throw new Error("Something went wrong. Please refresh the page and try again.");

            setUsers(p => [...p, userRes.data[0]]);
         });
      });
   }, [idsString]);

   return <div className="absolute top-0 bottom-0 bg-bg-color w-[100%] px-5 py-20">
      <SimpleNav backPath="/user/conversation/add/members" header="Chat Info" />

      <div className="mt-20 mx-5">
         <form onSubmit={handleSubmit} className="pb-4 border-b-[1px] border-devider-line-color">
            <div className="flex flex-wrap gap-5 items-center px-2 py-4">

               <label htmlFor="image" className="w-[15%] rounded-md overflow-hidden aspect-square bg-devider-line-color cursor-pointer">
                  { img && <img src={URL.createObjectURL(img)} className="w-[100%] aspect-square object-cover" />}
                  <input
                     type="file"
                     id="image"
                     accept="image/jpg, image/jpeg, image/png"
                     hidden
                     onChange={e => setImg(e.target.files ? e.target.files[0] : null)}
                  />
               </label>

               <input required disabled={isLoading} type="text" name="name" placeholder="Chat Name..." className="w-[70%] py-1 px-2 bg-bg-color border-b-[1px] border-text-color outline-none disabled:border-b-0"/>

            </div>

            <div className="w-fit ml-auto">
               <button disabled={isLoading} type="submit" className="bg-btn-color hover:bg-btn-border-color px-2 py-1 mr-4 rounded-md disabled:opacity-70">Create Chat</button>
            </div>
         </form>
               
         { isError && <p>Something went wrong, Please refresh the page and try again.</p>}
         
         <ul className="px-2 py-4 border-t-[1px] border-devider-line-color">
            <h3>Members</h3>
            {
               users?.map(user => <li key={user.id} className="grid grid-cols-[85%_10%] gap-5 items-center py-3">

                  <UserListItem
                     id={user.id}
                     profile_img_url={user.profile_img_url}
                     user_name={user.user_name}
                     full_name={user.full_name}
                     isOwner={false}
                  />

                  <div>
                     {
                        user.id !== userId && <button
                           type="button"
                           onClick={() => setUsers(p => p.filter(f => f.id !== user.id))}
                           className=" w-[2rem] h-[2rem] aspect-square text-2xl text-red-color border-[1px] border-red-color rounded-full hover:bg-red-600/60 hover:text-white"
                        >-</button>
                     }
                  </div>

               </li>)
            }            
         </ul>
      </div>
   </div>
}