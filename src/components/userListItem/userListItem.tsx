import Link from "next/link";

type Props = {
   id: string,
   profile_img_url: string | null,
   user_name: string,
   isOwner?: boolean,
}

export default function UserListItem({ id, profile_img_url, user_name, isOwner}: Props) {


   return <Link href={`/user/profile/${id}`} className="grid grid-cols-[16%_80%] gap-5">
      <div className="rounded-md overflow-hidden aspect-square bg-devider-line-color min-w-[40px] max-w-[55px]">
         {profile_img_url && <img src={profile_img_url} alt={`${user_name} profile image`} className="w-[100%] aspect-square object-cover" />}
      </div>

      <div className="grid grid-cols-1">
         <p className="text-lg">{user_name}</p>
         {isOwner && <p className="text-devider-line-color text-sm">{isOwner ? "Owner" : "Member"}</p>}
      </div>
   </Link>
}