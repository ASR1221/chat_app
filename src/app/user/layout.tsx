import { ReactNode } from "react";

import RealtimeProvider from "@/providers/realtimeProvider";

export default function UserLayout({ children }: { children: ReactNode }) {

   return <RealtimeProvider>
      {children}
   </RealtimeProvider>;
}
