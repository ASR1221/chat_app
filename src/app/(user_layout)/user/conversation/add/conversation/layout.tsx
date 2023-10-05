import { Metadata } from "next";
import { type ReactNode } from "react";


export const metadata: Metadata = {
   title: 'Chatty | Add Chat',
   description: 'Add a chat',
};

export default function Layout({ children }: { children: ReactNode }) {

   return <>
      {children}
   </>;
}