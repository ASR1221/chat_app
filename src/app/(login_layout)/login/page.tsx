"use client";

import { useRouter } from "next/navigation";
import { BaseSyntheticEvent, useState } from "react";

import { supabase } from "@/utils/supabase";

export default function LogIn() {
   
   const { push } = useRouter();

   const [message, setMessage] = useState("");

   async function handleSubmit(e: BaseSyntheticEvent) {

      e.preventDefault();

      const { data, error } = await supabase.auth.signInWithPassword({
         email: 'example@email.com',
         password: 'example-password',
      });

      if (error) {
         setMessage(`Error: ${error.message}`);
         return;
      }

      push(`/user/${data.user.id}`);

   }

   return <form onSubmit={handleSubmit}>
      <label htmlFor="email_username">Email or Username: </label>
      <input type="text" name="email_username" />
      <label htmlFor="password">Password: </label>
      <input type="text" name="password" />
      <button type="submit">Submit</button>

      <p>{ message }</p>

   </form>
}