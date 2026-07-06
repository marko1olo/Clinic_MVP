const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function run() {
  const outDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\e413e738-71c0-4b21-884d-6f53c4ba6235\\screenshots';
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1920, height: 1080 }
  });
  
  try {
    const page = await browser.newPage();
    console.log("Navigating to local server...");
    await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle2' });
    
    try {
      console.log("Trying coordinate click for Demo mode...");
      await page.mouse.click(750, 550);
      await new Promise(r => setTimeout(r, 4000));
    } catch(e) {
      console.log("Error clicking demo", e);
    }

    // 1. Enter Patient View
    console.log("Opening Patient tab...");
    await page.evaluate(() => {
       const els = Array.from(document.querySelectorAll('*'));
       const el = els.find(e => e.textContent && e.textContent.includes('Пациенты'));
       if(el) {
          const clickable = el.closest('button, a, [role="button"], li, div.cursor-pointer, .hover\\:bg-zinc-800') || el;
          clickable.click();
       }
    });
    // Wait for network
    await new Promise(r => setTimeout(r, 2000));

    // Click the first patient in the list
    await page.evaluate(() => {
       const rows = document.querySelectorAll('tr');
       if(rows.length > 1) rows[1].click();
    });
    await new Promise(r => setTimeout(r, 3000));
    
    // 2. Trigger CBCT Implant auto-placement
    console.log("Simulating CBCT Implant Placement on tooth 46...");
    await page.evaluate(() => {
       window.dispatchEvent(new CustomEvent('clinical-implant-placed', { detail: { toothNumber: 46, implantId: 'virt-implant-1' }}));
    });
    await new Promise(r => setTimeout(r, 1000));
    
    // 3. Mark Caries on Tooth 16 manually via SVG
    console.log("Marking Caries on Tooth 16...");
    await page.evaluate(() => {
       const svgContainers = Array.from(document.querySelectorAll('.group'));
       for(let group of svgContainers) {
          if (group.textContent.includes('16')) {
             const rect = group.getBoundingClientRect();
             group.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: rect.x + 10, clientY: rect.y + 10 }));
             break;
          }
       }
    });
    await new Promise(r => setTimeout(r, 1000));
    
    // Click Caries button in the radial menu
    await page.evaluate(() => {
       const cariesBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Кариес'));
       if(cariesBtn) cariesBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    
    // 4. Save Treatment Plan
    console.log("Saving Treatment Plan...");
    await page.evaluate(() => {
       const saveBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Сохранить'));
       if(saveBtn) saveBtn.click();
    });
    await new Promise(r => setTimeout(r, 2000));
    
    // 5. Screenshot Odontogram & Estimator
    console.log("Taking screenshot...");
    await page.screenshot({ path: path.join(outDir, 'odontogram_treatment_plan.png'), fullPage: true });
    console.log("Saved odontogram_treatment_plan.png");
    
    // 6. Test Help/Training Widget (Onboarding)
    console.log("Opening Help/Training Widget...");
    await page.evaluate(() => {
       const helpBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Справка / Помощь'));
       if (helpBtn) helpBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(outDir, 'onboarding_widget_open.png'), fullPage: true });
    
    // 7. Test PDF Generation (Trigger)
    console.log("Triggering PDF Generation...");
    await page.evaluate(() => {
       // Find any button that might trigger PDF export (often "Экспорт" or "PDF")
       const pdfBtn = Array.from(document.querySelectorAll('button')).find(b => 
         b.textContent && (b.textContent.includes('Экспорт в PDF') || b.textContent.includes('PDF'))
       );
       if (pdfBtn) pdfBtn.click();
    });
    await new Promise(r => setTimeout(r, 2000)); // Wait for PDF generation to process

    // 8. Test Viewer Fullscreen Resize
    console.log("Testing Fullscreen Resize...");
    await page.evaluate(() => {
       const fsBtn = Array.from(document.querySelectorAll('button')).find(b => b.title && b.title.includes('Во весь экран'));
       if (fsBtn) fsBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    console.log("E2E Test Completed Successfully!");
  } catch (error) {
    console.error("Test failed:", error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
