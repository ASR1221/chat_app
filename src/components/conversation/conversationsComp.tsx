import Link from "next/link";

import type { Convo } from "@/providers/realtimeProvider";
import Image from "next/image";

export default function ConversationsComp({ conversations, userId }: { conversations: Convo[], userId: string }) { 


   function getUnreadMessages(messages: Convo["messages"]) {
      let unread = 0;

      messages?.forEach(message => {
         if (!message.read_status && message.sender_id !== userId) unread++;
      });

      return unread;
   }

   function deiplayShortMessage(text: string | null | undefined) {
      if (!text) return "No message";
      if (text.length > 23) return text.slice(0, 20) + "...";
      return text;
   }

   return <section className="[&>*:not(:last-child)]:border-b-[1px] [&>*]:border-devider-line-color">
      {
         !conversations.length ? "No Conversations" : conversations.map(convo =>
            <Link
               href={`/user/conversation/${convo.id}`}
               key={convo.id}
               className="grid grid-cols-[1fr_5fr_2fr] items-center gap-4 py-3 max-h-20"
            >

               <div className="aspect-square max-w-[55px] min-w-[50px] rounded-md border-2 border-devider-line-color">
                  {convo.group_img_url && <Image
                     src={convo.group_img_url}
                     alt="conversation image"
                     width={0} height={0}
                     sizes="100vw"
                     style={{ width: '100%', height: 'auto' }}
                  />}
               </div>

               <div className="grid grid-cols-1 items-center">
                  <div>
                     <h3 className="text-lg">{ convo.name }</h3>
                     <p className="text-text-color">{ convo.messages?.length ? deiplayShortMessage(convo.messages.at(0)?.body) : "No messages" }</p>
                  </div>
               </div>
               <div className="grid grid-cols-1 items-center">
                  {convo.messages?.length ? <div>
                     {getUnreadMessages(convo.messages) !== 0 && <div className="p-1 aspect-square bg-red-color rounded-full">{getUnreadMessages(convo.messages)}</div> }
                     <div className="text-sm text-text-color/70">
                        { convo.messages.at(-1)?.sender_id === userId && <p>Sent</p>}
                        <p>{new Date(convo.messages.at(-1)?.created_at ?? "")
                           .toLocaleTimeString(undefined, {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                           })
                        }</p>
                     </div>
                  </div> : null}
               </div>

            </Link>
         )
      }
   </section>
}
