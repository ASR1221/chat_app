"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { type User } from "@supabase/supabase-js";

import { supabase } from "@/utils/supabase";

export const AuthContext = createContext<{
   user: User | null;
   isLoading: boolean;
}>({
   user: null,
   isLoading: true,
});

export default function AuthProvider (props: any) {
   const [user, setUser] = useState<User | null>(null);
   const [isLoading, setIsloading] = useState(true);

   useEffect(() => {
      supabase
         .auth.getSession()
         .then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setIsloading(false);
         });

      const { data: authListener } = supabase.auth.onAuthStateChange(
         (event, session) => {
            setUser(session?.user ?? null);
            setIsloading(false);
         }
      );

      return () => {
         authListener.subscription.unsubscribe();
      };
   }, []);

   const value = {
      user,
      isLoading,
   };

   return <AuthContext.Provider value={value} {...props}/>
}

export const useUser = () => {
   const context = useContext(AuthContext);
   if (context === undefined) {
      throw new Error("useUser must be used within a AuthContextProvider.");
   }
   return context;
};