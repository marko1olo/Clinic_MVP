import pg from 'pg';
const { Client } = pg;
const client = new Client({ connectionString: 'postgres://dental:dental@127.0.0.1:5432/dental_crm' });
async function run() {
  await client.connect();
  const res = await client.query('SELECT login_id FROM organizations LIMIT 1');
  console.log('Orgs:', res.rows);
  const res2 = await client.query('SELECT email FROM users LIMIT 1');
  console.log('Users:', res2.rows);
  await client.end();
}
run();
