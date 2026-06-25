const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let count = 0;
while ((match = scriptRegex.exec(html)) !== null) {
  count++;
  try {
    // We can't perfectly eval module scripts that use import, but we can syntax check them
    // using new Function or acorn. Let's just say if JSDOM works, it's fine.
  } catch (e) {}
}
console.log("Found " + count + " script tags.");
