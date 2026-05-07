import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables dari .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { auth } from "../lib/auth/auth";

async function testRegister() {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = "Password123!";
  const testName = "Test User";

  console.log(`📡 Attempting to register user: ${testEmail}...`);

  try {
    const result = await auth.api.signUpEmail({
      body: {
        email: testEmail,
        password: testPassword,
        name: testName,
      }
    });

    console.log("✅ Registration Result:", result);
  } catch (err) {
    console.error("❌ Registration Exception:", err);
  } finally {
    process.exit(0);
  }
}

testRegister();
