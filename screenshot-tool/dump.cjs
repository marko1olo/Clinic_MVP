const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    const html = await page.content();
    console.log(html);
  } catch (error) {
    console.error('Failed:', error);
  } finally {
    await browser.close();
  }
})();
