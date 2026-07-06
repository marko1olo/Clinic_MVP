const puppeteer = require('puppeteer');
const path = require('path');

const outDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\e413e738-71c0-4b21-884d-6f53c4ba6235\\scratch';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1400, height: 900 }
  });
  
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle2' });
  
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outDir, 'debug_init.png'), fullPage: true });
  console.log("Saved debug_init.png");
  
  // Try to click Fast Setup
  try {
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const demoBtn = buttons.find(b => b.textContent && b.textContent.includes('🚀'));
      if (demoBtn) demoBtn.click();
    });
  } catch(e) {}
  
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, 'debug_after_onboard.png'), fullPage: true });
  console.log("Saved debug_after_onboard.png");
  
  // Navigate to Imaging
  const navItems = await page.$$('nav a, nav div[role="button"], a');
  for (const el of navItems) {
    const text = await page.evaluate(e => e.textContent, el);
    if (text && (text.includes('Imaging') || text.includes('КТ/Рентген') || text.includes('Снимки'))) {
      await el.click();
      break;
    }
  }
  
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outDir, 'debug_imaging.png'), fullPage: true });
  console.log("Saved debug_imaging.png");
  
  await browser.close();
})();
