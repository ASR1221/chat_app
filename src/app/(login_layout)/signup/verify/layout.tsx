import { Metadata } from "next";
import { type ReactNode } from "react";


export const metadata: Metadata = {
   title: 'Chatty | Confirm',
   description: 'Confirm your email to chat',
};

export default function Layout({ children }: { children: ReactNode }) {

   return <>
      {children}
   </>;
}