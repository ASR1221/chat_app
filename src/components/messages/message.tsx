import Image from "next/image";

export default function Message({
   id, body, file_url, time, read_status, sender_id, userId
}: {
   id: string,
   body: string | null,
   file_url: string | null,
   time: string,
   read_status: boolean,
   sender_id: string,
   userId: string,
}) {


   return <div key={id} className={`${sender_id === userId && "float-right"} border-2 border-black rounded-lg ${sender_id === userId ? "rounded-se-none" : "rounded-ss-none"} w-fit max-w-[70%]`}>
      {
         !file_url ? null : <div>
            <Image src={file_url} alt="message image" />
         </div>
      }
      {
         !body ? null : <p>{ body }</p>
      }
      {
         (body || file_url) && <p>{new Date(time).toLocaleTimeString(undefined, {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
         })}</p>
      }
      {
         (body || file_url) && sender_id === userId && <p>{read_status ? "seen" : "sent"}</p>
      }
   </div>
}