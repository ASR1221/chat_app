import Image from "next/image";

export default function Message({
   id, body, file_url, time, read_status, sender_id, userId, isEnd
}: {
   id: string,
   body: string | null,
   file_url: string | null,
   time: string,
   read_status: boolean,
   sender_id: string,
   userId: string,
   isEnd: boolean
}) {

   return <div className={`${sender_id === userId ? "float-right bg-msg-own-bg-color" : "float-left bg-msg-other-bg-color"} 
      min-w-[15%] max-w-[70%] border-[1px] border-black rounded-lg overflow-hidden
      ${isEnd && sender_id === userId ? "rounded-ee-none" : isEnd && sender_id !== userId ? "rounded-se-none" : null}`}
   >
      {
         !file_url ? null : <div>
            <Image
               src={file_url}
               alt="message image"
               width={0}
               height={0}
               sizes="100vw"
               style={{ width: "100%", height: "100%" }}
            />
         </div>
      }
      {
         !body ? null : <p className="p-2 text-sm whitespace-pre-line">{ body }</p>
      }
      <div className={`${sender_id === userId && "grid grid-cols-[2fr_1fr]"} text-devider-line-color px-2 pb-[2px] text-xs`}>
         <p className="font-sans">
            {new Date(time).toLocaleTimeString(undefined, {
               hour: 'numeric',
               minute: '2-digit',
               hour12: true
            })}
         </p>
         
         {
            sender_id === userId && <p className="ml-auto font-sans">{read_status ? "seen" : "sent"}</p>
         }
      </div>
   </div>
}