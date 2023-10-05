import { type ReactNode } from "react";
import { Metadata } from "next";

import RealtimeProvider from "../../providers/realtimeProvider";

export const metadata: Metadata = {
   title: 'Chatty | Chats',
   description: 'All chats',
};

export default function ProviderLayout({ children }: { children: ReactNode }) {

   return <RealtimeProvider>
      {children}
   </RealtimeProvider>;
}