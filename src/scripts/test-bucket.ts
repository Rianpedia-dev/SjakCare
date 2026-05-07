import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testBucket() {
  console.log("Checking if 'profiles' bucket is accessible...");
  const { data, error } = await supabase.storage.from('profiles').list();
  
  if (error) {
    console.error("❌ Bucket access failed:", error.message);
  } else {
    console.log("✅ Bucket 'profiles' is accessible!");
    console.log("Files count:", data.length);
  }
}

testBucket();
