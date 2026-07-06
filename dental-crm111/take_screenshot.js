const puppeteer = require('puppeteer');
const fs = require('fs');

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1920, height: 1080 }
  });
  
  try {
    const page = await browser.newPage();
    console.log("Navigating to local server...");
    await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle2' });
    
    try {
      console.log("Clicking Demo mode...");
      await page.mouse.click(750, 550);
      await new Promise(r => setTimeout(r, 4000));
    } catch(e) {
      console.log("Error clicking demo", e);
    }

    console.log("Opening Patient tab...");
    await page.evaluate(() => {
       const els = Array.from(document.querySelectorAll('*'));
       const el = els.find(e => e.textContent && e.textContent.includes('Пациенты'));
       if(el) {
          const clickable = el.closest('button, a, [role="button"], li, div.cursor-pointer, .hover\\:bg-zinc-800') || el;
          clickable.click();
       }
    });
    await new Promise(r => setTimeout(r, 2000));

    // Click the first patient in the list
    await page.evaluate(() => {
       const rows = document.querySelectorAll('tr');
       if(rows.length > 1) rows[1].click();
    });
    await new Promise(r => setTimeout(r, 3000));
    
    // Dispatch events
    console.log("Simulating events...");
    await page.evaluate(() => {
       window.dispatchEvent(new CustomEvent('clinical-implant-placed', { detail: { toothNumber: 46, implantId: 'virt-implant-1' }}));
    });
    await new Promise(r => setTimeout(r, 1000));
    
    await page.evaluate(() => {
       const svgContainers = Array.from(document.querySelectorAll('.group'));
       for(let group of svgContainers) {
          if (group.textContent.includes('16')) {
             group.dispatchEvent(new MouseEvent('click', { bubbles: true }));
             setTimeout(() => {
                 const cariesOpt = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Кариес'));
                 if(cariesOpt) cariesOpt.click();
             }, 500);
             break;
          }
       }
    });
    await new Promise(r => setTimeout(r, 2000));
    
    await page.evaluate(() => {
       const buttons = Array.from(document.querySelectorAll('button'));
       const saveBtn = buttons.find(b => b.textContent.includes('Сохранить'));
       if(saveBtn) saveBtn.click();
    });
    await new Promise(r => setTimeout(r, 2000));
    
    const screenshotPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\e413e738-71c0-4b21-884d-6f53c4ba6235\\screenshots\\odontogram_treatment_plan.png';
    console.log("Taking screenshot...");
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log("Saved screenshot to", screenshotPath);
    
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await browser.close();
  }
}

run();
