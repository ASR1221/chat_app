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
         const convoUserResponse = await clientSupabase.from("conversation_user")
            .insert({
               user_id: userId,
               conversation_id: info.convoId,
               is_owner: true,
            });
               
         // if error delete image and conversation
         if (convoUserResponse.error) {
            if (info.imagePath)
               await clientSupabase
                  .storage
                  .from("chat")
                  .remove([info.imagePath]);
            
            await clientSupabase.from("conversations").delete().eq("id", info.convoId);
            
            setIsError(true);
            return;
         }

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