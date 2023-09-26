"use client";

import { useState, useEffect } from "react";

export default function useTheme() {

   const [isDark, setIsDark] = useState(false);
   const [themeType, setThemeType] = useState(0);  // force a rerender to theme choice

   useEffect(() => {
      setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
      setThemeType(!localStorage.getItem("theme") ? 2 : localStorage.getItem("theme") === "dark" ? 1 : 0);

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

   function setTheme(theme: "light" | "dark" | "system") {

      if (theme === "system") {
         localStorage.removeItem("theme");
         const newTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
         document.documentElement.setAttribute("data-theme", newTheme ? "dark" : "light");
         setThemeType(2);
      } else {
         localStorage.setItem("theme", theme);
         document.documentElement.setAttribute("data-theme", theme);
         setThemeType(theme === "light" ? 0 : 1);
      }
   }

   return { isDark, setTheme, themeType };
}