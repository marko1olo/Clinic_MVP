const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:5174', { waitUntil: 'networkidle', timeout: 20000 });

  // Try opening the active visit
  const openBtn = page.locator('button', { hasText: 'Открыть прием' }).first();
  if (await openBtn.count() > 0) {
    await openBtn.click();
    await page.waitForTimeout(2500);
  } else {
    // Navigate via sidebar
    const nav = page.locator('text=Прием').first();
    if (await nav.count() > 0) await nav.click();
    await page.waitForTimeout(2500);
  }

  // Full page
  await page.screenshot({ path: 'C:/Clinic_MVP/shot_visit_full.png', fullPage: true });

  // Scroll to tooth map and take focused shot
  await page.evaluate(() => {
    const el = document.querySelector('.tooth-map');
    if (el) el.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Clinic_MVP/shot_tooth_map.png', fullPage: false });

  await browser.close();
  console.log('done');
})().catch(e => { console.error(e); process.exit(1); });
