import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new', // or false if we want to see it, but headless: 'new' is standard.
    defaultViewport: { width: 1440, height: 900 },
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--use-gl=angle', // Enable WebGL in headless
      '--use-angle=gl',
      '--ignore-gpu-blocklist'
    ]
  });

  const outDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\e413e738-71c0-4b21-884d-6f53c4ba6235\\screenshots';
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const page = await browser.newPage();
  
  // Capture console logs to diagnose Cornerstone errors
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => {
      console.log('PAGE ERROR STACK:', err.stack || err.message);
  });

  await page.evaluateOnNewDocument(() => {
      window.addEventListener('unhandledrejection', (event) => {
          console.error('Unhandled Rejection:', event.reason?.message || event.reason);
      });
  });

  try {
    console.log('Navigating to login page...');
    await page.goto('http://127.0.0.1:5173/login', { waitUntil: 'networkidle2' });
    
    // Wait for the login bypass to take effect and redirect to the dashboard
    await page.waitForSelector('.omnibar-container', { timeout: 15000 }).catch(() => console.log('Omnibar wait failed, continuing...'));

    await new Promise(r => setTimeout(r, 2000));
    
    console.log('Navigating to #imaging...');
    await page.goto('http://127.0.0.1:5173/#imaging');

    try {
      console.log('Waiting for onboarding demo mode button...');
      const demoButton = await page.waitForSelector('button::-p-text(Попробовать демо-режим)', { timeout: 2000 });
      if (demoButton) {
        console.log('Clicking demo mode button...');
        await demoButton.click();
        await new Promise(r => setTimeout(r, 2000));
      }
    } catch (e) {
      console.log('No onboarding screen detected, proceeding...');
    }

    console.log('Waiting for DICOM files input...');
    await new Promise(r => setTimeout(r, 5000)); // let rendering finishput', { timeout: 10000 });
    
    console.log('Uploading real DICOM files (full folder)...');
    const dicomDir = 'C:\\Users\\Admin\\Downloads\\_Organized\\Folder_Medical_DICOM_Cases\\Егорова Ирина Сергеевна КЛКТ 13х15 14.07.25\\Егорова Ирина Сергеевна КЛКТ 13х15 14.07.25\\IMGDATA\\20250714\\S0000001';
    
    // Read all files (there should be around ~400 DICOM slices)
    const files = fs.readdirSync(dicomDir)
      .filter(f => !f.startsWith('.'))
      .map(f => path.join(dicomDir, f));
      
    console.log(`Found ${files.length} slices.`);
    
    const fileInput = await page.$('#dicom-folder-input');
    await page.evaluate(() => {
      const input = document.getElementById('dicom-folder-input');
      if (input) {
        input.removeAttribute('webkitdirectory');
        input.removeAttribute('directory');
      }
    });
    await fileInput.uploadFile(...files);
    
    console.log(`Waiting 25 seconds for parsing, volume construction, and rendering...`);
    await new Promise(r => setTimeout(r, 25000));
    
    console.log('Taking 4-viewport screenshot...');
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(outDir, 'dicom_main_view.png'), fullPage: true });

    console.log('Testing viewport maximize (double click on AXIAL)...');
    // Double click axial (top left quadrant approx)
    const rect = await page.evaluate(() => {
      const el = document.querySelectorAll('div > div > div > div > div')[0]; // first viewport container
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {x: r.x, y: r.y, width: r.width, height: r.height};
    });
    if (rect) {
      await page.mouse.click(rect.x + rect.width/2, rect.y + rect.height/2, { clickCount: 2 });
      await new Promise(r => setTimeout(r, 1000));
      console.log('Taking maximized screenshot...');
      await page.screenshot({ path: path.join(outDir, 'dicom_maximized.png'), fullPage: true });
      
      // Restore
      console.log('Restoring 4-viewport mode...');
      await page.mouse.click(rect.x + rect.width/2, rect.y + rect.height/2, { clickCount: 2 });
      await new Promise(r => setTimeout(r, 1000));
    }

    console.log('Activating Spline tool...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const splineBtn = buttons.find(b => b.textContent && b.textContent.includes('Дуга'));
      if (splineBtn) splineBtn.click();
    });
    
    await new Promise(r => setTimeout(r, 500));
    
    console.log('Drawing spline...');
    // Get precise coordinates of the AXIAL viewport
    const axialBounds = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('div'));
      const axialBadge = els.find(el => el.textContent === 'AXIAL' && el.style.position === 'absolute');
      if (axialBadge && axialBadge.parentElement) {
        const rect = axialBadge.parentElement.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      }
      return null;
    });

    if (axialBounds) {
      const startX = axialBounds.x + axialBounds.width * 0.2;
      const startY = axialBounds.y + axialBounds.height * 0.5;
      
      await page.mouse.click(startX, startY);
      await new Promise(r => setTimeout(r, 200));
      await page.mouse.click(startX + axialBounds.width * 0.2, startY - axialBounds.height * 0.2);
      await new Promise(r => setTimeout(r, 200));
      await page.mouse.click(startX + axialBounds.width * 0.4, startY - axialBounds.height * 0.2);
      await new Promise(r => setTimeout(r, 200));
      await page.mouse.click(startX + axialBounds.width * 0.6, startY);
      
      // Double click to finish spline
      await new Promise(r => setTimeout(r, 100));
      await page.mouse.click(startX + axialBounds.width * 0.6, startY);
    }
    
    await new Promise(r => setTimeout(r, 1000));
    
    console.log('Generating Panorex...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const panBtn = buttons.find(b => b.textContent && b.textContent.includes('Панорама'));
      if (panBtn) panBtn.click();
    });
    
    await new Promise(r => setTimeout(r, 5000));
    await page.screenshot({ path: outDir + '\\dicom_panorex.png', fullPage: true });

    console.log('Testing Panorex minimize...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const minBtn = buttons.find(b => b.title === 'Свернуть в угол');
      if (minBtn) minBtn.click();
    });
    
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: outDir + '\\dicom_panorex_minimized.png', fullPage: true });

    // Restore panorex
    await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('div'));
      const minWindow = els.find(el => el.title === 'Нажмите чтобы развернуть');
      if (minWindow) minWindow.click();
    });
    await new Promise(r => setTimeout(r, 500));

    console.log('Testing Clinical Overlays (Nerve & Implant)...');
    
    // Find cross-section canvas to click
    const csCanvasBounds = await page.evaluate(() => {
      // Find the second canvas in the Panorex window (the cross-sections)
      const canvases = Array.from(document.querySelectorAll('canvas'));
      if (canvases.length >= 2) {
         // Usually first is Panorex, second is Cross-Section
         const rect = canvases[1].getBoundingClientRect();
         return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      }
      return null;
    });

    if (csCanvasBounds) {
      // Click middle of Cross-Section with Shift (Implant)
      const centerX = csCanvasBounds.x + csCanvasBounds.width / 2;
      const centerY = csCanvasBounds.y + csCanvasBounds.height / 2;
      
      await page.keyboard.down('Shift');
      await page.mouse.click(centerX, centerY);
      await page.keyboard.up('Shift');
      await new Promise(r => setTimeout(r, 500));
      
      // Click bottom of Cross-Section with Ctrl (Nerve)
      await page.keyboard.down('Control');
      await page.mouse.click(centerX, centerY + csCanvasBounds.height * 0.3);
      await page.keyboard.up('Control');
      await new Promise(r => setTimeout(r, 500));
      
      // Take screenshot of Cross-Section with implant and nerve overlay
      await page.screenshot({ path: outDir + '\\dicom_panorex_clinical.png', fullPage: true });
    }

    // Close panorex
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      // Find the panorex close button (should be the last one, or has title "Закрыть")
      const closeBtn = buttons.reverse().find(b => b.title === 'Закрыть');
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    console.log('Testing Main Viewer minimize...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const minBtn = buttons.find(b => b.title === 'Свернуть в угол');
      if (minBtn) minBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: outDir + '\\dicom_main_minimized.png', fullPage: true });


  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    await browser.close();
  }
})();
