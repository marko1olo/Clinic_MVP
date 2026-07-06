/**
 * full_audit.cjs
 * Comprehensive visual audit: screenshots every tab, logs console errors,
 * checks for layout overflow & text clipping on desktop + mobile.
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://127.0.0.1:5173';
const OUT_DIR = path.join(__dirname, 'audit_round2');

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

const TABS = [
  { name: 'dashboard',       nav: 'Смены',        wait: 2500 },
  { name: 'schedule',        nav: 'Расписание',    wait: 2500 },
  { name: 'patients',        nav: 'Пациенты',      wait: 2500 },
  { name: 'imaging',         nav: 'Снимки',        wait: 3000 },
  { name: 'documents',       nav: 'Документы',     wait: 2500 },
  { name: 'finance',         nav: 'Финансы',       wait: 2500 },
  { name: 'communications',  nav: 'Коммуникации',  wait: 2500 },
  { name: 'marketing',       nav: 'Маркетинг',     wait: 2000 },
  { name: 'settings',        nav: 'Настройки',     wait: 2500 },
];

async function clickNav(page, label) {
  await page.evaluate((lbl) => {
    const all = Array.from(document.querySelectorAll('nav button, nav a, aside button, aside a, [role="navigation"] button'));
    const el = all.find(e => e.textContent.trim().includes(lbl));
    if (el) el.click();
  }, label);
}

async function loginDemo(page) {
  console.log('Logging in via Demo mode...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  // Click demo button (text "Демо")
  const clicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const demo = btns.find(b => b.textContent.includes('Демо') || b.textContent.includes('demo'));
    if (demo) { demo.click(); return true; }
    return false;
  });
  if (!clicked) {
    // Try zero-mode button
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const zero = btns.find(b => b.textContent.includes('Ноль') || b.textContent.includes('Zero') || b.textContent.includes('zero'));
      if (zero) zero.click();
    });
  }
  await new Promise(r => setTimeout(r, 3000));
}

async function checkOverflow(page) {
  return page.evaluate(() => {
    const issues = [];
    const all = document.querySelectorAll('*');
    for (const el of all) {
      if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0) {
        const tag = el.tagName.toLowerCase();
        const id = el.id ? `#${el.id}` : '';
        const cls = el.className && typeof el.className === 'string' ? `.${el.className.trim().split(' ')[0]}` : '';
        issues.push({ selector: `${tag}${id}${cls}`, scrollWidth: el.scrollWidth, clientWidth: el.clientWidth });
      }
    }
    return issues.slice(0, 15);
  });
}

async function collectConsoleErrors(page) {
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      errors.push({ type: msg.type(), text: msg.text().substring(0, 200) });
    }
  });
  return errors;
}

async function auditViewport(browser, label, viewport) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text().substring(0, 200));
    }
  });

  await loginDemo(page);

  const results = [];

  for (const tab of TABS) {
    await clickNav(page, tab.nav);
    await new Promise(r => setTimeout(r, tab.wait));

    const overflows = await checkOverflow(page);
    const ssPath = path.join(OUT_DIR, `${label}_${tab.name}.png`);
    await page.screenshot({ path: ssPath, fullPage: true });
    console.log(`[${label}] ${tab.name}: screenshot saved. Overflow issues: ${overflows.length}`);
    results.push({ tab: tab.name, label, overflows, consoleErrors: [...consoleErrors] });
    consoleErrors.length = 0;
  }

  await page.close();
  return results;
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  try {
    const desktopResults = await auditViewport(browser, 'desktop', DESKTOP);
    const mobileResults = await auditViewport(browser, 'mobile', MOBILE);
    const allResults = [...desktopResults, ...mobileResults];

    const report = {
      timestamp: new Date().toISOString(),
      totalScreenshots: allResults.length,
      tabsWithOverflow: allResults.filter(r => r.overflows.length > 0).map(r => ({
        tab: `${r.label}/${r.tab}`,
        issues: r.overflows
      })),
      consoleErrors: allResults.flatMap(r => r.consoleErrors.map(e => `[${r.label}/${r.tab}] ${e}`))
    };

    fs.writeFileSync(path.join(OUT_DIR, 'audit_report.json'), JSON.stringify(report, null, 2), 'utf8');
    console.log('\n=== AUDIT REPORT ===');
    console.log(`Screenshots: ${allResults.length}`);
    console.log(`Tabs with overflow: ${report.tabsWithOverflow.length}`);
    console.log(`Console errors: ${report.consoleErrors.length}`);
    console.log(`Report saved to: ${OUT_DIR}/audit_report.json`);
  } finally {
    await browser.close();
  }
}

main().catch(e => { console.error(e); process.exit(1); });
