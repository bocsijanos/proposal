import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log('🔍 Navigálás az oldalra...');
    await page.goto('http://localhost:3000/boom-marketing-teljes-csomag-2025', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    // Várunk egy kicsit a renderelésre
    await page.waitForTimeout(3000);

    console.log('\n📄 Oldal cím:', await page.title());

    // Ellenőrizzük a section-öket
    console.log('\n📦 Section elemek:');
    const sections = await page.$$('section');
    console.log(`   Talált sections: ${sections.length}`);

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const isVisible = await section.isVisible();
      const boundingBox = await section.boundingBox();
      console.log(`   Section #${i + 1}: ${isVisible ? '✅ látható' : '❌ nem látható'} ${boundingBox ? `(${Math.round(boundingBox.height)}px magas)` : ''}`);
    }

    // H1-ek
    console.log('\n📌 H1 elemek:');
    const h1s = await page.$$('h1');
    for (let i = 0; i < h1s.length; i++) {
      const text = await h1s[i].innerText();
      const isVisible = await h1s[i].isVisible();
      console.log(`   ${isVisible ? '✅' : '❌'} "${text.substring(0, 60)}..."`);
    }

    // H2-k
    console.log('\n📌 H2 elemek:');
    const h2s = await page.$$('h2');
    for (let i = 0; i < h2s.length; i++) {
      const text = await h2s[i].innerText();
      const isVisible = await h2s[i].isVisible();
      console.log(`   ${isVisible ? '✅' : '❌'} "${text.substring(0, 60)}..."`);
    }

    // Teljes oldal screenshot
    console.log('\n📸 Screenshot készítése...');
    await page.screenshot({
      path: '/tmp/proposal-full.png',
      fullPage: true
    });
    console.log('   ✅ Screenshot mentve: /tmp/proposal-full.png');

    // Viewport screenshot is
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({
      path: '/tmp/proposal-viewport.png',
      fullPage: false
    });
    console.log('   ✅ Viewport screenshot mentve: /tmp/proposal-viewport.png');

    // Console hibák
    const logs = [];
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        logs.push(`${msg.type().toUpperCase()}: ${msg.text()}`);
      }
    });

    if (logs.length > 0) {
      console.log('\n⚠️  Console üzenetek:');
      logs.forEach(log => console.log(`   ${log}`));
    }

    // Layout info
    console.log('\n📏 Layout információk:');
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    console.log(`   Body magasság: ${bodyHeight}px`);
    console.log(`   Viewport magasság: ${viewportHeight}px`);

  } catch (error) {
    console.error('❌ Hiba:', error.message);
  } finally {
    await browser.close();
  }
})();
