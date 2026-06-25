const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');
let match = content.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gi);
let combined = match ? match.map(s => s.replace(/<\/?script[^>]*>/gi, '')).join('\n') : '';
fs.writeFileSync('temp.js', combined);
