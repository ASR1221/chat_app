"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { BaseSyntheticEvent, useState } from "react";

import { clientSupabase } from "@/utils/clientSupabase";

export default function SignUpInfo() {
   const { push } = useRouter();
   const userId = useSearchParams().get("userId") as string;

   const [message, setMessage] = useState("");

   async function handleSubmit(e: BaseSyntheticEvent) {
      e.preventDefault();

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

      push("/user");
   }

   return (
      <form onSubmit={handleSubmit} className="flex flex-col">
         <label className="block" htmlFor="fname">First name: </label>
         <input className="mt-1 mb-3 p-1 border-2 border-black" type="text" name="fname" />
         <label className="block" htmlFor="lname">Last name: </label>
         <input className="mt-1 mb-3 p-1 border-2 border-black" type="text" name="lname" />
         <label className="block" htmlFor="username">Username: <span className="text-xs">( must be uniqe)</span></label>
         <input className="mt-1 mb-3 p-1 border-2 border-black" type="text" name="username" />
         <button type="submit" className="p-1 bg-black hover:bg-black/80 text-white">Submit</button>

         <p className="text-red-600">{message}</p>
      </form>
   );
}
