"use client";

import { BaseSyntheticEvent, useState } from "react";
import { useRouter } from "next/router";

import { supabase } from "@/utils/supabase";

export default function SignUp() {

   const { push } = useRouter();
   const [message, setMessage] = useState("");
   
   async function handleSubmit(e: BaseSyntheticEvent) {
      e.preventDefault();

      const response = await supabase.auth.signUp({
         email: e.target[0].value,
         password: e.target[1].value,
      });

      if (response.error) {
         setMessage(`Error: ${response.error.message}`);
         return;
      }

      push(`/signup/complete?email=${e.target[0].value}`)
   }

   return <form onSubmit={handleSubmit} >
      {/* <label htmlFor="fname">First name: </label>
      <input type="text" name="fname" />
      <label htmlFor="lname">Last name: </label>
      <input type="text" name="lname" />
      <label htmlFor="username">Write a uniqe username: </label>
      <input type="text" name="username" /> */}
      <label htmlFor="email">Email: </label>
      <input type="text" name="email" className="text-black"/>
      <label htmlFor="password">Password: </label>
      <input type="text" name="password" className="text-black" />
      <button type="submit">Submit</button>

      <p>{ message }</p>
   </form>
}