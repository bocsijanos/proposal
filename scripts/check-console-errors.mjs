import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
  });

  page.on('pageerror', error => {
    console.log(`❌ PAGE ERROR: ${error.message}`);
  });

  try {
    console.log('🔍 Navigálás az oldalra...');
    await page.goto('http://localhost:3000/boom-marketing-teljes-pelda-2025', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    await page.waitForTimeout(5000);

    console.log('\n📋 Console üzenetek:');
    consoleMessages.forEach(msg => console.log(msg));

    console.log('\n⏸️  Böngésző nyitva marad 30 másodpercig...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('❌ Hiba:', error.message);
  } finally {
    await browser.close();
  }
})();
