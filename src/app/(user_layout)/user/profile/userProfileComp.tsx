import { OUser } from "@/providers/realtimeProvider";
import { User } from "@/types/supabaseTables";

export default function UserProfileComp(
   {
      user
   }: {
      user: OUser | Omit<User, "id" | "created_at">
   }) {

   return <div>
      <div>
         {user.profile_img_url && <img src={`user.profile_img_url`} alt="Your profile image" />}
      </div>
      <div>
         <p>{user.full_name}</p>
         <p>{user.user_name}</p>
         <p>{user.bio}</p>
      </div>
   </div>
}