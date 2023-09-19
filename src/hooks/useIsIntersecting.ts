"use client";

import { useState, useEffect, MutableRefObject } from 'react';

export default function useIsIntersecting(element: MutableRefObject<HTMLElement | null>, rootMargin: string) {
   const [isVisible, setState] = useState(false);

   useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => {
               setState(entry.isIntersecting);
         }, { rootMargin });

      element.current && observer.observe(element.current);

      return () => {
         if (element.current) observer.unobserve(element.current);
      }
   }, []);

   return isVisible;
}