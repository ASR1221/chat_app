"use client";

import { useRouter } from "next/navigation";
import { BaseSyntheticEvent, useState } from "react";

import { clientSupabase } from "@/utils/clientSupabase";
import SignComp from "../../../components/signComp/signComp";

export default function LogIn() {
   const { push } = useRouter();

   const [message, setMessage] = useState("");

   async function handleSubmit(e: BaseSyntheticEvent) {
      e.preventDefault();

      if (!(e.target[0].value.trim() && e.target[1].value.trim())) return;

      const { data, error } = await clientSupabase.auth.signInWithPassword({
         email: e.target[0].value.trim(),
         password: e.target[1].value.trim(),
      });

      if (error) {
         setMessage(`Error: ${error.message}`);
         return;
      }

      push("/user");
   }

   return (
      <SignComp
         handleSubmit={handleSubmit}
         errorMessage={message}
         type="Log In"
      />
   );
}
