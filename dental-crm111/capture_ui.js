import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 }
  });
  const page = await browser.newPage();
  console.log('Navigating to http://127.0.0.1:5173 ...');
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle2' });
  
  // wait 2 seconds
  await new Promise(r => setTimeout(r, 2000));

  // Login
  console.log('Logging in...');
  try {
    await page.type('input[type="email"]', 'admin@example.com');
    await page.type('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 2000));
    console.log('Logged in successfully!');
  } catch (e) {
    console.log('Login form not found or already logged in.', e.message);
  }
  
  const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\e413e738-71c0-4b21-884d-6f53c4ba6235\\scratch';
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }

  // 1. Screenshot Dashboard
  await page.screenshot({ path: `${artifactDir}\\dashboard.png`, fullPage: false });
  console.log('Saved dashboard screenshot.');

  // 2. Click Patients Tab (assuming standard text or href)
  try {
    await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      const patientsLink = links.find(a => a.textContent.includes('Пациенты') || a.href.includes('#patients'));
      if (patientsLink) patientsLink.click();
    });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: `${artifactDir}\\patients_view.png`, fullPage: true });
    console.log('Saved patients_view screenshot.');
  } catch (e) {
    console.error('Failed to navigate to Patients tab', e.message);
  }

  // 3. Click Imaging Tab
  try {
    await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      const imagingLink = links.find(a => a.textContent.includes('Снимки') || a.href.includes('#imaging'));
      if (imagingLink) imagingLink.click();
    });
    await new Promise(r => setTimeout(r, 2000));
    
    // Evaluate clicks on any mock data if it exists
    await page.evaluate(() => {
      const cbctButton = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('КТ') || b.textContent.includes('CBCT'));
      if (cbctButton) cbctButton.click();
    });
    await new Promise(r => setTimeout(r, 2000));

    await page.screenshot({ path: `${artifactDir}\\imaging_view.png`, fullPage: true });
    console.log('Saved imaging_view screenshot.');
  } catch (e) {
    console.error('Failed to navigate to Imaging tab', e.message);
  }

  await browser.close();
  console.log('Done.');
})();
