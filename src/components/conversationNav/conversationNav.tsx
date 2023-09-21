"use client";

import { useRouter } from "next/navigation";

import { Convo } from "@/providers/realtimeProvider";

import OptionsIcon from "@/components/optionsIcon/optionsIcon";
import ArrowIcon from "@/svgs/arrowIcon";
import Image from "next/image";

export default function ConversationNav({ conversation, isDark, pathname }: { conversation: Convo | undefined, isDark: boolean, pathname: string }) {

   const { push } = useRouter();

   return <nav
         className={`grid grid-cols-[1fr_8fr_1fr] gap-5 items-center justify-between px-4 fixed top-0 ${
            pathname === "/user" ? "left-[100vw]" : "left-[0]"
         } w-[100vw] md:w-[calc(100vw-370px)] md:left-[370px] bg-convo-header-bg-color text-convo-header-text-color h-[72px] isolate`}
      >
         <button type="button" onClick={() => push("/user")} className="pl-2">
            <ArrowIcon isDark={isDark} width={20} />
         </button>

         <div className="grid grid-cols-[1fr_5fr] items-center gap-3">
            <div className="aspect-square max-w-[50px] rounded-md overflow-hidden bg-devider-line-color">
               {conversation?.group_img_url && (
                  <Image
                     src={conversation.group_img_url}
                     alt={`${conversation.name} image`}
                     width={0}
                     height={0}
                     sizes="100vw"
                     style={{ width: "100%", height: "100%" }}
                     className="object-cover"
                  />
               )}
            </div>
            <h3 className="text-xl">{conversation?.name}</h3>
         </div>
         <OptionsIcon clickFunc={() => push(`/user/${conversation?.id}/info`)} />
      </nav>
}