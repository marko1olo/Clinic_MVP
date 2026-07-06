const puppeteer = require('puppeteer');
const fs = require('fs');

async function runAudit() {
  console.log('\\n══════════════════════════════════════');
  console.log('  FULL VISUAL AUDIT — ALL SCREENS');
  console.log('══════════════════════════════════════\\n');

  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Add auth to localStorage before visiting
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('auth_token', 'mock_token');
    localStorage.setItem('auth_user', JSON.stringify({
      id: "u_1", name: "Dr. Audit", email: "audit@clinic.com", role: "admin"
    }));
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // 1. Onboarding
  console.log('▶ 1. Onboarding');
  await page.screenshot({ path: '01_onboarding.png' });
  
  // Skip onboarding
  try {
    const quickSkip = await page.$('.quick-skip-btn, button:has-text("Пропустить")');
    if (quickSkip) {
      await quickSkip.click();
      await new Promise(r => setTimeout(r, ));
    } else {
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Пропустить') || b.textContent.includes('Skip') || b.textContent.includes('Оставить'));
        if (btn) btn.click();
      });
      await new Promise(r => setTimeout(r, ));
    }
  } catch (e) {
    console.log('  [SKIP] Onboarding skip error');
  }
  await page.screenshot({ path: '02_after_onboarding.png' });

  // Helper to click nav buttons
  async function clickNav(label) {
    await page.evaluate((btnLabel) => {
      const btns = Array.from(document.querySelectorAll('.nav-button'));
      const btn = btns.find(b => b.textContent.includes(btnLabel));
      if (btn) btn.click();
    }, label);
    await new Promise(r => setTimeout(r, ));
  }

  // 2. Dashboard
  console.log('\\n▶ 2. Dashboard');
  await clickNav('Дашборд');
  await page.screenshot({ path: '03_dashboard.png' });

  // 3. Schedule
  console.log('\\n▶ 3. Schedule');
  await clickNav('Расписание');
  await page.screenshot({ path: '04_schedule.png' });

  // 4. Patients
  console.log('\\n▶ 4. Patients');
  await clickNav('Пациенты');
  await page.screenshot({ path: '05_patients.png' });

  // 5. Imaging
  console.log('\\n▶ 5. Imaging');
  await clickNav('Снимки');
  await page.screenshot({ path: '06_imaging.png' });

  // 6. Treatment
  console.log('\\n▶ 6. Treatment');
  await clickNav('Лечение');
  await page.screenshot({ path: '07_treatment.png' });

  // 7. Finance
  console.log('\\n▶ 7. Finance');
  await clickNav('Финансы');
  await page.screenshot({ path: '08_finance.png' });

  // 8. Documents
  console.log('\\n▶ 8. Documents');
  await clickNav('Документы');
  await page.screenshot({ path: '09_documents.png' });

  // 9. Communications
  console.log('\\n▶ 9. Communications');
  await clickNav('Коммуникации');
  await page.screenshot({ path: '10_communications.png' });

  // 10. Settings
  console.log('\\n▶ 10. Settings');
  await clickNav('Настройки');
  await page.screenshot({ path: '11_settings.png' });

  console.log('\\n✅ Audit complete! Images saved.');
  await browser.close();
}

runAudit().catch(console.error);
