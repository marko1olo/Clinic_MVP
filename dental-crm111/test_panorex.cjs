const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const outDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\e413e738-71c0-4b21-884d-6f53c4ba6235\\screenshots';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1400, height: 900 },
    args: ['--start-maximized', '--no-sandbox']
  });
  
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  try {
    console.log("Navigating to local server...");
    await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle2' });

    // Bypass Onboarding by clicking the Demo Mode button (has rocket emoji)
    try {
      await page.waitForSelector('button', { timeout: 2000 });
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const demoBtn = buttons.find(b => b.textContent && b.textContent.includes('🚀'));
        if (demoBtn) demoBtn.click();
      });
      console.log("Bypassed Onboarding via emoji click.");
    } catch(e) {}

    await delay(1000);

    // Navigate to Imaging module
    const navItems = await page.$$('nav a, nav div[role="button"], a, div[role="button"]');
    for (const el of navItems) {
      const text = await page.evaluate(e => e.textContent, el);
      if (text && (text.includes('Imaging') || text.includes('КТ/Рентген') || text.includes('Снимки'))) {
        await el.click();
        console.log("Navigated to Imaging.");
        break;
      }
    }
    
    await delay(1000);

    // Provide DICOM zip file
    const dicomPath = "C:\\Clinic_MVP\\dental-crm\\test_dicom.zip";
    console.log("Uploading DICOM cases from: ", dicomPath);
    
    // We expect the 'dicom-folder-input' to be present. We need to find it and upload.
    const fileInput = await page.waitForSelector('#dicom-folder-input', { timeout: 10000 }).catch(() => null);
    if (fileInput) {
       await fileInput.uploadFile(dicomPath);
       console.log(`Uploaded DICOM zip.`);
    } else {
       console.log("No file input found.");
    }

    // Wait for Volume Construction
    console.log("Waiting for Cornerstone3D to construct volume...");
    await delay(15000); // Need enough time for rendering engine to init
    
    console.log("Activating Panoramic Spline Tool...");
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const title = await page.evaluate(el => el.title || el.textContent, btn);
      if (title && title.includes('Дуга')) {
        await btn.click();
        console.log("Spline Tool activated.");
        break;
      }
    }
    
    // We will simulate drawing a spline by interacting with the React state or dispatching mouse events on the canvas
    const canvas = await page.$('canvas');
    if (canvas) {
      const bbox = await canvas.boundingBox();
      const centerX = bbox.x + bbox.width / 2;
      const centerY = bbox.y + bbox.height / 2;
      
      console.log("Drawing spline...");
      const pts = [
        { x: centerX - 60, y: centerY + 60 },
        { x: centerX - 30, y: centerY - 40 },
        { x: centerX, y: centerY - 60 },
        { x: centerX + 30, y: centerY - 40 },
        { x: centerX + 60, y: centerY + 60 }
      ];
      
      for(const pt of pts) {
         await page.mouse.move(pt.x, pt.y);
         await page.mouse.down();
         await delay(100);
         await page.mouse.up();
         await delay(100);
      }
      
      // Double click to end spline
      await page.mouse.click(pts[pts.length-1].x, pts[pts.length-1].y, { clickCount: 2 });
    }
    
    await delay(2000);

    // Click Panorex Button
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('Панорама')) {
        await btn.click();
        console.log("Generating Panorex...");
        break;
      }
    }

    console.log("Waiting for Web Worker Panorex generation...");
    await delay(5000);

    await page.screenshot({ path: path.join(outDir, 'dicom_panorex_unwrapped.png'), fullPage: true });
    console.log("Saved dicom_panorex_unwrapped.png");

    console.log("Activating Implant Tool...");
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('Имплантат')) {
        await btn.click();
        console.log("Implant Tool activated.");
        break;
      }
    }
    
    await delay(1000);
    
    console.log("Selecting Osstem TSIII 4.0x11.5...");
    const brandSelect = await page.$('#implantBrandSelect');
    if (brandSelect) {
      await brandSelect.select('Osstem TSIII');
    }
    const sizeSelect = await page.$('#implantSizeSelect');
    if (sizeSelect) {
      await sizeSelect.select('4.0x11.5');
    }

    console.log("Placing Implant and Nerve on Cross Section...");
    await delay(3000);
    // The cross section canvas is the second one in the portal
    const canvases = await page.$$('canvas');
    if (canvases.length >= 2) {
       const csCanvas = canvases[canvases.length - 1]; // last canvas usually cross section
       const bbox = await csCanvas.boundingBox();
       if (bbox) {
          // Shift + Click for implant
          await page.keyboard.down('Shift');
          await page.mouse.click(bbox.x + bbox.width/2, bbox.y + bbox.height/2);
          await page.keyboard.up('Shift');
          await delay(500);

          // Ctrl + Click for nerve
          await page.keyboard.down('Control');
          await page.mouse.click(bbox.x + bbox.width/2 + 10, bbox.y + bbox.height/2 + 30);
          await page.keyboard.up('Control');
          await delay(2000);
          
          await page.screenshot({ path: path.join(outDir, 'dicom_panorex_clinical.png'), fullPage: true });
          console.log("Saved dicom_panorex_clinical.png");
       }
    } else {
       console.log("Not enough canvases found for implant placement.");
    }
    
    console.log("Triggering Save Planning...");
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('Сохранить')) {
        await btn.click();
        console.log("Clicked Save Planning.");
        break;
      }
    }
    
    await delay(2000); // Wait for mock API to return 200

    console.log("Triggering Generate PDF Report...");
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('Отчет')) {
        await btn.click();
        console.log("Clicked Generate Report.");
        break;
      }
    }

    // Wait for html2canvas and jspdf to process
    await delay(5000);

  } catch(e) {
    console.error("Test failed:", e);
  } finally {
    await browser.close();
  }
})();
