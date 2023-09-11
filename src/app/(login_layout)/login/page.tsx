"use client";

import { useRouter } from "next/navigation";
import { BaseSyntheticEvent, useState } from "react";

import { clientSupabase } from "@/utils/clientSupabase";
import SignComp from "../signComp";

export default function LogIn() {
   const { push } = useRouter();

   const [message, setMessage] = useState("");

   async function handleSubmit(e: BaseSyntheticEvent) {
      e.preventDefault();

      const { data, error } = await clientSupabase.auth.signInWithPassword({
         email: e.target[0].value,
         password: e.target[1].value,
      });

      if (error) {
         setMessage(`Error: ${error.message}`);
         return;
      }

      push("/user");
   }

   return <SignComp handleSubmit={handleSubmit} errorMessage={message} type="Log In" />;
}
