"use client";

import { redirect } from "next/navigation";

import { useUser } from "@/providers/supabaseProvider";

export default function Landing() {

   const { user } = useUser();

   if (user) redirect(`/user/${user.id}`); 
      
   redirect("/login");
}