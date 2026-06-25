const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

content = content.replace(/inputUrl\.value = url;\s*img\.style\.opacity = 1;/g, 
`inputUrl.value = url;
                    inputUrl.dispatchEvent(new Event('input'));`);

fs.writeFileSync('index.html', content, 'utf8');
console.log('Fixed preview dispatch!');
