import pg from 'pg';
const { Client } = pg;
const client = new Client({ connectionString: 'postgres://dental:dental@127.0.0.1:5432/dental_crm' });
async function run() {
  await client.connect();
  const res = await client.query('SELECT login_id, password_hash FROM organizations LIMIT 1');
  console.log('Orgs:', res.rows);
  await client.end();
}
run();
