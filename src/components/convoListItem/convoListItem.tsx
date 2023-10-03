import Image from "next/image";
import Link from "next/link";

import { Convo } from "@/providers/realtimeProvider";

export default function ConvoListItem({ convo, userId }: { convo: Convo, userId: string, }) {

   function deiplayShortMessage(text: string | null | undefined) {
      if (!text) return "No message";
      if (text.length > 23) return text.slice(0, 20) + "...";
      return text;
   }

   return <div className="relative">
      <Link
         href={`/user/conversation/${convo.id}`}
         key={convo.id}
         className="grid grid-cols-[1fr_5fr_2fr] items-center gap-4 py-3 max-h-20"
      >

         <div className="aspect-square overflow-hidden max-w-[55px] min-w-[50px] rounded-md border-2 border-devider-line-color">
            {convo.group_img_url && <Image
               src={convo.group_img_url}
               alt="conversation image"
               width={0} height={0}
               sizes="100vw"
               style={{ width: '100%', height: '100%' }}
               className="aspect-sqare object-cover"
            />}
         </div>

         <div className="grid grid-cols-1 items-center">
            <div>
               <h3 className="text-lg">{ convo.name }</h3>
               <p className="text-text-color">{ convo.messages?.length ? deiplayShortMessage(convo.messages.at(0)?.body) : "No messages" }</p>
            </div>
         </div>
         {convo.messages?.length ? <div>
            <div className="text-sm text-text-color/70">
               { convo.messages.at(-1)?.sender_id === userId && <p>Sent</p>}
               <p>{new Date(convo.messages.at(0)?.created_at ?? "")
                  .toLocaleTimeString(undefined, {
                     hour: 'numeric',
                     minute: '2-digit',
                     hour12: true
                  })
               }</p>
            </div>
         </div> : null}
            

      </Link>
      {
         convo.newMsgCount > 0 && <div className="w-6 aspect-square rounded-full p-[1px] grid items-center bg-red-color absolute top-1/2 -translate-y-1/2 left-[65%]">
            <p className="text-white text-center text-sm">{convo.newMsgCount}</p>
         </div>
      }
   </div>
}