import { Metadata } from "next";
import { type ReactNode } from "react";


export const metadata: Metadata = {
   title: 'Chatty | Add Member',
   description: 'Add member to a chat',
};

export default function Layout({ children }: { children: ReactNode }) {

   return <>
      {children}
   </>;
}