import { type ReactNode } from "react";

import RealtimeProvider from "../../providers/realtimeProvider";

export default function ProviderLayout({ children }: { children: ReactNode }) {

   return <RealtimeProvider>
      {children}
   </RealtimeProvider>;
}