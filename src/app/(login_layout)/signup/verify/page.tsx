"use client";

import { useSearchParams } from "next/navigation";
import { BaseSyntheticEvent, useState } from "react";
import { useRouter } from "next/router";

import { supabase } from "@/utils/supabase";

export default function ComoleteSignUp() {

   const email = useSearchParams().get("email");
   const { push } = useRouter();

   const [message, setMessage] = useState("");

   async function handleSubmit(e: BaseSyntheticEvent) {
      
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

      push(`/signup/info?userId=${data.user?.id}`);
   }

   return <div>
      <form onSubmit={handleSubmit}>
         <input type="text" name="token" pattern="(1-9)" />
         <button type="submit">Check</button>
      </form>

      <p>{ message }</p>
   </div>
}