import { randomBytes, pbkdf2Sync } from "node:crypto";
import pg from 'pg';

const ITERATIONS = 100_000;
const KEYLEN = 64;
const DIGEST = "sha512";

function hashCredential(value) {
  const salt = randomBytes(32).toString("hex");
  const hash = pbkdf2Sync(value, salt, ITERATIONS, KEYLEN, DIGEST).toString("hex");
  return `${salt}:${hash}`;
}

const { Client } = pg;
const client = new Client({ connectionString: 'postgres://dental:dental@127.0.0.1:5432/dental_crm' });

async function run() {
  await client.connect();
  const newHash = hashCredential('password123');
  await client.query('UPDATE organizations SET password_hash = $1 WHERE login_id = $2', [newHash, 'devaudit@dente.test']);
  console.log('Updated organization password for devaudit@dente.test to password123');
  
  await client.end();
}
run();
