"use client";

import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
   useEffect,
   useMemo,
   useRef,
   useState,
   type BaseSyntheticEvent,
   useLayoutEffect,
} from "react";

import { useRealtime } from "@/providers/realtimeProvider";
import { clientSupabase } from "@/utils/clientSupabase";
import useTheme from "@/hooks/useTheme";

import Message from "@/components/messages/message";
import OptionsIcon from "@/components/optionsIcon/optionsIcon";
import ArrowIcon from "@/svgs/arrowIcon";
import SendIcon from "@/svgs/sendIcon";
import AttachmentIcon from "@/svgs/attachmentIcon";
import useIsIntersecting from "@/hooks/useIsIntersecting";
import ConfirmationModal from "@/components/confirmationModal/confirmationModal";

export default function Conversation() {
   const { push } = useRouter();
   const pathname = usePathname();
   const conversationId = useParams().conversationId as string;

   const { isDark } = useTheme();

   const inputRef = useRef<HTMLInputElement>(null);
   const [file, setFile] = useState<File | null>(null);
   const [isError, setIsError] = useState(false);

   const [isModalOpen, setIsModalOpen] = useState(false);
   const [modalType, setModalType] = useState<"sending" | "resend" | "deleting" | "delete" | "delete error" >("delete");
   const deleteMsgIdRef = useRef("");
   const resendMsgDataRef = useRef<{ body: string, file_url: string } | null>(null);
   const [isDeleteVisibleId, setIsDeleteVisibleId] = useState<number | null>(null);

   const infiniteScrollRef = useRef<HTMLDivElement | null>(null);
   const msgScrollRef = useRef<HTMLDivElement | null>(null);
   const containerRef = useRef<HTMLDivElement | null>(null);
   const prevHeightRef = useRef(0);
   const isGetMessages = useRef(false);
   const isMsgRefVisible = useIsIntersecting(msgScrollRef, "20px");
   const isInfiniteRefVisible = useIsIntersecting(infiniteScrollRef, "20px");

   const { convos, setConvos, userId, msgPlaceHolder, setMsgPlaceHolder } = useRealtime();

   const conversation = useMemo(() => {
      return convos.find(conv => conv.id === conversationId);
   }, [convos, conversationId]);

   async function modalConfirmFunc() {
      if ((modalType === "delete" || modalType === "delete error") && deleteMsgIdRef.current) {
         setModalType("deleting");
         const message = conversation?.messages?.find(m => m.id === deleteMsgIdRef.current);
         if (message?.body) {
            const response = await clientSupabase.from("messages").delete().eq("id", deleteMsgIdRef.current);
            if (response.error) {
               setModalType("delete error");
               return;
            }
         }
         if (message?.file_url) {
            await clientSupabase.storage.from("chat").remove([message.file_url]);
         }
         
         deleteMsgIdRef.current = "";

      } else if (modalType === "resend" && resendMsgDataRef.current) {

         let path: null | string = null;
         const { body, file_url } = resendMsgDataRef.current;
         const file = URL.revokeObjectURL(file_url) as unknown as File;

         if (file && body) {
            setModalType("sending");
            const response = await clientSupabase.storage.from("chat")
               .upload(`message_files/${Date.now()}-${file.name}`, file);

            if (response.error) {
               setModalType("resend");
               return;
            }
            path = `https://mhlqhssqzsezzhgonlxp.supabase.co/storage/v1/object/public/chat/${response.data.path}`;
         }

         if (body) {
            const message: {
               body: string,
               sender_id: string,
               conversation_id: string,
               file_url?: string,
            } = {
               body: body,
               sender_id: userId,
               conversation_id: conversationId,
            }

            if (path) message.file_url = path;

            setModalType("sending");

            const response = await clientSupabase.from("messages").insert([message]);

            if (response.error) {
               setModalType("resend");
               return;
            }
            resendMsgDataRef.current = null;
         }
      }
      setIsModalOpen(false);
   }

   function modalCancelFunc() {
      setIsModalOpen(false);
      deleteMsgIdRef.current = "";
      setMsgPlaceHolder(msgPlaceHolder.filter(f => f.body !== resendMsgDataRef.current?.body || f.file_url !== resendMsgDataRef.current.file_url));
      resendMsgDataRef.current = null;
   }

   async function handleSendMessage(e: BaseSyntheticEvent) {
      e.preventDefault();

      let path: null | string = null;

      setMsgPlaceHolder(p => [...p, { body: inputRef.current?.value.trim() ?? "", file_url: file ? URL.createObjectURL(file) : "" }]);

      document.documentElement.scrollTo(0, document.documentElement.offsetHeight + 1000);
      
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
         
         inputRef.current.value = "";
      }
   }

   function handleFileChange(e: BaseSyntheticEvent) {
      if (e.target.files[0]) {
         setFile(e.target.files[0]);
      }
   }

   function getMoreMessages() {

      if (!conversation?.messages && !conversation?.messages?.length) return;
      if (conversation.messages.length === 15) {}
      else if (conversation.messages.length % 50 !== 0) return;

      isGetMessages.current = true;
      
      const from = conversation?.messages?.length === 15 ? 16 : (conversation?.messages?.length / 50) + 1;
      const to = conversation?.messages?.length === 15 ? 50 : (from + 49);

      clientSupabase.from("messages").select()
         .eq("conversation_id", conversationId)
         .order("created_at", { ascending: false })
         .range(from, to)
         .then(response => {
            if (response.error) return;

            if (response.data.length < 1) return;

            const updated = conversation?.messages;
            response.data.map(d => updated?.push(d));

            if (updated && updated.length > 0) {
               setConvos(convos.map(conv => {
                  if (conv.id === conversationId)
                     return { ...conv, messages: updated };
                  return conv;
               }));
            }
         });
   }

   useEffect(() => {

      if (!isInfiniteRefVisible) return;

      if (!containerRef.current) return;
      prevHeightRef.current = containerRef.current.offsetHeight;

      getMoreMessages();

   }, [conversationId, isInfiniteRefVisible]);

   // scroll to bottom on entering a convo
   const firstScroll = useRef(true);
   useLayoutEffect(() => {
      if (firstScroll.current && conversation?.messages) {
         window.scrollTo(0, document.documentElement.scrollHeight);
         firstScroll.current = false;
         return;
      }

      if (msgScrollRef.current && isMsgRefVisible) {
         document.documentElement.scrollTo(0, document.documentElement.offsetHeight + 1000);
         return;
      }

      if (!containerRef.current) return;
      if (isGetMessages.current) {
         window.scrollTo(0, containerRef.current.offsetHeight - prevHeightRef.current + 60);
         isGetMessages.current = false;
      }

   }, [convos]);


   return <div>
      {/* nav section */}
      <nav
         className={`grid grid-cols-[1fr_8fr_1fr] gap-5 items-center justify-between px-4 fixed top-0 ${
            pathname === "/user" ? "left-[100vw]" : "left-[0]"
         } w-[100vw] md:w-[calc(100vw-370px)] md:left-[370px] bg-convo-header-bg-color text-convo-header-text-color h-[72px] isolate`}
      >
         <button type="button" onClick={() => push("/user")} className="pl-2">
            <ArrowIcon isDark={isDark} width={20} />
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
      <main className="py-20 px-3 grid grid-cols-1" ref={containerRef}>
         <div ref={infiniteScrollRef} />
         {conversation?.messages?.map((msg, i) => {
            const isEnd = conversation.messages && conversation.messages[i - 1] ? !(msg.sender_id === conversation.messages[i - 1].sender_id &&
               Date.parse(conversation.messages[i - 1].created_at) - Date.parse(msg.created_at) < 120 * 1000) : true;
                        
            return !(msg.body || msg.file_url) ? null :
               <div
                  key={i}
                  onClick={() => setIsDeleteVisibleId(p => p === i ? null : i)}
                  style={{ order: conversation.messages?.length && conversation.messages?.length - i }}
                  className={`w-[100%] cursor-pointer ${isEnd ? "mb-[12px]" : "mb-[1px]"} ${(msg.sender_id !== userId || isDeleteVisibleId === i) ? "flex gap-4" : ""} ${isDeleteVisibleId === i && msg.sender_id === userId ? "justify-end" : ""}`}
               >
                  {
                     msg.sender_id !== userId && <div className="rounded-sm overflow-hidden w-14 aspect-square">
                        {
                           isEnd && <img src={conversation.users.find(u => u.id === msg.sender_id)?.profile_img_url ?? ""} className="object-cover" />
                        }
                     </div>
                  }
                  {
                     msg.sender_id === userId && isDeleteVisibleId === i && <button
                        type="button"
                        onClick={() => {
                           setModalType("delete");
                           deleteMsgIdRef.current = msg.id;
                           setIsModalOpen(true);
                        }}
                     >
                        <img src="/images/icons/icons8-delete.svg" alt="delete icon" />
                     </button>
                  }
                  <Message
                     id={msg.id}
                     body={msg.body}
                     file_url={msg.file_url}
                     time={msg.created_at}
                     read_status={msg.read_status}
                     sender_id={msg.sender_id}
                     userId={userId}
                     isEnd={isEnd}
                  />
               </div>;
         })}
         {
            msgPlaceHolder && msgPlaceHolder.length > 0 && msgPlaceHolder.map((msg, i) => <div key={i} className="w-[100%]" style={{order: 9999900 + i}}>
               <div
                  onClick={() => {
                     if (isError) {
                        setModalType("resend");
                        resendMsgDataRef.current = msg;
                        setIsModalOpen(true);
                     }
                  }}
                  className={`opacity-50 float-right bg-msg-own-bg-color min-w-[15%] max-w-[70%] border-[1px] ${isError ? "border-red-color" : "border-black"} rounded-lg overflow-hidden mb-3`}
               >
                     {
                        !msg.file_url ? null : <div>
                           <Image
                              src={msg.file_url}
                              alt="message image"
                              width={0}
                              height={0}
                              sizes="100vw"
                              style={{ width: "100%", height: "100%" }}
                           />
                        </div>
                     }
                     {
                        !msg.body ? null : <p className="p-1 text-sm">{ msg.body }</p>
                     }
                  </div>
               </div>
            )
         }
         <div ref={msgScrollRef} style={{order: 100000000}} className="mb-4" />
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
               className="w-[100%] bg-bg-color py-1 px-2 border-[1px] border-text-color rounded-md outline-none hover:border-convo-header-text-color focus:border-convo-header-text-color focus:border-2"
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
      <ConfirmationModal
         isOpen={isModalOpen}
         mainText={modalType === "deleting" ? "Deleting..." : modalType === "sending" ? "Sending..." : modalType === "delete" ? "Do you want to delete this message?" : modalType === "delete error" ? "Error deleting message. Try deleting it again?" : "Message send failed. Try sending it again?"}
         confirmBtnText={modalType.includes("delet") ? "Delete" : "Send"}
         areBtnsDisabled={modalType.includes("ing")}
         confirmFunc={modalConfirmFunc}
         cancelFunc={modalCancelFunc}
      />
   </div>
}