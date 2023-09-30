"use client";

import Link from "next/link";
import { useMemo, useState, useEffect, BaseSyntheticEvent } from "react";
import { useParams, useRouter } from "next/navigation";

import { clientSupabase } from "@/utils/clientSupabase";
import { useRealtime } from "@/providers/realtimeProvider";
import useTheme from "@/hooks/useTheme";

import SimpleNav from "@/components/simpleNav/simpleNav";
import ConfirmationModal from "@/components/confirmationModal/confirmationModal";
import ImageModal from "@/components/imageModal/imageModal";
import UserListItem from "@/components/userListItem/userListItem";
import TextInputEdit from "@/components/textInputEdit/textInputEdit";
import AddUserIcon from "@/svgs/addUserIcon";


export default function ConversationInfo() {

   const { convos, userId } = useRealtime();
   const { isDark } = useTheme();
   
   const conversationId = useParams().conversationId as string;
   const { push } = useRouter();

   const conversation = useMemo(() => {
      return convos.find(c => c.id === conversationId)
   }, [convos, conversationId]);

   const isOwner = useMemo(
      () => conversation?.users.find(u => u.id === userId)?.is_owner
      ,[conversation]
   );

   const [isError, setIsError] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   const [convoName, setConvoName] = useState("");

   const [isModalOpen, setIsModalOpen] = useState(false);
   const [modalType, setModalType] = useState<"delete" | "deleting" | "leave" | "leaving" | "kick" | "kicking">("delete");
   const [kickedUser, setKickedUser] = useState<{user_name: string, id: string} | null>();
   
   const [isImgModalOpen, setIsImgModalOpen] = useState(false);

   useEffect(() => {
      setConvoName(conversation?.name ?? "");
   }, [conversation]);

   function cancelFunc() {
      setIsModalOpen(false);
      setKickedUser(null);
   }

   async function handleRename() {
      if (!isOwner) return;
      if (convoName && convoName !== conversation?.name && convoName.trim()) {
         setIsLoading(true);
         const response = await clientSupabase.from("conversations")
            .update({
               name: convoName.trim(),
            }).eq("id", conversationId);
         
         if (response.error) {
            setIsError(true);
            setIsLoading(false);
            return;
         }
      }
      
      setIsLoading(false);
   }

   async function handleDeleteConvo() {

      setModalType("deleting");

      const imgsResonse = await clientSupabase.from("messages")
         .select("file_url").eq("conversation_id", conversationId);
      
      if (imgsResonse.error) {
         setIsError(true);
         setModalType("leave");
         return;
      }

      const response = await clientSupabase.from("conversations").delete().eq("id", conversationId);

      if (response.error) {
         setIsError(true);
         setModalType("delete");
         return;
      }

      if (conversation?.group_img_url)
         clientSupabase.storage.from("chat").remove([conversation?.group_img_url.split("https://mhlqhssqzsezzhgonlxp.supabase.co/storage/v1/object/public/chat/")[1]]);

      clientSupabase.storage.from("chat").remove([...imgsResonse.data.flatMap(m => m.file_url ?? [])]);

      setIsModalOpen(false);
      push("/user");
   }

   async function handleLeaveConvo() {
      
      setModalType("leaving");

      const imgsResonse = await clientSupabase.from("messages")
         .select("file_url").eq("conversation_id", conversationId).eq("sender_id", userId);

      if (imgsResonse.error) {
         setIsError(true);
         setModalType("leave");
         return;
      }

      const msgsResponse = await clientSupabase.from("messages")
         .delete().eq("conversation_id", conversationId).eq("sender_id", userId);
      
      if (msgsResponse.error) {
         setIsError(true);
         setModalType("leave");
         return;
      }

      const convoUserResponse = await clientSupabase.from("conversation_user")
         .delete().eq("conversation_id", conversationId).eq("user_id", userId);
      
      if (convoUserResponse.error) {
         setIsError(true);
         setModalType("leave");
         return;
      }

      clientSupabase.storage.from("chat").remove([...imgsResonse.data.flatMap(m => m.file_url ?? [])]);

      setIsModalOpen(false);
      push("/user");
   }

   async function handleKickMember() {
      
      setModalType("kicking");

      if (!(kickedUser?.id && kickedUser.user_name)) return;

      const imgsResonse = await clientSupabase.from("messages")
         .select("file_url").eq("conversation_id", conversationId).eq("sender_id", kickedUser.id);

      if (imgsResonse.error) {
         setIsError(true);
         setModalType("leave");
         return;
      }
      
      const msgsResponse = await clientSupabase.from("messages")
         .delete().eq("conversation_id", conversationId).eq("sender_id", kickedUser.id);
      
      if (msgsResponse.error) {
         setIsError(true);
         setModalType("leave");
         return;
      }

      const convoUserResponse = await clientSupabase.from("conversation_user")
         .delete().eq("conversation_id", conversationId).eq("user_id", kickedUser.id);
      
      if (convoUserResponse.error) {
         setIsError(true);
         setModalType("leave");
         return;
      }

      const imgExsist = imgsResonse.data.some(d => d.file_url ? true : false);
      if (imgExsist)
         clientSupabase.storage.from("chat").remove([...imgsResonse.data.flatMap(m => m.file_url ?? [])]);

      setIsModalOpen(false);
      setKickedUser(null);
   }

   async function uploadImage(e: BaseSyntheticEvent) {
      if (!conversationId) return;
      if (!e.target.files[0]) return;

      const uploadResponse = await clientSupabase.storage.from("chat")
         .upload(`group_images/${Date.now()}-${e.target.files[0].name}`, e.target.files[0]);
      
      if (uploadResponse.error) return;

      const imageURL = `https://mhlqhssqzsezzhgonlxp.supabase.co/storage/v1/object/public/chat/${uploadResponse.data.path}`;

      const updateResponse = await clientSupabase.from("conversations")
         .update({ group_img_url: imageURL }).eq("id", conversationId);
      
   }

   return <div className="absolute top-0 bottom-0 bg-bg-color w-[100%]">
      <SimpleNav backPath={`/user/conversation/${conversationId}`} />
      <div className="mt-20 mx-5">
         <section className="grid grid-cols-[15%_65%_15%] gap-5 items-center px-2 py-4 border-b-[1px] border-devider-line-color">
            {
               conversation?.group_img_url ? <button
                  type="button"
                  className="rounded-md overflow-hidden aspect-square bg-devider-line-color min-w-[50px] max-w-[65px]"
                  onClick={() => setIsImgModalOpen(true)}
               >
                  <img src={conversation?.group_img_url} alt={`${conversation.name} image`} className="w-[100%] aspect-square object-cover" />
               </button> : <label htmlFor="file" className="rounded-md overflow-hidden aspect-square bg-devider-line-color cursor-pointer">
                     <input
                        type="file"
                        id="file"
                        accept="image/jpg, image/jpeg, image/png"
                        hidden
                        onChange={uploadImage}
                     />
               </label>
            }

            <TextInputEdit
               isLoading={isLoading}
               isDark={isDark}
               isOwner={isOwner ?? false}
               textValue={convoName}
               setTextValue={setConvoName}
               handleEditSubmit={handleRename}
            />

         </section>

         <button
            type="button"
            className="flex items-center gap-4 w-[100%] p-2 my-2 group hover:gap-5 transition-all"
            onClick={() => {
               setModalType(isOwner ? "delete" : "leave");
               setIsModalOpen(true);
            }}
         >
            {isOwner ? <img src="/images/icons/icons8-delete.svg" alt="Delete icon" className="w-6 group-hover:scale-[1.2] transition-all"/> : null}
            <p>{isOwner ? "Delete Chat" : "Leave Chat"}</p>
         </button>
         
         <ul className="px-2 py-4 border-t-[1px] border-devider-line-color">
            <h3>Members</h3>
            {
               conversation?.users.map(user => <li key={user.id} className="grid grid-cols-[85%_10%] gap-5 items-center py-3">

                  <UserListItem 
                     id={user.id}
                     profile_img_url={user.profile_img_url}
                     user_name={user.user_name}
                     full_name={user.full_name}
                     isOwner={user.is_owner}
                  />

                  <div>
                     {
                        isOwner && user.id !== userId && <button
                           type="button"
                           onClick={() => {
                              setModalType("kick");
                              setKickedUser({ user_name: user.user_name, id: user.id });
                              setIsModalOpen(true);
                           }}
                           className=" w-[2rem] h-[2rem] aspect-square text-2xl text-red-color border-[1px] border-red-color rounded-full hover:bg-red-600/60 hover:text-white"
                        >-</button>
                     }
                  </div>

               </li>)
            }            
         </ul>

         <Link href={`/user/conversation/${conversationId}/info/add`} className="grid grid-cols-[15%_85%] gap-5 items-center py-2 border-t-[1px] border-devider-line-color">
            <div className="px-4 py-2 min-w-[40px] max-w-[70px]">
               <AddUserIcon width={45} />
            </div>
            <p>Add a member</p>
         </Link>

      </div>
      <ConfirmationModal 
         isOpen={isModalOpen}
         areBtnsDisabled={modalType.includes("ing")}
         mainText={
            modalType === "deleting" ? "Deleting chat..." : modalType === "leaving" ? "Leaving chat..." : modalType === "kicking" ? "Kicking user..." :
            modalType === "delete" ? "Do you really want to delete this chat? All messages will be deleted and members will be kicked." :
            modalType === "leave" ? "Are you sure you want to leave this chat? All your message will be deleted when you leave" :
            `Are you sure you want to kick ${kickedUser?.user_name}? All his messages will be deleted.`
         }
         confirmBtnText={modalType === "delete" ? "Delete" : modalType === "leave" ? "Leave" : "Kick"}
         confirmFunc={modalType === "delete" ? handleDeleteConvo : modalType === "leave" ? handleLeaveConvo : handleKickMember}
         cancelFunc={cancelFunc}
      />
      <ImageModal
         imgSrc={conversation?.group_img_url ?? ""}
         isOpen={isImgModalOpen}
         setIsOpen={setIsImgModalOpen}
         conversationId={isOwner ? conversationId : undefined}
      />
   </div>
}