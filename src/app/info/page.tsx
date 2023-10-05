"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { BaseSyntheticEvent, useState } from "react";
import { Metadata } from "next";

import { clientSupabase } from "@/utils/clientSupabase";

export default function SignUpInfo() {
   const { push } = useRouter();
   const userId = useSearchParams().get("userId");

   const [message, setMessage] = useState("");

   async function handleSubmit(e: BaseSyntheticEvent) {
      e.preventDefault();

      if (!userId) {
         setMessage("No userId found. Please repeat sign up process again.");
         return;
      }

      const fname: string = e.target[0].value;
      const lname: string = e.target[1].value;
      const username: string = e.target[2].value;

      const { data, error } = await clientSupabase
         .from("users")
         .insert({
            id: userId,
            full_name: `${fname} ${lname}`,
            user_name: username,
         })
         .select();

      if (error) {
         setMessage(error.message);
         return;
      }

      push(`/user?userId=${userId}`);
   }

   return <div className="mt-20 mx-5">
      <div className="grid grid-cols-[38%_58%] items-center gap-3 max-w-sm mx-auto text-6xl">
         <h2>Info</h2>
         <div>
            <img src="/images/illustrations/Profile Interface-bro (1).svg" alt="Info illustration image" />
         </div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col mx-auto max-w-sm">
         <label className="block" htmlFor="fname">First name: </label>
         <input className="mt-1 mb-3 p-1 rounded-md border-[1px] border-text-color outline-none focus:border-btn-border-color active:border-btn-border-color" type="text" name="fname" />
         <label className="block" htmlFor="lname">Last name: </label>
         <input className="mt-1 mb-3 p-1 rounded-md border-[1px] border-text-color outline-none focus:border-btn-border-color active:border-btn-border-color" type="text" name="lname" />
         <label className="block" htmlFor="username">Username: <span className="text-xs">(must be uniqe)</span></label>
         <input className="mt-1 mb-3 p-1 rounded-md border-[1px] border-text-color outline-none focus:border-btn-border-color active:border-btn-border-color" type="text" name="username" />
         <button type="submit" className="w-20 p-1 bg-btn-color rounded-md border-[1px] hover:border-btn-border-color">Submit</button>

         <p className="text-red-color">{message}</p>
      </form>
   </div>;
}
