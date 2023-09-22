"use client";

import { usePathname, useRouter } from "next/navigation";

import useTheme from "@/hooks/useTheme";

import ArrowIcon from "@/svgs/arrowIcon";

export default function SimpleNav({ backPath }: { backPath: string }) {

   const { push } = useRouter();
   const pathname = usePathname();
   const { isDark } = useTheme()

   return <nav
      className={`grid items-center px-4 fixed top-0 ${
         pathname === "/user" ? "left-[100vw]" : "left-[0]"
      } w-[100vw] md:w-[calc(100vw-370px)] md:left-[370px] bg-convo-header-bg-color text-convo-header-text-color h-[72px] isolate`}
   >

      <button type="button" onClick={() => push(backPath)} className="pl-2">
         <ArrowIcon isDark={isDark} width={20} />
      </button>

   </nav>
}