import Link from "next/link";

type Props = {
   id: string,
   profile_img_url: string | null,
   user_name: string,
   full_name: string,
   isOwner?: boolean,
}

export default function UserListItem({ id, profile_img_url, user_name, full_name, isOwner}: Props) {

   return <Link href={`/user/profile/${id}`} className="grid grid-cols-[16%_80%] gap-5">
      <div className="rounded-md overflow-hidden aspect-square bg-devider-line-color min-w-[40px] max-w-[55px]">
         {profile_img_url && <img src={profile_img_url} alt={`${user_name} profile image`} className="w-[100%] aspect-square object-cover" />}
      </div>

      <div className="grid grid-cols-1">
         <div className="flex items-center gap-6">
            <p className="text-lg font-semibold">{user_name}</p>
            {typeof isOwner !== "undefined" && <p className="text-devider-line-color text-sm">{isOwner ? "Owner" : "Member"}</p>}
         </div>
         <p className="text-sm">{full_name}</p>
      </div>
   </Link>
}