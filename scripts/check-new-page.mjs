import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log('🔍 Navigálás az új minta oldalra...');
    await page.goto('http://localhost:3000/boom-marketing-teljes-pelda-2025', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    await page.waitForTimeout(3000);

    console.log('\n📄 Oldal cím:', await page.title());

    const sections = await page.$$('section');
    console.log(`\n📦 Talált sections: ${sections.length}`);

    console.log('\n📌 H2 elemek:');
    const h2s = await page.$$('h2');
    for (let i = 0; i < h2s.length; i++) {
      const text = await h2s[i].innerText();
      console.log(`   ${i + 1}. "${text}"`);
    }

    // Screenshot
    console.log('\n📸 Screenshot készítése...');
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({
      path: '/tmp/proposal-new-full.png',
      fullPage: true
    });
    console.log('   ✅ Screenshot mentve: /tmp/proposal-new-full.png');

  } catch (error) {
    console.error('❌ Hiba:', error.message);
  } finally {
    await browser.close();
  }
})();
