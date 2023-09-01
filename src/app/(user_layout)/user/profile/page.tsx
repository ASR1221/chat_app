"use client";

import { useRealtime } from "@/providers/realtimeProvider";
import UserProfileComp from "./userProfileComp";

export default function UserProfile() {

   const { user } = useRealtime();

   return <UserProfileComp user={user} />
}