"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Metadata } from "next";

import { useRealtime } from "@/providers/realtimeProvider";
import { clientSupabase } from "@/utils/clientSupabase";
import { User } from "@/types/supabaseTables";

import SimpleNav from "@/components/simpleNav/simpleNav";
import ImageModal from "@/components/imageModal/imageModal";

export const metadata: Metadata = {
   title: 'Chatty | Profile',
   description: 'A user profile',
};

export default function DUserProfile() {

   const dUserId = useParams().dUserId as string;
   const { push } = useRouter();

   const { userId, conts, setConts } = useRealtime();

   const [isImgOpen, setIsImgOpen] = useState(false);
   
   const [dUser, setDUser] = useState<Omit<User, "created_at"> | null>(null);
   const [isCont, setIsCont] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [isError, setIsError] = useState(false);

   async function handleAddToConts() {
      if (!dUser) return;

      setIsLoading(true);

      const contsResponse = await clientSupabase.from("user_contact").insert([{
         user_id: userId,
         contact_id: dUser.id,
      }]);

      if (contsResponse.error) {
         await clientSupabase.from("user_contact").delete().eq("user_id", userId).eq("contact_id", dUser.id);
         
         setIsError(true);
         setIsLoading(false);
         return;
      }

      setConts(p => [...p, { users: dUser }]);
      setIsLoading(false);
   }

   async function handleRemoveFromConts() {
      if (!dUser) return;

      setIsLoading(true);

      const contsResponse = await clientSupabase.from("user_contact").delete().eq("user_id", userId).eq("contact_id", dUser.id);

      if (contsResponse.error) {         
         setIsError(true);
         setIsLoading(false);
         return;
      }

      setConts(p => p.filter(f => f.users.id !== dUser.id));
      setIsLoading(false);
   }

   async function handleCreateChat() {
      if (!dUser) return;

      setIsLoading(true);
      const newConvoId = crypto.randomUUID();
      const newConvo: {
         id: string,
         name: string,
         group_img_url?: string,
      } = {
         id: newConvoId,
         name: dUser.user_name,
      };

      if (dUser.profile_img_url) newConvo.group_img_url = dUser.profile_img_url;

      const convoResponse = await clientSupabase.from("conversations").insert([newConvo]);

      if (convoResponse.error) {
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
         await clientSupabase.from("conversations").delete().eq("id", newConvoId);
         
         setIsError(true);
         setIsLoading(false);
         return;
      }

      const convoDUserResponse = await clientSupabase.from("conversation_user")
         .insert({
            user_id: dUser.id,
            conversation_id: newConvoId,
            is_owner: false,
         });
      
      if (convoDUserResponse.error) {
         await clientSupabase.from("conversation_user").delete().eq("id", newConvoId).eq("user_id", userId);
         await clientSupabase.from("conversations").delete().eq("id", newConvoId);
         
         setIsError(true);
         setIsLoading(false);
         return;
      }

      const MsgResponse = await clientSupabase.from("messages")
         .insert([{
            sender_id: userId,
            body: "Hi, I just created this chat.",
            conversation_id: newConvoId,
         }]);

      setIsLoading(false);
      push(`/user/conversation/${newConvoId}`);
   }

   useEffect(() => {
      clientSupabase.from("users").select("bio, full_name, id, last_seen, profile_img_url, user_name").eq("id", dUserId)
         .then(res => {
            if (res.error) throw new Error("Something went wrong. Please refresh the page");
            setDUser(res.data[0]);
            setIsCont(conts.find(c => c.users.id === res.data[0].id) ? true : false);
         });
   }, [dUserId])

   return <div className="absolute top-0 bottom-0 bg-bg-color w-[100%] overflow-y-scroll no-scrollbar">

      <SimpleNav />

      <div className="py-20 px-5 max-w-md mx-auto bg-bg-color">
         <div className="py-3">
            <button
               type="button"
               onClick={() => dUser?.profile_img_url ? setIsImgOpen(true) : {}}
               disabled={isLoading}
               className={`w-[100%] aspect-square bg-devider-line-color rounded-md overflow-hidden ${dUser?.profile_img_url ? "" : "cursor-default"}`}
            >
               {
                  dUser && dUser.profile_img_url &&
                  <Image
                     src={dUser.profile_img_url}
                     alt="Your profile image"
                     width={0}
                     height={0}
                     sizes="100vw"
                     style={{ width: "100%", height: "100%" }}
                     className="aspect-square object-cover"
                  />
               }
            </button>
         </div>

         <div className="grid grid-cols-1 gap-1 py-2">{
            dUser && <>
               <h2 className="text-4xl">@{dUser.user_name}</h2>
               <p>{dUser.full_name}</p>
               <p>{dUser.bio}</p>
            </>
         }</div>

         <div className="grid grid-cols-[2fr_3fr] gap-3 mx-auto pt-2">
            <button
               type="button"
               onClick={handleCreateChat}
               disabled={isLoading}
               className="p-1 bg-bg-color border-btn-color border-[1px] rounded-md hover:border-btn-border-color text-text-color text-center transition-all duration-300"
            >New Chat</button>
            <button
               type="button"
               disabled={isLoading}
               onClick={isCont ? handleRemoveFromConts : handleAddToConts}
               className={`p-1 ${isCont ? "bg-red-color hover:bg-red-700" : "bg-btn-color hover:bg-btn-border-color"} rounded-md text-white text-center transition-all duration-300`}
            >{isCont ? "Remove From Contacts" : "Add To Contacts"}</button>
         </div>

         <p>{isError && "Something went wrong. Please refresh the page and try again."}</p>
      </div>

      <ImageModal
         imgSrc={dUser?.profile_img_url ?? ""}
         isOpen={isImgOpen}
         setIsOpen={setIsImgOpen}
      />
   </div>
}