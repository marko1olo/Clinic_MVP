const puppeteer = require('puppeteer');
const fs = require('fs');

async function runAudit() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,1080']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1080 });

  page.on('console', msg => {
    if (msg.type() === 'error') console.log('PAGE ERROR:', msg.text());
  });
  page.on('pageerror', err => {
    console.log('PAGE EXCEPTION:', err.toString());
  });

  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('dente_clinic_token', 'audit_clinic_token');
    localStorage.setItem('dente_staff_token', 'audit_staff_token');
    localStorage.setItem('dente_onboarding_dismissed', 'true');
    localStorage.setItem('dente_clinic_mode', 'demo');
  });

  await page.setRequestInterception(true);
  page.on('request', request => {
    const url = request.url();
    if (url.includes('/api/auth/user/me')) {
      request.respond({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ user: { id: 'u1', name: 'Dr. Audit', role: 'owner' } })
      });
    } else if (url.includes('/api/clinic/dashboard') || url.includes('/dashboard')) {
      request.respond({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          clinicSettings: {
            profile: { mode: 'demo' },
            staff: [{ id: 'u1', name: 'Dr. Audit', role: 'owner' }]
          }
        })
      });
    } else {
      request.continue();
    }
  });

  await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(e => console.log('Navigation warning:', e.message));

  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
}

runAudit().catch(console.error);
