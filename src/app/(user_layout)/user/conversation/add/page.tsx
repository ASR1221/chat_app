"use client";

import { useRealtime } from "@/providers/realtimeProvider";
import { User } from "@/types/supabaseTables";
import { clientSupabase } from "@/utils/clientSupabase";
import { useRouter } from "next/navigation";
import { type BaseSyntheticEvent, useState } from "react";

export default function AddConvo() {

   const [convoUsers, setConvoUsers] = useState<{users: Omit<User, "created_at">}[]>([]);
   const [isError, setIsError] = useState(false);
   const { push } = useRouter();

   const { userId, conts } = useRealtime();

   function handleCheckedContact(e: BaseSyntheticEvent, user: Omit<User, "created_at">) {
      if (e.target.checked) setConvoUsers(p => ([...p, { users: user }]));
      else setConvoUsers(p => p.filter(o => o.users.id !== user.id));
   }
   
   // TODO: should accept (name, image to conversations), (users, owner and conversation ids to conversation_user)
   async function handleAddConvo(e: BaseSyntheticEvent) {
      e.preventDefault();

      setIsError(false);
      let info = {
         imagePath: "",
         convoId: "",
      };

      try {
         
         const fileResponse = await clientSupabase.storage.from("chat")
            .upload(`group_images/${Date.now()}-${e.target[0].files[0].name}`, e.target[0].files[0]);
         
         if (fileResponse.error) {
            setIsError(true);
            return;
         }

         info.imagePath = fileResponse.data?.path;
         const imageURL = `https://mhlqhssqzsezzhgonlxp.supabase.co/storage/v1/object/public/chat/${info.imagePath}`;
         info.convoId = crypto.randomUUID();

         const convoResponse = await clientSupabase.from("conversations")
            .insert({
               id: info.convoId,
               name: e.target[1].value,
               group_img_url: info.imagePath ? imageURL : null,
            });
         
         // if error delete image
         if (convoResponse.error) {
            if (info.imagePath)
               await clientSupabase
                  .storage
                  .from("chat")
                  .remove([info.imagePath]);
            
            setIsError(true);
            return;
         };

         // insert to conversation_user // TODO: should insert other users to
         const convoOwnerResponse = await clientSupabase.from("conversation_user")
            .insert({
               user_id: userId,
               conversation_id: info.convoId,
               is_owner: true,
            });
               
         // if error delete image and conversation
         if (convoOwnerResponse.error) {
            if (info.imagePath)
               await clientSupabase
                  .storage
                  .from("chat")
                  .remove([info.imagePath]);
            
            await clientSupabase.from("conversations").delete().eq("id", info.convoId);
            
            setIsError(true);
            return;
         }

         const promises = convoUsers.map(user =>
            clientSupabase.from("conversation_user")
               .insert({
                  user_id: user.users.id,
                  conversation_id: info.convoId,
                  is_owner: false,
               })
         );

         await Promise.all(promises);

         push(`/user/conversation/${info.convoId}`);
         
      } catch (error) {
         setIsError(true);
         if (info.imagePath)
            await clientSupabase
               .storage
               .from("chat")
               .remove([info.imagePath]);
         
         if (info.convoId)
            await clientSupabase.from("conversations").delete().eq("id", info.convoId);
      }      
   }
   console.log(convoUsers)
   return <form onSubmit={handleAddConvo}>
      <label htmlFor="image" >Image</label>
      <input type="file" name="image" accept="image/jpg, image/png, image/jpeg" />
      <label htmlFor="name">Name</label>
      <input type="text" name="name" className="p-1 border-2 border-black" />
      <button type="submit" className="p-1 border-2 border-black" >Create</button>

      <p>{ isError && "Something went wrong. Please, try again."}</p>

      <div>
         {conts && conts.length > 0 && conts.map(c => {
            const cont = c as unknown as {users: Omit<User, "created_at">}

            return <div key={cont.users.id}>
               <div>
                  <input type="checkbox" name="selected" onChange={(e) => handleCheckedContact(e, cont.users)} />
               </div>
               <div>
                  {cont.users.profile_img_url && <img src={cont.users.profile_img_url} alt={`${cont.users.user_name} profile image`} />}
               </div>
               <div>
                  <p>{cont.users.full_name}</p>
                  <p>{cont.users.user_name}</p>
               </div>
            </div>
         })}
      </div>
   </form>
}