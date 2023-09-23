"use client";

import { useEffect, useRef, type BaseSyntheticEvent } from "react";

import { clientSupabase } from "@/utils/clientSupabase";
import useTheme from "@/hooks/useTheme";

import ArrowIcon from "@/svgs/arrowIcon";
import EditIcon from "@/svgs/editIcon";

type Props = {
   imgSrc: string,
   conversationId?: string,
   isOpen: boolean,
   setIsOpen: (isOpen: boolean) => void,
}

export default function ImageModal({ imgSrc, conversationId, isOpen, setIsOpen }: Props) {

   const { isDark } = useTheme();

   const dialogRef = useRef<HTMLDialogElement | null>(null);

   async function downloadImage() {
      const image = await fetch(imgSrc);
      const imageBlog = await image.blob();
      const imageURL = URL.createObjectURL(imageBlog);
    
      const link = document.createElement('a');
      link.href = imageURL;
      link.download = imgSrc.split("https://mhlqhssqzsezzhgonlxp.supabase.co/storage/v1/object/public/chat/group_images/")[1];
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
   }

   async function updateImage(e: BaseSyntheticEvent) {
      if (!conversationId) return;
      if (!e.target.files[0]) return;

      const uploadResponse = await clientSupabase.storage.from("chat")
         .upload(`group_images/${Date.now()}-${e.target.files[0].name}`, e.target.files[0]);
      
      if (uploadResponse.error) return;

      const imageURL = `https://mhlqhssqzsezzhgonlxp.supabase.co/storage/v1/object/public/chat/${uploadResponse.data.path}`;

      const updateResponse = await clientSupabase.from("conversations")
         .update({ group_img_url: imageURL }).eq("id", conversationId);
      
      if (updateResponse.error) return;

      await clientSupabase.storage.from("chat").remove([imgSrc.split("https://mhlqhssqzsezzhgonlxp.supabase.co/storage/v1/object/public/chat/")[1]]);

      setIsOpen(false);
   }

   async function removeImage() {
      if (!conversationId) return;
      
      const updateResponse = await clientSupabase.from("conversations")
         .update({ group_img_url: null }).eq("id", conversationId);
      
      if (updateResponse.error) return;

      await clientSupabase.storage.from("chat").remove([imgSrc.split("https://mhlqhssqzsezzhgonlxp.supabase.co/storage/v1/object/public/chat/")[1]]);

      setIsOpen(false);
   }

   useEffect(() => {

      if (!dialogRef.current) return;
      if (isOpen) {
         dialogRef.current.showModal();
         return;
      }
      dialogRef.current.close();

   }, [isOpen]);

   return <dialog ref={dialogRef} className="bg-transparent backdrop:bg-black/70 w-[90vw] max-w-xl overflow-hidden">
      <img src={imgSrc} className="max-w-xl max-h-[65vh]"/>

      <div className={`grid grid-cols-2 ${conversationId && "sm:grid-cols-4"} gap-3 mt-6`}>
         {
            conversationId && <>
               
               <button type="button" className="flex flex-col gap-2 justify-center items-center" onClick={removeImage}>
                  <div className="w-fit">
                     <img src="/images/icons/icons8-delete.svg" alt="Remove icon" />
                  </div>
                  <p className="text-white">Remove</p>
               </button>

               <label htmlFor="file" className="flex flex-col gap-2 justify-center items-center">
                  <div className="w-fit">
                     <EditIcon width={25} isDark={true}  />
                  </div>
                  <p className="text-white">Change</p>
                  <input
                     type="file"
                     id="file"
                     accept="image/jpg, image/jpeg, image/png"
                     hidden
                     onChange={updateImage}
                  />
               </label>

            </>
         }

         <button type="button" className="flex flex-col gap-3 justify-center items-center">
            <div className="border-l-2 border-white -rotate-90 w-fit px-2" onClick={downloadImage}>
               <ArrowIcon width={15} isDark={isDark} white={true} />
            </div>
            <p className="text-white">Download</p>
         </button>

         <button type="button" className="flex flex-col justify-center items-center" onClick={() => setIsOpen(false)}>
            <div className="rotate-45 text-4xl text-white w-fit">+</div>
            <p className="text-white -mt-1">Close</p>
         </button>

      </div>
   </dialog>
}