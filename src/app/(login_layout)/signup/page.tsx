"use client";

import { BaseSyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { clientSupabase } from "@/utils/clientSupabase";

export default function SignUp() {
   const { push } = useRouter();
   const [message, setMessage] = useState("");

   async function handleSubmit(e: BaseSyntheticEvent) {
      e.preventDefault();

      const { error } = await clientSupabase.auth.signUp({
         email: e.target[0].value,
         password: e.target[1].value,
      });

      if (error) {
         setMessage(`Error: ${error.message}`);
         return;
      }

      push(`/signup/verify?email=${e.target[0].value}`);
   }

   return (
      <form onSubmit={handleSubmit}>
         <label htmlFor="email">Email: </label>
         <input type="text" name="email" className="text-black" />
         <label htmlFor="password">Password: </label>
         <input type="text" name="password" className="text-black" />
         <button type="submit">Submit</button>

         <p>{message}</p>
      </form>
   );
}
