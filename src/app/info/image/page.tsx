"use client";

import { clientSupabase } from "@/utils/clientSupabase";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type BaseSyntheticEvent } from "react";

export default function ProfileImage() {

   const userId = useSearchParams().get("userId");
   const { push } = useRouter();

   const arr = Array.from(Array(26).keys());
   const [image, setImage] = useState<string | null>(null);
   const [error, setError] = useState<string | null>(null);

   function handleFileChange(e: BaseSyntheticEvent) {
      if (e.target.files[0]) setImage(URL.createObjectURL(e.target.files[0]));
   }

   async function handleSubmit(e: BaseSyntheticEvent) {
      e.preventDefault();

      if (!userId) {
         setError("Error: No userId found. Please repeat the sign up procces.");
         return;
      }

      if (image?.includes("/images/avatars/avatar-")) {
         const { error } = await clientSupabase
            .from("users")
            .update({
               profile_img_url: image
            })
            .eq("id", userId);

         if (error) {
            setError(error.message);
            return;
         }

         push("/user");
      }

      const fileResponse = await clientSupabase.storage.from("chat")
         .upload(`profile_image/${Date.now()}-${e.target[0].files[0].name}`, e.target[0].files[0]);

      if (fileResponse.error) {
         setError(fileResponse.error.message);
         return;
      }

      const imageURL = `https://mhlqhssqzsezzhgonlxp.supabase.co/storage/v1/object/public/chat/${fileResponse.data.path}`;

      const { error } = await clientSupabase
         .from("users")
         .update({
            profile_img_url: imageURL
         })
         .eq("id", userId);

      if (error) {
         setError(error.message);
         return;
      }

      push("/user");

   }

   return <div className="my-8 mx-auto px-5 max-w-xl">
      <h2 className="text-4xl mb-2">Profile Image</h2>
      <label htmlFor="image">Upload an image or choose an avatar for your profile</label>

      <form onSubmit={handleSubmit}>
         <div className="grid grid-cols-[58%_39%] justify-between items-center py-5 sticky top-0 bg-bg-color border-b-[1px] border-devider-line-color">
            <div className="aspect-square bg-convo-header-bg-color rounded-lg overflow-hidden">
               {image && <img src={image} alt="Your image" className="object-cover object-center w-[100%] h-[100%]" />}
            </div>
            <div className="grid grid-cols-1 gap-5">
               
               <button
                  type="button"
                  className="p-1 bg-red-color rounded-md hover:bg-red-700 transition-all duration-300"
                  onClick={() => setImage(null)}
               >Remove</button>
               
               <label
                  htmlFor="image"
                  className="p-1 bg-btn-color rounded-md hover:bg-btn-border-color cursor-pointer text-white text-center transition-all duration-300"
               >Upload
                  <input
                     type="file"
                     id="image"
                     name="image"
                     accept="image/jpg, image/jpeg, image/png"
                     hidden
                     onChange={handleFileChange}
                  />
               </label>

               <button
                  className="p-1 bg-green-color rounded-md hover:bg-green-700 transition-all duration-300"
                  type="submit"
               >Save</button>

            </div>
         </div>

         {error && <p className="w-[90%] p-3 pt-5 bg-bg-color border-b-[1px] border-devider-line-color text-red-color fixed top-0">{error}</p>}

         <div className="grid grid-cols-[repeat(auto-fit,minmax(min(7rem,100%),1fr))] gap-3 my-5">
            {
               arr.map((x, i) => <button
                  type="button"
                  key={i}
                  className="rounded-md aspect-square overflow-hidden hover:border-[1px] hover:border-text-color"
                  onClick={() => setImage(`/images/avatars/avatar-${i + 1}.svg`)}
               >
                  <img src={`/images/avatars/avatar-${i+1}.svg`} alt="avatar image" className="w-[100%] h-[100%]" />
               </button>)
            }
         </div>
      </form>
   </div>
}