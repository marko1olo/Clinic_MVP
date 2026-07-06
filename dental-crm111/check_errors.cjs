const puppeteer = require('puppeteer');

async function runAudit() {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  let errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      errors.push(`${msg.type().toUpperCase()}: ${msg.text()}`);
    }
  });
  page.on('pageerror', err => errors.push(`PAGE ERROR: ${err.toString()}`));

  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('auth_token', 'mock_token');
    localStorage.setItem('auth_user', JSON.stringify({ id: "u_1", name: "Dr. Audit", email: "audit@clinic.com", role: "admin" }));
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  
  console.log('Collected Errors:', errors);
  await browser.close();
}
runAudit().catch(console.error);
