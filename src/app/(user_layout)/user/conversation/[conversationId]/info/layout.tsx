import { Metadata } from "next";
import { type ReactNode } from "react";


export const metadata: Metadata = {
   title: 'Chatty | Chat Info',
   description: 'A chat info',
};

export default function Layout({ children }: { children: ReactNode }) {

   return <>
      {children}
   </>;
}