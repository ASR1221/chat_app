"use client";

import { useSearchParams } from "next/navigation";
import { BaseSyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/utils/supabase";

export default function ComoleteSignUp() {

   const email = useSearchParams().get("email");
   const { push } = useRouter();

   const [message, setMessage] = useState("");

   async function handleSubmit(e: BaseSyntheticEvent) {
      
      e.preventDefault();
      const token: string = e.target[0].value;
      const { data, error } = await supabase.auth.verifyOtp({
         email: email ? email : "",
         token,
         type: "email",
      });

      if (error) {
         setMessage(error.message);
         return;
      }

      push(`/signup/info?userId=${23}`);
   }

   return <form onSubmit={handleSubmit}>

      <input type="text" name="token" pattern="^\d+${6}" />
      <button type="submit">Check</button>

      <p>{ message }</p>
   </form>
}