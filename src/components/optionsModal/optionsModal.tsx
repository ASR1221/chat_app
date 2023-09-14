"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useMemo } from "react";

import { clientSupabase } from "@/utils/clientSupabase";
import useTheme from "@/hooks/useTheme";

export default function OptionsModal() {
   
   const { push } = useRouter();

   const optionsParam = useSearchParams();
   const mRef = useRef<HTMLDialogElement | null>(null);
   
   const [isThemeOpen, setIsthemeOpen] = useState(false);
   const { isDark, themeType, setTheme } = useTheme();
   
   const [isLangOpen, setIsLangOpen] = useState(false);

   async function handleSignOut() {
      const response = await clientSupabase.auth.signOut();
      if (response.error) throw new Error("We could not sign you out. Please try again"); // TODO: should display error better
      push("/");
   }

   function handleCloseTheme() {
      setIsthemeOpen(p => {
         if (p)
            mRef.current?.children[0].setAttribute("style", "height: 110px; width: 120px; padding-block: 5px");
         else
            mRef.current?.children[0].setAttribute("style", "height: 230px; width: 120px; padding-block: 5px");
         return !p;
      });
   }

   useEffect(() => {

      if (optionsParam.get("options") === "true") {
         mRef.current?.showModal();
         if (mRef.current)
            mRef.current.children[0].setAttribute("style", "height: 110px; width: 120px; padding-block: 5px");
      }
      else {
         if (mRef.current)
            mRef.current.children[0].setAttribute("style", "height: 0px; width: 0px; padding-block: 0px");
         
         setTimeout(() => {
            mRef.current?.close();
            setIsthemeOpen(false);
            setIsLangOpen(false);
         }, 160);
      }

      function handleWindowClick(e: MouseEvent) {

         const x = e.target as HTMLElement;

         if (x.childNodes[0].nodeName === "UL") {
            push("/user");
         }
      }

      window.addEventListener("click", handleWindowClick);

      () => removeEventListener("click", handleWindowClick);

   }, [optionsParam]);

   return <dialog ref={mRef}
      className="absolute left-8 top-9 m-0 px-2 bg-bg-color text-text-color rounded-xl rounded-ss-none backdrop:bg-black/50"
   >
      <ul className="overflow-hidden transition-[width_height_padding] ease-linear" style={{ height: "0px", width: "0px" }}>
         
         <li className={`border-b-[1px] border-devider-line-color py-1 px-1 hover:bg-gray-${isDark ? "6" : "3"}00`}>
            <Link href="/user/profile" className="text-text-color">Profile</Link>
         </li>

         <li className="border-b-[1px] border-devider-line-color">
            <button
               type="button"
               className={`w-[100%] py-1 px-1 text-left text-text-color hover:bg-gray-${isDark ? "6" : "3"}00`}
               onClick={handleCloseTheme}
            >Theme
               <span className="w-fit float-right">{isThemeOpen ? "-" : "+"}</span>
            </button>
            
            {
               <section className={`${isThemeOpen ? "h-[120px]" : "h-[0]"} overflow-hidden transition-[height] ease-linear`}>

                  <button type="button" onClick={() => setTheme("light")} className="grid grid-cols-[1fr_2fr_4fr] items-center gap-2 p-2 cursor-pointer group">
                     <div className={`aspect-square rounded-full bg-text-color opacity-${themeType === 0 ? "1" : "0"}`}></div>
                     <div className="aspect-square rounded-sm bg-white border-[1px] border-devider-line-color group-hover:border-text-color"></div>
                     <p className="group-hover:pl-1 transition-all">Light</p>
                  </button>
                  <button type="button" onClick={() => setTheme("dark")} className="grid grid-cols-[1fr_2fr_4fr] items-center gap-2 p-2 cursor-pointer group">
                     <div className={`aspect-square rounded-full bg-text-color opacity-${themeType === 1 ? "1" : "0"}`}></div>
                     <div className="aspect-square rounded-sm bg-[#090909] border-[1px] border-devider-line-color group-hover:border-text-color"></div>
                     <p className="group-hover:pl-1 transition-all">Dark</p>
                  </button>
                  <button type="button" onClick={() => setTheme("system")} className="grid grid-cols-[1fr_2fr_6fr] items-center gap-2 p-2 cursor-pointer group">
                     <div className={`aspect-square rounded-full bg-text-color opacity-${themeType === 2 ? "1" : "0"}`}></div>
                     <div className="grid grid-cols-2 aspect-square border-[1px] border-devider-line-color group-hover:border-text-color">
                        <div className="rounded-s-sm bg-[#090909]"></div>
                        <div className="rounded-e-sm bg-white"></div>
                     </div>
                     <p className="group-hover:pl-1 transition-all">System</p>
                  </button>

               </section>
            }
         </li>

         {/* <li className="border-b-[1px] border-devider-line-color ">
            <button 
               type="button" 
               className={`w-[100%] py-1 px-1 text-left text-text-color hover:bg-gray-${isDark ? "6" : "3"}00`} 
               onClick={() => setIsLangOpen(p => !p)}
            >Language
               <span className="w-fit float-right">{isLangOpen ? "-" : "+"}</span>
            </button>
            {
               <section className={`h-[${isLangOpen ? "80px" : "0px"}] overflow-hidden transition-[height] ease-linear`}>
                  <button type="button" className="grid grid-cols-[1fr_5fr] items-center gap-2 p-2 cursor-pointer group">
                     <div className={`aspect-square rounded-full bg-text-color opacity-${theme === "light" ? "1" : "0"}`}></div>
                     <p className="group-hover:pl-1 transition-all">En</p>
                  </button>
                  <button type="button" className="grid grid-cols-[1fr_5fr] items-center gap-2 p-2 cursor-pointer group">
                     <div className={`aspect-square rounded-full bg-text-color opacity-${theme === "dark" ? "1" : "0"}`}></div>
                     <p className="group-hover:pl-1 transition-all">Ar</p>
                  </button>
               </section>
            }
         </li> */}

         <li className={`py-1 px-1 hover:bg-gray-${isDark ? "6" : "3"}00`}>
            <button type="button" onClick={handleSignOut}  className="text-red-color w-16 overflow-hidden">Log Out</button>
         </li>

      </ul>
   </dialog>
}