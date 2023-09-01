"use client";

import { useMemo } from "react";

import { useRealtime } from "@/providers/realtimeProvider";
import { useParams } from "next/navigation";

export default function ConversationInfo() {

   const { convos } = useRealtime();
   
   const conversationId = useParams().conversationId as string;

   const conversation = useMemo(() => {
      return convos.find(c => c.id === conversationId)
   }, [convos, conversationId]);

   return <div>
      <div>
         {conversation?.group_img_url && <img src={conversation?.group_img_url} alt={`${conversation.name} image`} />}
      </div>

      <p>{ conversation?.name }</p>

      <div>
         {
            conversation?.users.map(user => <div key={user.id}>
               <div>
                  {user.profile_img_url && <img src={user.profile_img_url} alt={`${user.user_name} profile image`} />}
               </div>
               <div>
                  <p>{user.user_name}</p>
                  <p>{user.is_owner[0].is_owner ? "owner" : "member"}</p>
               </div>
            </div>)
         }
      </div>
   </div>
}