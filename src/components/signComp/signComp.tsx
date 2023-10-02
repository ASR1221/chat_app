"use client";

import { BaseSyntheticEvent } from "react";

type Props = {
   handleSubmit: (e: BaseSyntheticEvent) => void,
   errorMessage: string,
   type: "Log In" | "Sign Up",
}

export default function SignComp({ handleSubmit, errorMessage, type }: Props) {
   return <form onSubmit={handleSubmit} className="flex flex-col mx-auto max-w-sm">
      <label className="block" htmlFor="email">Email: </label>
      <input required className="mt-1 mb-3 p-1 rounded-md border-[1px] border-text-color outline-none focus:border-btn-border-color active:border-btn-border-color" type="text" name="email" />
      <label className="block" htmlFor="password">Password: </label>
      <input required className="mt-1 mb-3 p-1 rounded-md border-[1px] border-text-color outline-none focus:border-btn-border-color active:border-btn-border-color" type="text" name="password" />
      <button type="submit" className="w-20 p-1 bg-btn-color rounded-md border-[1px] hover:border-btn-border-color">{type}</button>

      <p className="text-red-color">{errorMessage}</p>
   </form>;
}