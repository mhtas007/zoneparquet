const puppeteer = require('puppeteer');

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({headless: "new"});
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => {
    console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText);
  });

  console.log("Navigating to Vercel app...");
  await page.goto('https://zoneparquet.vercel.app', { waitUntil: 'networkidle0', timeout: 30000 });
  
  const products = await page.$$('.product-card');
  console.log(`Found ${products.length} product cards rendered.`);
  
  await browser.close();
  console.log("Done.");
})();
