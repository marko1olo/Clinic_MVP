const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const outDir = "C:\\Users\\Admin\\.gemini\\antigravity\\brain\\19527560-fbad-4059-97a2-76c3b38db9cc";

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto("http://localhost:5173", { waitUntil: "networkidle0", timeout: 10000 });
  await new Promise(r => setTimeout(r, 1500));

  // Get all sidebar nav items by their unique class/text
  const navItems = await page.evaluate(() => {
    const items = [];
    document.querySelectorAll("nav button, nav a, aside button, aside a, [class*=sidebar] button").forEach(el => {
      const txt = el.textContent?.trim();
      if (txt && txt.length > 1 && txt.length < 30) {
        items.push({ text: txt, tag: el.tagName });
      }
    });
    return items;
  });
  console.log("Nav items:", JSON.stringify(navItems));

  // Screenshot shift view (default)
  await page.screenshot({ path: path.join(outDir, "audit_shift.png"), fullPage: false });

  // Try to click schedule
  await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll("button, a"));
    const btn = all.find(el => el.textContent?.trim().startsWith("\xc7\xe0\xef\xe8\xf1"));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(outDir, "audit_schedule.png"), fullPage: false });

  // Patients
  await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll("button, a"));
    const btn = all.find(el => el.textContent?.trim().startsWith("\xcf\xe0\xf6\xe8"));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(outDir, "audit_patients.png"), fullPage: false });

  // Imaging
  await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll("button, a"));
    const btn = all.find(el => el.textContent?.trim().startsWith("\xd1\xed\xe8\xec"));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(outDir, "audit_imaging.png"), fullPage: false });

  // Visit
  await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll("button, a"));
    const btn = all.find(el => el.textContent?.trim().startsWith("\xcf\xf0\xe8\xe5\xec") || el.textContent?.trim().startsWith("\xcf\xf0\xe8\xb8\xec"));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(outDir, "audit_visit.png"), fullPage: false });

  // Finance
  await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll("button, a"));
    const btn = all.find(el => el.textContent?.trim().startsWith("\xce\xef\xeb\xe0\xf2"));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(outDir, "audit_finance.png"), fullPage: false });

  // Settings
  await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll("button, a"));
    const btn = all.find(el => el.textContent?.trim().startsWith("\xcd\xe0\xf1\xf2\xf0"));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(outDir, "audit_settings.png"), fullPage: false });

  await browser.close();
  console.log("Done");
})();
