"use client";

import { useState, useEffect } from "react";

export default function useTheme() {

   const [isDark, setIsDark] = useState(false);

   useEffect(() => {
      setIsDark(document.documentElement.getAttribute("data-theme") === "dark");

      const mutationObserver = new MutationObserver((mutations) => {
         mutations.forEach(mutation => {
            if (mutation.attributeName === "data-theme")
               setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
         })
      });

      mutationObserver.observe(document.documentElement, {
         attributes: true,
         attributeFilter: ["data-theme"]
      });

      () => mutationObserver.disconnect();
   }, []);

   function setTheme(theme: "light" | "dark" | "default") {

      if (theme === "default") {
         localStorage.removeItem("theme");
         const newTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
         document.documentElement.setAttribute("data-theme", newTheme ? "dark" : "light");
      } else {
         localStorage.setItem("theme", theme);
         document.documentElement.setAttribute("data-theme", theme);
      }
   }

   return { isDark, setTheme };
}