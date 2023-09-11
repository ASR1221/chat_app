"use client";

import { BaseSyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { clientSupabase } from "@/utils/clientSupabase";
import SignComp from "../signComp";

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

   return <SignComp handleSubmit={handleSubmit} errorMessage={message} type="Sign Up" />;

}
