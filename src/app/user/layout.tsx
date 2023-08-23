"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";

import RealtimeProvider from "@/providers/realtimeProvider";
import OptionsModal from "@/components/optionsModal/optionsModal";

export default function UserLayout({ children }: { children: ReactNode }) {

   // handle dialog open and close
   const [isDialogOpen, setIsDialogOpen] = useState(false);

   function handleOpenDialog() {
      if (!isDialogOpen) {
         setIsDialogOpen(true);
         window.history.pushState("open", "");
      } else {
         setIsDialogOpen(false);
      }
   }

   useEffect(() => {
      function handlePopstate(e: PopStateEvent) {
         if (isDialogOpen) {
            setIsDialogOpen(false);
         }
      };

      window.addEventListener("popstate", handlePopstate);
  
      return () => {
         window.removeEventListener('popstate', handlePopstate);
      };

   }, [isDialogOpen]);


   return <>
      <RealtimeProvider>
         <nav className="flex justify-between p-3">
            {/* Complete this nav later */}
            <button id="ShowDialogBtn" onClick={handleOpenDialog}>Options</button>
            <p role="heading" aria-level={2} className="text-lg">App name</p>
            <Link href="" className={`${isDialogOpen && "pointer-events-none"}`}>search</Link>
         </nav>
         <OptionsModal isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
         <div className={`${isDialogOpen && "pointer-events-none"}`}>{children}</div>
      </RealtimeProvider>
   </>
}
