// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";

// export const supabase = createClientComponentClient({
//    supabaseUrl: "https://mhlqhssqzsezzhgonlxp.supabase.co",
//    supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1obHFoc3NxenNlenpoZ29ubHhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTEyNjExNDMsImV4cCI6MjAwNjgzNzE0M30.dqhY9nvZ-vOCsDfXFmg5dJ0tcNUflCaADgGLGy0SNsE",
// });

export const supabase = createClient("https://mhlqhssqzsezzhgonlxp.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1obHFoc3NxenNlenpoZ29ubHhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTEyNjExNDMsImV4cCI6MjAwNjgzNzE0M30.dqhY9nvZ-vOCsDfXFmg5dJ0tcNUflCaADgGLGy0SNsE");