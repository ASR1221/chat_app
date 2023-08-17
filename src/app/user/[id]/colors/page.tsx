"use client";

import { useRouter, useParams } from "next/navigation";


export default function SetColors() {

   const { push } = useRouter();
   const userId = useParams().id;
   
   function handleClick() {

      // choosing a colors and savaing it in localstorage and database here
      
      push(`/user/${userId}`);
   }

   return <div>
      <h1>Colored Chat</h1>
      
      <p>Choose primary color:</p>
      <div>

      </div>

      <p>Choose secondary color:</p>
      <div>

      </div>

      <button type="button" onClick={handleClick}>Save</button>

      <div>
         {/* conversation template here */}
      </div>
   </div>
}