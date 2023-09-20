"use client";

import { useEffect, useRef } from "react";

type Props = {
   isOpen: boolean,
   areBtnsDisabled: boolean,
   mainText: string,
   confirmBtnText: string,
   cancelFunc: () => void,
   confirmFunc: () => void,
}

export default function ConfirmationModal({ isOpen, mainText, confirmBtnText, confirmFunc, cancelFunc, areBtnsDisabled }: Props) {

   const dialogRef = useRef<HTMLDialogElement | null>(null);

   useEffect(() => {

      if (!dialogRef.current) return;
      if (isOpen) {
         dialogRef.current.showModal();
         setTimeout(() => {
            if (dialogRef.current) {
               dialogRef.current.style.opacity = "1";
               dialogRef.current.style.scale = "1";
            }
         }, 0);
         return;
      }
      dialogRef.current.style.opacity = "0";
      dialogRef.current.style.scale = "0.8";
      setTimeout(() => {
         if (dialogRef.current) {
            dialogRef.current.close();
         }
      }, 290);

   }, [isOpen]);

   return <dialog ref={dialogRef} className={`p-5 opacity-0 w-60 bg-bg-color transition-all duration-300 rounded-md`}>
      <p className="p-5">{mainText}</p>
      <div className="grid grid-cols-2 gap-5 pb-3">
         <button
            type="button"
            disabled={areBtnsDisabled}
            onClick={cancelFunc}
            className="px-2 py-1 text-text-color rounded-md border-[1px] border-text-color hover:border-btn-color"
         >Cancel</button>
         <button
            type="button"
            disabled={areBtnsDisabled}
            onClick={confirmFunc}
            className={`${confirmBtnText === "Delete" ? "bg-red-color hover:bg-red-700" : confirmBtnText === "Save" ? "bg-green-color hover:bg-green-700" : "bg-btn-color hover:bg-btn-border-color" } px-2 py-1 rounded-md`}
         >{confirmBtnText}</button>
      </div>
   </dialog>
}