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
      <form onSubmit={handleSubmit}>
         <label htmlFor="email">Email: </label>
         <input type="text" name="email_username" />
         <label htmlFor="password">Password: </label>
         <input type="text" name="password" />
         <button type="submit">Submit</button>

         <p>{message}</p>
      </form>
   );
}
