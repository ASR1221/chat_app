"use client";

import { useState } from "react";

import EditIcon from "@/svgs/editIcon"

type Props = {
   isLoading: boolean,
   isDark: boolean,
   isOwner: boolean,
   textValue: string,
   setTextValue: (text: string) => void,
   handleEditSubmit: () => void,
}

export default function TextInputEdit({ isLoading, isDark, isOwner, textValue, setTextValue, handleEditSubmit}: Props) {
   
   const [isEditing, setIsEditing] = useState(false);

   return <>
      <input
         type="text"
         className="py-1 px-2 bg-bg-color border-b-[1px] border-text-color outline-none disabled:border-b-0"
         disabled={!isEditing || isLoading}
         value={textValue}
         onChange={(e) => setTextValue(e.target.value)}
      />

      {isOwner && <button
         type="button"
         onClick={isEditing ? () => { handleEditSubmit(); setIsEditing(false); } : () => setIsEditing(p => !p)}
         disabled={isLoading}
         className="ml-3 p-1"
      >
         {
            isEditing ? <div className="relative">
               <div className="h-[2px] w-4 rotate-45 bg-green-color absolute -left-2 top-1" />
               <div className="h-[2px] w-7 -rotate-45 bg-green-color" />
            </div> : <EditIcon width={25} isDark={isDark} />
         }
      </button>}
   </>
}