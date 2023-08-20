"use client";

import { useRouter } from "next/navigation";
import { BaseSyntheticEvent, useState } from "react";

import { clientSupabase } from "@/utils/clientSupabase";

export default function LogIn() {
   const { push } = useRouter();

   const [message, setMessage] = useState("");

   async function handleSubmit(e: BaseSyntheticEvent) {
      e.preventDefault();

      const { data, error } = await clientSupabase.auth.signInWithPassword({
         email: e.target[0].value,
         password: e.target[1].value,
      });

      if (error) {
         setMessage(`Error: ${error.message}`);
         return;
      }

      push(`/user/${data.user.id}`);
   }

   return (
      <form onSubmit={handleSubmit} className="flex flex-col">
         <label className="block" htmlFor="email">Email: </label>
         <input className="mt-1 mb-3 p-1 border-2 border-black" type="text" name="email_username" />
         <label className="block" htmlFor="password">Password: </label>
         <input className="mt-1 mb-3 p-1 border-2 border-black" type="text" name="password" />
         <button type="submit" className="p-1 bg-black hover:bg-black/80 text-white">Log In</button>

         <p className="text-red-600">{message}</p>
      </form>
   );
}
