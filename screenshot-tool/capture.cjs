const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport to a realistic laptop screen
  await page.setViewportSize({ width: 1440, height: 900 });
  
  try {
    // Navigate to the local dev server
    console.log('Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 });
    
    // Give it an extra second for animations to settle
    await page.waitForTimeout(2000);
    
    // Save to artifact directory
    const screenshotPath = 'C:\\Users\\danat\\.gemini\\antigravity\\brain\\d32f8d83-10e6-44be-ac8d-70914a0624c4\\screenshot.png';
    await page.screenshot({ path: screenshotPath, fullPage: true });
    
    console.log(`Screenshot saved to ${screenshotPath}`);
  } catch (error) {
    console.error('Failed to take screenshot:', error);
  } finally {
    await browser.close();
  }
})();
