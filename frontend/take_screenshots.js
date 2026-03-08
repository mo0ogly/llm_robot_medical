import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

(async () => {
    const figuresDir = path.join(process.cwd(), '..', 'figures');
    if (!fs.existsSync(figuresDir)) {
        fs.mkdirSync(figuresDir, { recursive: true });
    }

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    console.log("Navigating to http://localhost:5173");
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });

    // Wait until loaded
    await page.waitForSelector('text/DA VINCI', { timeout: 10000 });
    await new Promise(r => setTimeout(r, 2000));

    // 1. Safe Scenario
    console.log("Setting scenario to safe...");
    await page.select('select', 'safe');
    await new Promise(r => setTimeout(r, 2500));
    await page.screenshot({ path: path.join(figuresDir, '1_safe_dashboard.png') });
    console.log("Screenshot 1 saved.");

    // 2. Poisoned HL7
    console.log("Setting scenario to poison...");
    await page.select('select', 'poison');
    await new Promise(r => setTimeout(r, 1000));
    await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const askBtn = btns.find(b => b.textContent.includes('DEMANDER A'));
        if (askBtn) askBtn.click();
    });
    await new Promise(r => setTimeout(r, 6000)); // wait for stream simulated response
    await page.screenshot({ path: path.join(figuresDir, '2_corrupted_hl7.png') });
    console.log("Screenshot 2 saved.");

    // 3. Ransomware initiated (frozen vitals)
    console.log("Setting scenario to ransomware...");
    await page.select('select', 'ransomware');
    await new Promise(r => setTimeout(r, 1000));
    await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const askBtn = btns.find(b => b.textContent.includes('DEMANDER A'));
        if (askBtn) askBtn.click();
    });
    await new Promise(r => setTimeout(r, 3000)); // The stream takes some time, wait until glitch
    await page.screenshot({ path: path.join(figuresDir, '3_frozen_vitals.png') });
    console.log("Screenshot 3 saved.");

    // 4. Ransomware Screen
    console.log("Waiting for ransomware screen...");
    await new Promise(r => setTimeout(r, 5000)); // Wait for red screen takeover completely
    await page.screenshot({ path: path.join(figuresDir, '4_ransomware.png') });
    console.log("Screenshot 4 saved.");

    // Help Modal Image just in case user wants it but they didn't specify a file for it.
    // However, they said "il maqnue lorgane et le ramsoware et l'aide". 
    // Let's also capture the 'aide' modal
    console.log("Capturing Help Modal...");
    // Reset page or reload
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));
    // Click the Aide Baseline button
    const buttons = await page.$$('button');
    for (let btn of buttons) {
        let text = await page.evaluate(el => el.textContent, btn);
        if (text.includes('Aide: Poison Lent')) {
            await btn.click();
            break;
        }
    }
    await new Promise(r => setTimeout(r, 1500)); // wait for modal open
    await page.screenshot({ path: path.join(figuresDir, '5_help_modal.png') });

    await browser.close();
    console.log("All screenshots captured.");
})();
