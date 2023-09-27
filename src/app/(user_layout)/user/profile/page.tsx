"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import useTheme from "@/hooks/useTheme";
import { useRealtime } from "@/providers/realtimeProvider";
import { clientSupabase } from "@/utils/clientSupabase";

import TextInputEdit from "@/components/textInputEdit/textInputEdit";
import EditIcon from "@/svgs/editIcon";
import SimpleNav from "@/components/simpleNav/simpleNav";
import ImageModal from "@/components/imageModal/imageModal";

export default function UserProfile() {

   const { user, userId, setUser } = useRealtime();
   const { isDark } = useTheme();

   const [isLoading, setIsLoading] = useState(false);
   const [fullName, setFullName] = useState("");
   const [bio, setBio] = useState("");
   const [isError, setIsError] = useState(false);

   const [isImgOpen, setIsImgOpen] = useState(false);

   useEffect(() => {
      setFullName(user.full_name);
      setBio(user.bio ?? "");
      setIsError(false);
   }, [user]);

   async function handleEditSubmit() {
      const newFullName = fullName.trim();
      const newBio = bio.trim();

      if (!newFullName && !newBio) return;
      if (fullName === user.full_name && newBio === user.bio) return;

      setIsLoading(true);

      const updated = {
         full_name: newFullName,
         bio: newBio,
      };

      const response = await clientSupabase.from("users").update(updated).eq("id", userId);

      if (response.error) {
         setIsError(true);
         setIsLoading(false);
         return;
      }
      
      setUser(p => ({ ...p, full_name: fullName, bio, }));
      setIsLoading(false);
   }

   return <div className="absolute top-0 bottom-0 bg-bg-color w-[100%]">

      <SimpleNav header="Profile" />

      <div className="py-20 px-3 max-w-md mx-auto bg-bg-color">

         <div className="py-3 relative">
            <button
               type="button"
               onClick={() => user.profile_img_url ? setIsImgOpen(true) : {}}
               className={`w-[100%] aspect-square bg-devider-line-color rounded-md overflow-hidden ${user.profile_img_url ? "" : "cursor-default"}`}
            >
               {
                  user.profile_img_url &&
                  <Image
                     src={user.profile_img_url}
                     alt="Your profile image"
                     width={0}
                     height={0}
                     sizes="100vw"
                     style={{ width: "100%", height: "100%" }}
                     className="aspect-square object-cover"
                  />
               }
            </button>

            <Link
               href={`/info/image?userId=${userId}&imgURL=${user.profile_img_url}`}
               className="bg-btn-border-color p-2 aspect-square rounded-full absolute right-5 -bottom-1"
            >
               <EditIcon isDark={true} width={25} />
            </Link>
         </div>

         <div className="grid grid-cols-1 gap-1">
            <h2 className="pb-2 px-2 text-4xl">@{user.user_name}</h2>

            <div className="grid grid-cols-[4fr_1fr] items-center w-[60%]">
               <TextInputEdit
                  isLoading={isLoading}
                  isDark={isDark}
                  isOwner={true}
                  textValue={fullName}
                  setTextValue={setFullName}
                  handleEditSubmit={handleEditSubmit}
               />
            </div>
            
            <div className="grid grid-cols-[4fr_1fr] items-center w-[60%]">
               <TextInputEdit
                  isLoading={isLoading}
                  isDark={isDark}
                  isOwner={true}
                  textValue={bio}
                  setTextValue={setBio}
                  handleEditSubmit={handleEditSubmit}
                  placeHolder="Add a bio"
               />
            </div>
         </div>

      </div>

      <p>{isError && "Something went wrong. Please refresh the page and try again."}</p>

      <ImageModal
         imgSrc={user.profile_img_url ?? ""}
         isOpen={isImgOpen}
         setIsOpen={setIsImgOpen}
      />
   </div>
}