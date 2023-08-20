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

      push(`/signup/info?userId=${data.user?.id}`);
   }

   return (
      <form onSubmit={handleSubmit}>
         <input className="mt-1 mb-3 p-1 border-2 border-black" placeholder="######" type="text" name="token" pattern="^\d+${6}" />
         <button type="submit"  className="py-1 px-2 bg-black hover:bg-black/80 text-white sm:ml-5">Check</button>

         <p className="text-red-600">{message}</p>
      </form>
   );
}
