const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  try {
    console.log("Navigating to app...");
    await page.goto('http://127.0.0.1:5173/#imaging', { waitUntil: 'networkidle2' });
    
    console.log("Waiting for imaging panel...");
    await page.waitForSelector('.imaging-panel', { timeout: 10000 });
    
    console.log("Taking screenshot...");
    await page.screenshot({ path: 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\e413e738-71c0-4b21-884d-6f53c4ba6235\\screenshots\\imaging_ui_test.png' });
    console.log("Done.");

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await browser.close();
  }
})();
