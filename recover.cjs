const fs = require('fs');
const path = 'C:/Users/Ram Computer/.gemini/antigravity/brain/7b095423-eb46-40d8-9569-b4207d9127ae/.system_generated/logs/transcript_full.jsonl';
if (!fs.existsSync(path)) { console.log('File not found'); process.exit(1); }
const lines = fs.readFileSync(path, 'utf8').split('\n');
let biggestHtml = '';
for (const line of lines) {
  if (!line) continue;
  try {
    const obj = JSON.parse(line);
    // Recursively search for a string that contains '<html lang="ku"'
    const searchString = (val) => {
      if (typeof val === 'string') {
        if (val.includes('<html lang="ku"') && val.length > biggestHtml.length) {
          biggestHtml = val;
        }
      } else if (typeof val === 'object' && val !== null) {
        for (const k in val) searchString(val[k]);
      }
    };
    searchString(obj);
  } catch(e) {}
}
console.log('Biggest HTML length found:', biggestHtml.length);
if (biggestHtml.length > 10000) {
  fs.writeFileSync('recovered_index.html', biggestHtml);
  console.log('Saved to recovered_index.html');
}
