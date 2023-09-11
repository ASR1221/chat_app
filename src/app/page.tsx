"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Logo from "@/svgs/logo";

export default function Landing() {

   // TODO: responsive
   const [isDark, setIsDark] = useState(false);

   useEffect(() => {

      setIsDark(document.documentElement.getAttribute("data-theme") === "dark");

      const observers: IntersectionObserver[] = [];
   
      for (let i = 0; i < 3; i++) {
         const x = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
               const element = entry.target as HTMLElement;
               element.style.opacity = "1";
               element.style.gap = "12px";
               observers[i].unobserve(element);
            }
         }, { threshold: 0.5 });
   
         observers.push(x);
      }
   
      observers.forEach((observer, i) => {
         const elm = document.getElementById(`animation-${i}`);
         if (elm) observer.observe(elm);
      });

      const mutationObserver = new MutationObserver((mutations, observer) => {
         mutations.forEach(mutation => {
            if (mutation.attributeName === "data-theme") setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
         })
      });

      mutationObserver.observe(document.documentElement, {
         attributes: true,
         attributeFilter: ["data-theme"]
      });

      () => {
         mutationObserver.disconnect();
         observers.forEach(observer => observer.disconnect());
      }

   }, []);

   return <div>
      <nav className="flex justify-between items-center py-3 px-4 border-b-[1px] border-text-color sm:px-[15%]">
         <div className="flex justify-evenly">
            <div>
               <Logo isDark={isDark} width={38} /* edit isDark later */ /> 
            </div>
            <h2 className="text-3xl ml-3">Chatty</h2>
         </div>
         <div className="flex justify-evenly">
            <Link href="#footer" className="mr-3 py-1 px-2 text-sm rounded-md hover:bg-slate-500 transition-all duration-300">Contact Us</Link>
            <Link href="/login" className="py-1 px-2 bg-btn-color rounded-md text-sm hover:bg-btn-border-color transition-all duration-300">Log In</Link>
         </div>
      </nav>
      <main className="w-[80%] max-w-5xl my-40 px-5 sm:px-[15%] sm:my-60">
         <h1 className="text-5xl sm:text-6xl mb-5">Stay Connected with <span className="text-btn-border-color font-header">Chatty</span>: The fun and secure way to connect</h1>
         <p className="text-lg">Message your friends and family easily and choose your character to be whoever you want.</p>
      </main>
      <section className="p-5 bg-convo-header-bg-color text-md sm:text-3xl sm:px-[15%]">
         <div id="animation-0" className="grid grid-cols-[38%_58%] items-center gap-8 my-8 opacity-0 transition-all duration-500">
            <p>Fast and easy chat with anyone around the world</p>
            <div><img src="/images/illustrations/Voice chat-amico.svg" alt="Chating image"/></div>
         </div>
         <div id="animation-1" className="grid grid-cols-[58%_38%] items-center gap-8 my-12 opacity-0 transition-all duration-500">
            <div><img src="/images/illustrations/Personalization-pana (2).svg" alt="Choose avatar image" /></div>
            <p>Choose your avatar from 25+ design</p>
         </div>
         <div id="animation-2" className="grid grid-cols-[38%_58%] items-center gap-8 my-8 opacity-0 transition-all duration-500">
            <p>Save your files in a chat securely </p>
            <div><img src="/images/illustrations/Safe-rafiki (2).svg" alt="Secure safe image" /></div>
         </div>
      </section>
      <section className="my-28 sm:px-[15%]">
         <center>
            <h3 className="w-[75%] text-2xl mb-6 sm:text-4xl">Get in the website and start messaging now</h3>
            <Link href="/login" className="py-1 px-2 bg-btn-color rounded-md text-md shadow-basic hover:bg-btn-border-color transition-all duration-300" >Log In</Link>
         </center>
      </section>
      <footer id="footer" className="p-5 border-t-[1px] border-text-color ">
         <h3 className="font-bold text-xl mb-3 text-center">By Abdullah Salah</h3>
         <div className="flex items-center gap-5 my-3 w-fit h-12 mx-auto">
            <a href="mailto:asr12211@outlook.com" className="p-1 rounded-full bg-white w-14 hover:w-16 hover:p-2 transition-all duration-300">
               <img src="/images/social/icons8-gmail.svg" alt="Gmail icon" />
            </a>
            <a href="https://github.com/ASR1221" className="p-1 rounded-full bg-white w-14 hover:w-16 hover:p-2 transition-all duration-300">
               <img src="/images/social/icons8-github.svg" alt="Github logo" />
            </a>
            <a href="https://www.linkedin.com/in/abdullah-salah-29209b235/" className="p-1 rounded-full bg-white w-14 hover:w-16 hover:p-2 transition-all duration-300">
               <img src="/images/social/icons8-linked-in.svg" alt="Linked in Logo" />
            </a>
         </div>
      </footer>
   </div>
}