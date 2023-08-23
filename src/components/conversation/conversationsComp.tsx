import Link from "next/link";

import type { Convo } from "@/providers/realtimeProvider";

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
      if (text.length > 17) return text.slice(15) + "...";
      return text;
   }

   return <section>
      {
         !conversations.length ? "No Conversations" : conversations.map(convo =>
            <Link href={`/user/conversation/${convo.id}`} key={convo.id} className="flex gap-3 p-2 border-t-2 border-b-2 border-black ">
               <div className="w-12 rounded-md bg-slate-800">
                  {convo.group_img_url && <img src={convo.group_img_url} alt="conversation image" />}
               </div>
               <div className="flex justify-between w-[80%]">
                  <div>
                     <h3 className="font-bold">{ convo.name }</h3>
                     <p className="text-black/70">{ convo.messages?.length ? deiplayShortMessage(convo.messages.at(-1)?.body) : "No messages" }</p>
                  </div>
                  {convo.messages?.length ? <div className="self-end">
                     {getUnreadMessages(convo.messages) !== 0 && <div className="p-1 bg-red-600 rounded-md">{getUnreadMessages(convo.messages)}</div> }
                     <div className="text-xs">
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
            </Link>)
      }
   </section>
}
