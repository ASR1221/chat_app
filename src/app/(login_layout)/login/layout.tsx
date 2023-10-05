import { Metadata } from "next";
import { type ReactNode } from "react";


export const metadata: Metadata = {
   title: 'Chatty | Log In',
   description: 'Log in with your email and password and enjoy chatting',
};

export default function Layout({ children }: { children: ReactNode }) {

   return <>
      {children}
   </>;
}