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

      push(`/user/${userId}`);
   }

   return (
      <form onSubmit={handleSubmit}>
         <label htmlFor="fname">First name: </label>
         <input type="text" name="fname" />
         <label htmlFor="lname">Last name: </label>
         <input type="text" name="lname" />
         <label htmlFor="username">Username: (username must be uniqe)</label>
         <input type="text" name="username" />
         <button type="submit">Submit</button>

         <p>{message}</p>
      </form>
   );
}
