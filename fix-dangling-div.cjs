const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

content = content.replace(/<input type="hidden" id="apCategory" value="General">\s*<\/div>/g, '<input type="hidden" id="apCategory" value="General">');

fs.writeFileSync('index.html', content, 'utf8');
console.log('Fixed dangling div!');
