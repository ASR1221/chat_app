'use client';
 
export default function GlobalError({ error, reset }: {
  error: Error & { digest?: string }
  reset: () => void
}) {
   return <html>
      <body>
         <div className="w-fit mx-auto mt-32">
            <div className="w-[300px] mx-auto">
               <img src="/images/illustrations/500 Internal Server Error-amico.svg" alt="Error illustration" />
            </div>
            <p className="text-center w-[300px]">Something went wrong. Would you like to try again?</p>
            <div className="w-fit mx-auto">
               <button onClick={() => reset()} className="p-1 bg-btn-color rounded-md hover:bg-btn-border-color cursor-pointer text-white text-center transition-all duration-300">Try again</button>
            </div>
         </div>
      </body>
   </html>
}