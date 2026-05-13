import postgres from 'postgres';

async function test() {
  const connectionString = 'postgresql://postgres.lobeaonsefjiuvebrblb:QoJPaMpbcNiFnf3n@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres';
  const sql = postgres(connectionString, { ssl: 'require' });

  try {
    console.log('📡 Testing connection to port 6543 (Transaction Pooler)...');
    const result = await sql`SELECT 1 as connected`;
    console.log('✅ Berhasil terhubung ke Supabase melalui port 6543!');
    console.log('Hasil:', result);
  } catch (error) {
    console.error('❌ Gagal terhubung ke port 6543:', error);
  } finally {
    await sql.end();
    process.exit(0);
  }
}

test();
