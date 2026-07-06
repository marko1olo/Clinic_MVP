import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1280, height: 900 }
  });
  const page = await browser.newPage();
  
  const views = ["shift", "schedule", "patients", "imaging", "visit", "documents", "finance", "communications", "settings", "marketing"];
  const outDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\e413e738-71c0-4b21-884d-6f53c4ba6235\\screenshots';
  
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const view of views) {
    console.log('Navigating to http://127.0.0.1:5173/#' + view);
    await page.goto('http://127.0.0.1:5173/#' + view, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: outDir + '\\audit_' + view + '.png', fullPage: true });
  }

  console.log('All screenshots saved.');
  await browser.close();
})();
