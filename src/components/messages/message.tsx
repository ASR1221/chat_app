"use client";

import Image from "next/image";
import { useState } from "react";

import ImageModal from "../imageModal/imageModal";

type Props = {
   id: string,
   body: string | null,
   file_url: string | null,
   time: string,
   read_status: string,
   sender_id: string,
   userId: string,
   isEnd: boolean
}

export default function Message({ id, body, file_url, time, read_status, sender_id, userId, isEnd }: Props) {
   
   const [isOpen, setIsOpen] = useState(false);

   return <div className={`${sender_id === userId ? "float-right bg-msg-own-bg-color" : "float-left bg-msg-other-bg-color"} 
      min-w-[100px] border-[1px] border-black rounded-lg overflow-hidden
      ${isEnd && sender_id === userId ? "rounded-ee-none" : isEnd && sender_id !== userId ? "rounded-es-none" : null}
      ${file_url ? "max-w-[65vw] md:max-w-[35vw] lg:max-w-[45vw]" : "max-w-[70%]"}`}
   >
      {
         !file_url ? null : <div role="button" onClick={() => setIsOpen(true)}>
            <Image
               src={file_url}
               alt="message image"
               width={0}
               height={0}
               sizes="100vw"
               style={{ width: "100%", height: "100%" }}
               className="max-w-[65vw] md:max-w-[35vw] lg:max-w-[45vw]"
            />
         </div>
      }
      {
         !body ? null : <p className="p-2 text-sm whitespace-pre-line">{ body }</p>
      }
      <div className={`${sender_id === userId ? "grid grid-cols-[2fr_1fr]" : ""} text-devider-line-color px-2 pb-[2px] text-xs`}>
         <p className={`font-sans w-fit ${sender_id === userId ? "" : "ml-auto"} pb-[2px]`}>
            {new Date(time).toLocaleTimeString(undefined, {
               hour: 'numeric',
               minute: '2-digit',
               hour12: true
            })}
         </p>
         
         {
            sender_id === userId && <p className="ml-auto font-sans">{read_status.length > 0 ? "seen" : "sent"}</p>
         }
      </div>

      <ImageModal
         imgSrc={file_url ?? ""}
         isOpen={isOpen}
         setIsOpen={setIsOpen}
      />
   </div>
}