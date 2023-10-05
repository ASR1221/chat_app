import { Metadata } from "next";
import { type ReactNode } from "react";


export const metadata: Metadata = {
   title: 'Chatty | Profile Image',
   description: 'Choose a profile image',
};

export default function Layout({ children }: { children: ReactNode }) {

   return <>
      {children}
   </>;
}