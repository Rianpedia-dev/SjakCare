const postgres = require('postgres');
const dotenv = require('dotenv');
const path = require('path');

async function testConnection() {
  // Hardcoded for testing to bypass env issues
  const connectionString = "postgresql://postgres.lobeaonsefjiuvebrblb:QoJPaMpbcNiFnf3n@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres";
  console.log('Testing connection to:', connectionString.split('@')[1]);

  const sql = postgres(connectionString, {
    ssl: 'require',
    connect_timeout: 10
  });

  try {
    const result = await sql`SELECT current_database(), current_user;`;
    console.log('✅ Connected successfully!');
    console.log('Data:', result[0]);
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  } finally {
    await sql.end();
  }
}

testConnection();
