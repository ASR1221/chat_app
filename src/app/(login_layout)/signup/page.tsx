"use client";

import { BaseSyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Metadata } from "next";

import { clientSupabase } from "@/utils/clientSupabase";
import SignComp from "../../../components/signComp/signComp";

export const metadata: Metadata = {
   title: 'Chatty | SignUp',
   description: 'Sign up with your email and password and enjoy chatting',
};

export default function SignUp() {
   const { push } = useRouter();
   const [message, setMessage] = useState("");

   async function handleSubmit(e: BaseSyntheticEvent) {
      e.preventDefault();

      if (!(e.target[0].value.trim() && e.target[1].value.trim())) return;

      const { error } = await clientSupabase.auth.signUp({
         email: e.target[0].value.trim(),
         password: e.target[1].value.trim(),
      });

      if (error) {
         setMessage(`Error: ${error.message}`);
         return;
      }

      push(`/signup/verify?email=${e.target[0].value}`);
   }

   return (
      <SignComp
         handleSubmit={handleSubmit}
         errorMessage={message}
         type="Sign Up"
      />
   );
}
