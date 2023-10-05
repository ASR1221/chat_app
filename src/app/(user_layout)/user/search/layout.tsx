import { Metadata } from "next";
import { type ReactNode } from "react";


export const metadata: Metadata = {
   title: 'Chatty | Search',
   description: 'Search for users or chats',
};

export default function Layout({ children }: { children: ReactNode }) {

   return <>
      {children}
   </>;
}