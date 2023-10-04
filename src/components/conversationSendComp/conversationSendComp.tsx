"use client";

import { BaseSyntheticEvent, useRef, useState, type Dispatch, type SetStateAction } from "react";

import { clientSupabase } from "@/utils/clientSupabase";

import SendIcon from "@/svgs/sendIcon";
import AttachmentIcon from "@/svgs/attachmentIcon";

type Props = {
   userId: string,
   conversationId: string,
   isDark: boolean,
   containerRef: HTMLDivElement | null,
   pathname: string,
   isMsgRefVisible: boolean,
   setMsgPlaceHolder: Dispatch<SetStateAction<{ body: string, file_url: string }[]>>,
   setIsError: (isError: boolean) => void,
}

export default function ConversationSendComp({ userId, conversationId, isDark, containerRef, isMsgRefVisible, setMsgPlaceHolder, setIsError, pathname }: Props) {

   const inputRef = useRef<HTMLTextAreaElement | null>(null);
   const [file, setFile] = useState<File | null>(null);
   const uploadFileRef = useRef<HTMLInputElement | null>(null);

   async function handleSendMessage(e: BaseSyntheticEvent) {
      e.preventDefault();

      if (!inputRef.current?.value.trim()) return;
      
      let path: null | string = null;

      setMsgPlaceHolder(p => [...p, { body: inputRef.current?.value.trim() ?? "", file_url: file ? URL.createObjectURL(file) : "" }]);

      if (containerRef)
         document.documentElement.scrollTo(0, containerRef.offsetHeight + 1000);
      
      if (file) {
         const response = await clientSupabase.storage.from("chat")
            .upload(`message_files/${Date.now()}-${file.name}`, file);

         if (response.error) {
            setIsError(true);
            return;
         }
         path = `https://mhlqhssqzsezzhgonlxp.supabase.co/storage/v1/object/public/chat/${response.data.path}`;
      }

      if (inputRef.current && inputRef.current.value.trim()) {
         const message: {
            body: string,
            sender_id: string,
            conversation_id: string,
            file_url?: string,
         } = {
            body: inputRef.current?.value.trim(),
            sender_id: userId,
            conversation_id: conversationId,
         }

         if (path) message.file_url = path;

         const response = await clientSupabase.from("messages").insert([message]);

         if (response.error) setIsError(true);
         
         setFile(null);
         inputRef.current.value = "";
      }
   }

   function handleFileChange(e: BaseSyntheticEvent) {
      if (e.target.files[0]) {
         setFile(e.target.files[0]);
      }
   }

   return <section
      className={`fixed bottom-0 p-4 pl-6 grid grid-cols-[8fr_1fr_1fr] items-center gap-5 ${
         pathname === "/user" ? "left-[100vw]" : "left-[0]"
      } w-[100vw] md:w-[calc(100vw-370px)] md:left-[370px] isolate bg-bg-color`}
   >
      <div className="relative">
      
         <button
            type="button"
            onClick={() => document.documentElement.scrollTo(0, containerRef ? containerRef.offsetHeight + 1000 : 0)}
            className={`${!isMsgRefVisible ? "opacity-100 -top-[200%] pointer-events-auto z-auto" : "opacity-0 -top-[100%] pointer-events-none -z-10"} transition-all p-2 bg-convo-header-text-color rounded-full absolute -top-[200%] -right-[30%]`}>
            <div className="w-5 h-5 relative">
               <div className="w-4 h-4 -pt-6 border-b-2 border-r-2 border-bg-color rotate-45 absolute -top-[2px] left-[1.7px]" />
            </div>
         </button>
         
         <div className={`w-[100%] bg-bg-color absolute ${file && file ? "bottom-11 opacity-1" : "bottom-4 opacity-0 pointer-events-none"} p-1 border-[1px] border-text-color rounded-md outline-none transition-all duration-300`}>
            {
               file && <div className={`grid ${
                  file.type === "image/jpg" ||
                  file.type === "image/jpeg" ||
                  file.type === "image/png" ? "grid-cols-[1fr_4fr_1fr]" : "grid-cols-[5fr_1fr]"} items-center gap-3`}
               >
                  {
                     file.type === "image/jpg" ||
                     file.type === "image/jpeg" ||
                     file.type === "image/png" && <img src={URL.createObjectURL(file)} alt="Your image" className="max-h-10 object-cover rounded-md border-[1px] border-devider-line-color"/>
                  }
                  <p>{file.name}</p>
                  <button type="button" className="relative ml-auto mr-1 p-2" onClick={() => {
                        setFile(null);
                        if (uploadFileRef.current) uploadFileRef.current.value = "";
                     }}
                  >
                     <div className="h-[1.5px] bg-text-color w-7 rotate-45 rounded-lg absolute"></div>
                     <div className="h-[1.5px] bg-text-color w-7 -rotate-45 rounded-lg"></div>
                  </button>
               </div>
            }
         </div>
         <textarea
            name="text"
            id="text"
            rows={1}
            ref={inputRef}
            className="w-[100%] bg-bg-color py-1 px-2 border-[1px] border-text-color rounded-md outline-none hover:border-convo-header-text-color focus:border-convo-header-text-color focus:border-2 resize-none no-scrollbar"
         />
      </div>
      <label htmlFor="file" className="mx-auto cursor-pointer">
         <AttachmentIcon isDark={isDark} width={30} />
         <input
            type="file"
            id="file"
            name="file"
            accept="image/jpg, image/jpeg, image/png"
            className="hidden"
            ref={uploadFileRef}
            onChange={handleFileChange}
         />
      </label>
      <button type="button" onClick={handleSendMessage} className="mx-auto">
         <SendIcon isDark={isDark} width={35} />
      </button>
   </section>
}