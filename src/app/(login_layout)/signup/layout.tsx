import { Metadata } from "next";
import { type ReactNode } from "react";


export const metadata: Metadata = {
   title: 'Chatty | SignUp',
   description: 'Sign up with your email and password and enjoy chatting',
};

export default function Layout({ children }: { children: ReactNode }) {

   return <>
      {children}
   </>;
}