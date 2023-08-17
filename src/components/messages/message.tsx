import Image from "next/image";

export default function Message({ text, imageURL }: { text: string, imageURL: string}) {


   return <div>
      {
         !imageURL ? null : <div>
            <Image src={imageURL} alt="message image" />
         </div>
      }
      {
         !text ? null : <p>{ text }</p>
      }
   </div>
}