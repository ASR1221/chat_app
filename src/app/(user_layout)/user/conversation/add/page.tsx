"use client";

import { useRealtime } from "@/providers/realtimeProvider";
import { clientSupabase } from "@/utils/clientSupabase";
import { useRouter } from "next/navigation";
import { type BaseSyntheticEvent, useState } from "react";

export default function AddConvo() {

   const [isError, setIsError] = useState(false);
   const { push } = useRouter();

   const { userId } = useRealtime();
   
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
            .upload(`profile_images/${Date.now()}-${e.target[0].files[0].name}`, e.target[0].files[0]);
         
         if (fileResponse.error) {
            setIsError(true);
            return;
         }

         info.imagePath = fileResponse.data?.path;
         const imageURL = `https://mhlqhssqzsezzhgonlxp.supabase.co/storage/v1/object/public/chat/${info.imagePath}`;

         const convoResponse = await clientSupabase.from("conversations")
            .insert([{
               name: e.target[1].value,
               group_img_url: info.imagePath ? imageURL : null,
            }]).select();
         
         // if error delete image
         if (convoResponse.error || !convoResponse.data[0].id) {
            if (info.imagePath)
               await clientSupabase
                  .storage
                  .from("chat")
                  .remove([info.imagePath]);
            
            setIsError(true);
            return;
         };

         info.convoId = convoResponse.data[0].id;

         // insert to conversation_user // TODO: should insert other users to
         const convoUserResponse = await clientSupabase.from("conversation_user")
            .insert([{
               user_id: userId,
               conversation_id: convoResponse.data[0].id,
               is_owner: true,
            }]);
               
         // if error delete image and conversation
         if (convoUserResponse.error) {
            if (info.imagePath)
               await clientSupabase
                  .storage
                  .from("chat")
                  .remove([info.imagePath]);
            
            await clientSupabase.from("conversations").delete().eq("id", convoResponse.data[0].id);
            
            setIsError(true);
            return;
         }

         push(`/user/conversation/${convoResponse.data[0].id}`);
         
      } catch (error) {
         if (info.imagePath)
            await clientSupabase
               .storage
               .from("chat")
               .remove([info.imagePath]);
         
         if (info.convoId)
            await clientSupabase.from("conversations").delete().eq("id", info.convoId);
      }      
   }

   return <form onSubmit={handleAddConvo}>
      <label htmlFor="image" >Image</label>
      <input type="file" name="image" accept="image/jpg, image/png, image/jpeg" />
      <label htmlFor="name">Name</label>
      <input type="text" name="name" />
      <button type="submit">Create</button>
      {/* diplay list of contacts here to add to the conversation */}

      <p>{ isError && "Something went wrong. Please, try again."}</p>
   </form>
}