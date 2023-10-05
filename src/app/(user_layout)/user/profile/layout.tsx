import { Metadata } from "next";
import { type ReactNode } from "react";


export const metadata: Metadata = {
   title: 'Chatty | Profile',
   description: 'Your profile',
};

export default function Layout({ children }: { children: ReactNode }) {

   return <>
      {children}
   </>;
}