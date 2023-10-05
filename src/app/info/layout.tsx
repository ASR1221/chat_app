import { Metadata } from "next";
import { type ReactNode } from "react";


export const metadata: Metadata = {
   title: 'Chatty | Info',
   description: 'Write down your info to complete sign up',
};

export default function Layout({ children }: { children: ReactNode }) {

   return <>
      {children}
   </>;
}