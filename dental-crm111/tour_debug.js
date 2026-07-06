import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1280, height: 900 }
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  const outDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\e413e738-71c0-4b21-884d-6f53c4ba6235\\screenshots_fixed';
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log('Navigating to login page...');
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle2' });
  
  await page.screenshot({ path: outDir + '\\audit_before_login.png', fullPage: true });
  
  console.log('Logging in...');
  try {
    await page.waitForSelector('input', { timeout: 10000 });
    const inputs = await page.$$('input');
    
    if (inputs.length >= 2) {
      await inputs[0].type('doctor@clinic.com');
      await inputs[1].type('dente2026');
      await page.keyboard.press('Enter');
      await new Promise(r => setTimeout(r, 2000));
    } else {
      console.log('Inputs not found!');
    }
  } catch (e) {
    console.log('Error waiting for inputs:', e.message);
  }
  
  await browser.close();
})();
