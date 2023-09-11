"use client";

import { useSearchParams } from "next/navigation";
import { BaseSyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { clientSupabase } from "@/utils/clientSupabase";

export default function ComoleteSignUp() {
   const email = useSearchParams().get("email");
   const { push } = useRouter();

   const [message, setMessage] = useState("");

   async function handleSubmit(e: BaseSyntheticEvent) {
      e.preventDefault();
      const token: string = e.target[0].value;
      const { data, error } = await clientSupabase.auth.verifyOtp({
         email: email ? email : "",
         token,
         type: "email",
      });

      if (error) {
         setMessage(error.message);
         return;
      }

      push(`/info?userId=${data.user?.id}`);
   }

   return <>
      <p className="my-3">An email containing a verification code has been sent to you. Please write your verification code here </p>
      <form onSubmit={handleSubmit} className="flex flex-col mx-auto max-w-sm">
         <input
            className="mt-1 mb-3 p-1 rounded-md border-[1px] border-text-color outline-none focus:border-btn-border-color active:border-btn-border-color"
            type="text"
            name="token"
            pattern="^\d+${6}"
         />
         <button type="submit" className="w-20 p-1 bg-btn-color rounded-md border-[1px] hover:border-btn-border-color">Check</button>

         <p className="text-red-color">{message}</p>
      </form>
   </>;
}
