import { FormEvent } from "react";

export default function LogIn() {
   
   function handleSubmit(e: FormEvent) {
   }

   return <form onSubmit={handleSubmit}>
      <label htmlFor="email_username">Email or Username: </label>
      <input type="text" name="email_username" />
      <label htmlFor="password">Password: </label>
      <input type="text" name="password" />
   </form>
}