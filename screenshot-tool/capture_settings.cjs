const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport to a realistic laptop screen
  await page.setViewportSize({ width: 1440, height: 900 });

  try {
    // Navigate to the local dev server Settings view
    console.log('Navigating to http://localhost:5173/#settings...');
    await page.goto('http://localhost:5173/#settings', { waitUntil: 'networkidle', timeout: 30000 });

    // Give it time for animations to settle and UI to render
    await page.waitForTimeout(3000);

    // Save to artifact directory
    const screenshotPath = 'C:\\Users\\danat\\.gemini\\antigravity\\brain\\d32f8d83-10e6-44be-ac8d-70914a0624c4\\screenshot_settings.png';
    await page.screenshot({ path: screenshotPath, fullPage: true });

    console.log(`Screenshot saved to ${screenshotPath}`);
  } catch (error) {
    console.error('Failed to take screenshot:', error);
  } finally {
    await browser.close();
  }
})();
