"use client";

import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
   useEffect,
   useMemo,
   useRef,
   useState,
   Fragment,
   type BaseSyntheticEvent,
} from "react";

import { useRealtime } from "@/providers/realtimeProvider";
import { clientSupabase } from "@/utils/clientSupabase";
import useTheme from "@/hooks/useTheme";

import Message from "@/components/messages/message";
import OptionsIcon from "@/components/optionsIcon/optionsIcon";
import ArrowIcon from "@/svgs/arrowIcon";
import SendIcon from "@/svgs/sendIcon";
import AttachmentIcon from "@/svgs/attachmentIcon";

export default function Conversation() {
   const { push } = useRouter();
   const pathname = usePathname();
   const conversationId = useParams().conversationId as string;

   const { isDark } = useTheme();

   const inputRef = useRef<HTMLInputElement>(null);
   const [file, setFile] = useState<File | null>(null);
   const [isError, setIsError] = useState(false);

   const containerRef = useRef<HTMLDivElement | null>(null);
   const fetchNumberRef = useRef(1);

   const { convos, setConvos, userId } = useRealtime();

   const conversation = useMemo(() => {
      return convos.find(conv => conv.id === conversationId);
   }, [convos, conversationId]);

   async function handleSendMessage(e: BaseSyntheticEvent) {
      e.preventDefault()

      let path: null | string = null;
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
         else inputRef.current.value = "";
      }
   }

   function handleFileChange(e: BaseSyntheticEvent) {
      if (e.target.files[0]) {
         setFile(e.target.files[0]);
      }
   }

   useEffect(() => {
      // check if there are 10 messages, then fetch more
      async function getMoreMessages() {
         clientSupabase.from("messages").select()
            .eq("conversation_id", conversationId)
            .order("created_at")
            .range(10 * fetchNumberRef.current, 50 * fetchNumberRef.current)
            .then(response => {
               if (response.error) return;
               if (response.data.length < 1) return;

               fetchNumberRef.current++;

               const updated = conversation?.messages;
               response.data.map(d => updated?.unshift(d));

               if (updated && updated.length > 0)
                  setConvos(convos.map(conv => {
                        if (conv.id === conversationId)
                           return { ...conv, messages: updated };
                        return conv;
                     }));
            });
      }

      if (conversation?.messages && (conversation?.messages?.length < 10 || conversation?.messages?.length % 50 === 0)) return;

      getMoreMessages();

      const observer = new IntersectionObserver(([entry]) => {
         if (entry.isIntersecting) {
            getMoreMessages();
         }
      });

      if (containerRef.current) observer.observe(containerRef.current);

      return () => {
         if (containerRef.current) observer.unobserve(containerRef.current);
      };

   }, [conversationId]);

   return <div>
      {/* nav section */}
      <nav
         className={`grid grid-cols-[1fr_8fr_1fr] gap-5 items-center justify-between px-4 fixed top-0 ${
            pathname === "/user" ? "left-[100vw]" : "left-[0]"
         } w-[100vw] md:w-[calc(100vw-370px)] md:left-[370px] bg-convo-header-bg-color text-convo-header-text-color h-[72px] isolate`}
      >
         <button type="button" onClick={() => push("/user")} className="pl-2">
            <ArrowIcon isDark={isDark} width={25} />
         </button>

         <div className="grid grid-cols-[1fr_5fr] items-center gap-3">
            <div className="aspect-square max-w-[50px] rounded-md overflow-hidden bg-devider-line-color">
               {conversation?.group_img_url && (
                  <Image
                     src={conversation.group_img_url}
                     alt={`${conversation.name} image`}
                     width={0}
                     height={0}
                     sizes="100vw"
                     style={{ width: "100%", height: "100%" }}
                     className="object-cover"
                  />
               )}
            </div>
            <h3 className="text-xl">{conversation?.name}</h3>
         </div>
         <OptionsIcon clickFunc={() => push(`/user/${conversationId}/info`)} />
      </nav>

      {/* Main messages section */}
      <main className="py-20 overflow-y-scroll no-scrollbar px-3 grid grid-cols-1">
         {conversation?.messages?.map((msg, i) => {
            const msgPlacement = conversation.messages && conversation.messages[i + 1] ? (msg.sender_id === conversation.messages[i + 1].sender_id &&
            Date.parse(conversation.messages[i + 1].created_at) - Date.parse(msg.created_at) < 120 ? "end" : "start") : "end";
            
            return !(msg.body || msg.file_url) ? null : <div key={i} className={`w-[100%] ${msg.sender_id !== userId && "grid grid-cols-[15%_83%] gap-2"}`}>
               {fetchNumberRef.current !== 1 && (i + 1) % fetchNumberRef.current === 0 && <div ref={containerRef}></div>}
               {
                  msg.sender_id !== userId && <div className="rounded-sm overflow-hidden w-[100%] aspect-square">
                     {
                        msgPlacement === "end" && <img src={conversation.users.find(u => u.id === msg.sender_id)?.profile_img_url ?? ""} className="object-cover" />
                     }
                  </div>
               }
               <Message
                  id={msg.id}
                  body={msg.body}
                  file_url={msg.file_url}
                  time={msg.created_at}
                  read_status={msg.read_status}
                  sender_id={msg.sender_id}
                  userId={userId}
                  msgPlacement={msgPlacement}
               />
            </div>;
         })}
      </main>

      {/* Textinput, send and attachment  */}
      <section
         className={`fixed bottom-0 p-4 pl-6 grid grid-cols-[8fr_1fr_1fr] items-center gap-5 ${
            pathname === "/user" ? "left-[100vw]" : "left-[0]"
         } w-[100vw] md:w-[calc(100vw-370px)] md:left-[370px] isolate bg-bg-color`}
      >
         <div className="relative">
            <div className={`w-[100%] absolute ${file && file ? "bottom-10 opacity-1" : "bottom-4 opacity-0"} p-1 border-[1px] border-text-color rounded-md outline-none transition-all duration-300`}>
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
                     <button type="button" className="relative ml-auto mr-2" onClick={() => setFile(null)}>
                        <div className="h-[2px] bg-text-color w-7 rotate-45 rounded-lg absolute"></div>
                        <div className="h-[2px] bg-text-color w-7 -rotate-45 rounded-lg"></div>
                     </button>
                  </div>
               }
            </div>
            <input
               type="text"
               className="w-[100%] bg-bg-color p-1 border-[1px] border-text-color rounded-md outline-none hover:border-convo-header-text-color focus:border-convo-header-text-color focus:border-2"
               ref={inputRef}
            />
         </div>
         <label htmlFor="file" className="mx-auto cursor-pointer">
            <AttachmentIcon isDark={isDark} width={30} />
            <input
               type="file"
               id="file"
               name="file"
               className="hidden"
               onChange={handleFileChange}
            />
         </label>
         <button type="button" onClick={handleSendMessage} className="mx-auto">
            <SendIcon isDark={isDark} width={35} />
         </button>
      </section>

   </div>
}