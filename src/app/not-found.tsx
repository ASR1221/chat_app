import Link from 'next/link';
 
export default function NotFound() {
   return <div className="w-fit mx-auto mt-32">
      <div className="w-[300px] mx-auto">
         <img src="/images/illustrations/404 Error Page not Found with people connecting a plug-bro.svg" alt="Not Found illustration" />
      </div>
      <p className="text-center w-[300px]">Page not found. Return to gome page?</p>
      <div className="w-fit mx-auto my-5">
         <Link href="/" className="p-1 bg-btn-color rounded-md hover:bg-btn-border-color cursor-pointer text-white text-center transition-all duration-300">Return Home</Link>
      </div>
   </div>
}
