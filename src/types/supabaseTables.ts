import { Database } from "./database";

export type ConversationUser = Database["public"]["Tables"]["conversation_user"]["Row"]

export type Conversation = Database["public"]["Tables"]["conversations"]["Row"]

export type Message = Database["public"]["Tables"]["messages"]["Row"]

export type UserContact = Database["public"]["Tables"]["user_contact"]["Row"]

export type User = Database["public"]["Tables"]["users"]["Row"]