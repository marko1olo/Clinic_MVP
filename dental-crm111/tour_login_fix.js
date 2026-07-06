import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1280, height: 900 }
  });
  const page = await browser.newPage();
  
  const outDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\e413e738-71c0-4b21-884d-6f53c4ba6235\\screenshots_fixed';
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log('Navigating to login page...');
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle2' });
  
  console.log('Logging in...');
  await page.waitForSelector('input');
  const inputs = await page.$$('input');
  
  if (inputs.length >= 2) {
    await inputs[0].type('doctor@clinic.com');
    await inputs[1].type('dente2026');
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 2000));
  } else {
    console.log('Inputs not found!');
  }
  
  const pinInputs = await page.$$('input');
  if (pinInputs.length > 0) {
      console.log('Typing PIN...');
      await pinInputs[0].type('1234');
      await new Promise(r => setTimeout(r, 2000));
  } else {
      console.log('No PIN pad found, proceeding');
  }

  const views = ["shift", "schedule", "patients", "imaging", "visit", "documents", "finance", "communications", "settings", "marketing"];

  for (const view of views) {
    console.log('Taking screenshot for ' + view);
    await page.goto('http://127.0.0.1:5173/#' + view, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: outDir + '\\audit_' + view + '.png', fullPage: true });
  }

  console.log('All screenshots saved.');
  await browser.close();
})();
