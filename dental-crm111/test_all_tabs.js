import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox']
  });

  const outDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\e413e738-71c0-4b21-884d-6f53c4ba6235\\screenshots';
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const page = await browser.newPage();

  try {
    console.log('Navigating to login page...');
    await page.goto('http://127.0.0.1:5173/login', { waitUntil: 'networkidle2' });
    
    console.log('Logging in...');
    await page.waitForSelector('.auth-input', { timeout: 10000 });
    
    const inputs = await page.$$('.auth-input');
    await inputs[0].click({ clickCount: 3 });
    await inputs[0].press('Backspace');
    await inputs[0].type('owner@example.com');
    await inputs[1].click({ clickCount: 3 });
    await inputs[1].press('Backspace');
    await inputs[1].type('dente2026');
    
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 2000));

    console.log('Typing PIN...');
    try {
        await page.waitForSelector('.auth-pin-button', { timeout: 5000 });
        const pinKeys = await page.$$('.auth-pin-button');
        if (pinKeys.length >= 10) {
            await pinKeys[10].click(); // 0
            await pinKeys[10].click(); // 0
            await pinKeys[10].click(); // 0
            await pinKeys[10].click(); // 0
        }
    } catch (e) {
        console.log('No PIN pad found or error: ' + e.message);
    }
    
    await new Promise(r => setTimeout(r, 2000));
    
    const tabs = [
      { id: '#shift', name: 'shift' },
      { id: '#schedule', name: 'schedule' },
      { id: '#patients', name: 'patients' },
      { id: '#imaging', name: 'imaging' },
      { id: '#visit', name: 'visit' },
      { id: '#documents', name: 'documents' },
      { id: '#finance', name: 'finance' },
      { id: '#communications', name: 'communications' },
      { id: '#settings', name: 'settings' },
      { id: '#marketing', name: 'marketing' }
    ];

    for (const tab of tabs) {
      console.log(`Navigating to ${tab.id}...`);
      await page.goto(`http://127.0.0.1:5173/${tab.id}`, { waitUntil: 'networkidle2' });
      await new Promise(r => setTimeout(r, 2000)); // wait for data to load
      await page.screenshot({ path: path.join(outDir, `tab_${tab.name}.png`), fullPage: true });
    }

    console.log('Done.');

  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    await browser.close();
  }
})();
