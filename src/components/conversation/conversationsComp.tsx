import { serverSupabase } from "@/utils/serverSupabase";

export default async function ConversationsComp({
   userId,
}: {
   userId: string;
}) {
   try {
      
      // get all convo of  a user
      const response = await serverSupabase
         .from("users")
         .select(`
            user_name,
            full_name,
            bio,
            profile_img_url,
            conversations!conversation_user (
               id,
               name,
               owner_id,
               group_img_url,
               users!conversation_user (
                  id,
                  user_name
               )
            )
         `)
         .eq("id", userId);

      if (!response.data) return <div>Some error happend. Please refresh the page.</div>;

      // get the last message of every convo
      const promises = response.data[0].conversations.map((conv) =>
         serverSupabase
            .from("messages")
            .select()
            .eq("conversation_id", conv.id)
            .order("created_at", { ascending: false })
            .limit(1)
      );

      const response2 = await Promise.all(promises);

      const final = response.data[0].conversations.map(
         (conv, i) => response2[i].data
      );

      return <div>{/* conversations here*/}</div>;
   } catch (e) {
      return <div>Some error happend. Please refresh the page.</div>;
   }
}
