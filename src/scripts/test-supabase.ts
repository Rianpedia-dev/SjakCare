import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log("Testing Supabase connection with Anon Key...");
  const { data, error } = await supabase.storage.listBuckets();
  
  if (error) {
    console.error("❌ Connection failed:", error.message);
  } else {
    console.log("✅ Connection successful!");
    console.log("Available buckets:", data.map(b => b.name).join(", "));
  }
}

testConnection();
