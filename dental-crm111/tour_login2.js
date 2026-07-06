import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1280, height: 900 }
  });
  const page = await browser.newPage();
  
  const outDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\e413e738-71c0-4b21-884d-6f53c4ba6235\\screenshots';
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log('Navigating to login page...');
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle2' });
  
  console.log('Logging in to Clinic...');
  await page.waitForSelector('.auth-input', { timeout: 10000 });
  
  // Clear any existing values and type
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('.auth-input');
    if (inputs[0]) inputs[0].value = '';
    if (inputs[1]) inputs[1].value = '';
  });
  
  const inputs = await page.$$('.auth-input');
  await inputs[0].type('clinic@example.com');
  await inputs[1].type('dente2026');
  await page.click('button[type="submit"]');
  
  console.log('Waiting for Staff Pin Pad...');
  try {
    await page.waitForSelector('.auth-staff-card', { timeout: 5000 });
    console.log('Staff Pin Pad found, selecting first user...');
    const staffCards = await page.$$('.auth-staff-card');
    if (staffCards.length > 0) {
      await staffCards[0].click();
      await new Promise(r => setTimeout(r, 500));
      
      console.log('Typing PIN...');
      // PIN is 0000
      const buttons = await page.$$('.auth-pin-btn');
      for (const char of ['0', '0', '0', '0']) {
        for (const btn of buttons) {
          const text = await page.evaluate(el => el.textContent, btn);
          if (text === char) {
            await btn.click();
            await new Promise(r => setTimeout(r, 200));
            break;
          }
        }
      }
      console.log('Waiting for Dashboard...');
      await page.waitForSelector('nav .nav-item', { timeout: 10000 });
    }
  } catch (e) {
    console.log('No Staff Pin Pad found, or login failed. Error:', e.message);
  }

  const views = ["shift", "schedule", "patients", "imaging", "visit", "documents", "finance", "communications", "settings", "marketing"];

  for (const view of views) {
    console.log('Taking screenshot for ' + view);
    await page.goto('http://127.0.0.1:5173/#' + view, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 3000));
    await page.screenshot({ path: outDir + '\\audit_' + view + '.png', fullPage: true });
  }

  console.log('All screenshots saved.');
  await browser.close();
})();
