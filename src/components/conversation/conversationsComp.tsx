import type { Convo } from "@/providers/realtimeProvider";

export default async function ConversationsComp({ conversations, userId }: { conversations: Convo[], userId: string }) { 


   function getUnreadMessages(messages: Convo["messages"]) {
      let unread = 0;

      messages?.forEach(message => {
         if (!message.read_status && message.sender_id !== userId) unread++;
      });

      return unread;
   }

   return <section>
      {
         conversations.length ? "No Conversations" : conversations.map(convo => <div key={convo.id}>
            <div>
               {convo.group_img_url && <img src={convo.group_img_url} alt="conversation image" />}
            </div>
            <div>
               <div>
                  <h3>{ convo.name }</h3>
                  <p>{ convo.messages && convo.messages[-1].body  }</p>
               </div>
               <div>
                  <div>{ convo.messages && getUnreadMessages(convo.messages) && getUnreadMessages(convo.messages) }</div>
                  <p>
                     {convo.messages && convo.messages[-1].sender_id === userId && <span>Sent</span>}
                     {convo.messages && new Date(convo.messages[-1].created_at).toLocaleString()}
                  </p>
               </div>
            </div>
         </div>)
      }
   </section>
}
