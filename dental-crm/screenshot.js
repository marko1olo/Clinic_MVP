import puppeteer from 'puppeteer';
import { setTimeout } from 'timers/promises';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });

  // Give the React app some extra time to render
  await setTimeout(2000);

  await page.screenshot({ path: 'screenshot_current.png', fullPage: true });

  await browser.close();
})();
