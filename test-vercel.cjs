const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: 'new'});
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => {
    console.log('REQUEST FAILED:', request.url(), request.failure().errorText);
  });

  await page.goto('https://zoneparquet.vercel.app', { waitUntil: 'networkidle0' });
  
  const products = await page.$$('.bg-white.rounded-3xl'); // Assuming product cards have this class
  console.log(`Found ${products.length} product cards.`);
  
  await browser.close();
})();
