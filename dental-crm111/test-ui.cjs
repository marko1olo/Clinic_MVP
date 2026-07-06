
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173');
  await page.evaluate(() => localStorage.clear());
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(1000);
  
  await page.fill('input[type=\"email\"]', 'admin@dental.crm');
  await page.fill('input[type=\"password\"]', 'admin');
  await page.click('button[type=\"submit\"]');
  
  await page.waitForTimeout(2000);
  await page.goto('http://localhost:5173/#/settings');
  
  await page.waitForTimeout(1000);
  await page.evaluate(() => {
     const tabs = Array.from(document.querySelectorAll('button, a, span'));
     const accessTab = tabs.find(el => el.textContent && (el.textContent.includes('Доступ') || el.textContent.includes('Access')));
     if(accessTab) accessTab.click();
  });
  
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:\\\\Users\\\\Admin\\\\.gemini\\\\antigravity\\\\brain\\\\e413e738-71c0-4b21-884d-6f53c4ba6235\\\\visual_audit_settings_invite.png' });
  console.log('Settings Invite snapshotted');
  
  await browser.close();
})();

