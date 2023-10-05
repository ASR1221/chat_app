import { Metadata } from "next";
import { type ReactNode } from "react";


export const metadata: Metadata = {
   title: 'Chatty | Chat',
   description: 'A chat',
};

export default function Layout({ children }: { children: ReactNode }) {

   return <>
      {children}
   </>;
}