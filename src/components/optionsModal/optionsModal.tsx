"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { clientSupabase } from "@/utils/clientSupabase";

export default function OptionsModal() {
   
   const { push } = useRouter();
   const optionsParam = useSearchParams();
   const mRef = useRef<HTMLDialogElement | null>(null);

   async function handleSignOut() {
      const response = await clientSupabase.auth.signOut();
      if (response.error) throw new Error("We could not sign you out. Please try again"); // TODO: should display error better
      push("/");
   }

   useEffect(() => {

      if (optionsParam.get("options") === "true") mRef.current?.showModal();
      else mRef.current?.close();

      function handleWindowClick(e: MouseEvent) {

         const x = e.target as HTMLElement;

         if (x.childNodes[0].nodeName === "UL") {
            push("/user");
         }
      }

      window.addEventListener("click", handleWindowClick);

      () => removeEventListener("click", handleWindowClick);

   }, [optionsParam]);

   return <dialog /* open={isOpen} */ ref={mRef}
      className="absolute left-8 top-9 m-0 px-2 border-2 border-black bg-white rounded-md rounded-ss-none backdrop:bg-black/50"
   >
      <ul>
         <li className="border-b-2 border-black/75 py-1 px-1 hover:bg-slate-100"><Link href="/user/profile">Profile</Link></li>
         <li className="border-b-2 border-black/75 py-1 px-1 hover:bg-slate-100"><Link href="/user/prefrences">Prefrences</Link></li>
         <li className="py-1 px-1 hover:bg-slate-100"><button onClick={handleSignOut}>Log Out</button></li>
      </ul>
   </dialog>
}