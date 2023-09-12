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
      className="absolute left-8 top-9 m-0 py-1 px-2 bg-bg-color text-text-color rounded-md rounded-ss-none backdrop:bg-black/50"
   >
      <ul>
         <li className="border-b-[1px] border-devider-line-color py-1 px-1 hover:bg-slate-100">
            <Link href="/user/profile" className="text-text-color">Profile</Link>
         </li>
         <li className="border-b-[1px] border-devider-line-color py-1 px-1 hover:bg-slate-100">
            <Link href="/user/prefrences"  className="text-text-color">Prefrences</Link>
         </li>
         <li className="py-1 px-1 hover:bg-slate-100">
            <button onClick={handleSignOut}  className="text-red-color">Log Out</button>
         </li>
      </ul>
   </dialog>
}