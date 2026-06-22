import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:17551/vite.svg');
  
  await page.evaluate(() => {
    window.localStorage.setItem('dental-crm:web-ui-preferences:v1', JSON.stringify({ version: 1, selectedWorkspaceRole: 'administrator', savedAt: new Date(Date.now() + 100000).toISOString() }));
  });
  
  await page.goto('http://127.0.0.1:17551/#finance');
  await page.waitForTimeout(2000);
  
  const state = await page.evaluate(() => {
    const raw = window.localStorage.getItem('dental-crm:web-ui-preferences:v1');
    return {
      raw,
      roleDisplay: document.querySelector('.current-staff-role')?.innerText,
      currentViewClass: document.querySelector('#workspace-content')?.className
    };
  });
  
  console.log(state);
  await browser.close();
})();