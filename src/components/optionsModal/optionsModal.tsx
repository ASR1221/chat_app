"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OptionsModal({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) {
   
   const { back } = useRouter();

   useEffect(() => {
      function handleWindowClick(e: MouseEvent) {

         const x = e.target as HTMLElement;

         if ((x.id !== "ShowDialogBtn" && isOpen) && x.nodeName !== "DIALOG") {
            back();
         }
      }

      window.addEventListener("click", handleWindowClick);

      () => removeEventListener("click", handleWindowClick);

   }, [isOpen]);

   return <dialog open={isOpen}
      className="absolute left-8 top-9 m-0 px-2 border-2 border-black bg-white rounded-md rounded-ss-none backdrop:bg-black"
   >
      <ul>
         <li className="border-b-2 border-black/75 py-1 px-1 hover:bg-slate-100"><Link href="">Profile</Link></li>
         <li className="border-b-2 border-black/75 py-1 px-1 hover:bg-slate-100"><Link href="">Prefrences</Link></li>
         <li className="py-1 px-1 hover:bg-slate-100"><Link href="">Log Out</Link></li>
      </ul>
   </dialog>
}