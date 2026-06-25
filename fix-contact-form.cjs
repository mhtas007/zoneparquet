const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Replace the contact form block entirely
const contactFormRegex = /<!-- Contact Form -->[\s\S]*?<\/form>\s*<\/div>/;
if(content.match(contactFormRegex)) {
    content = content.replace(contactFormRegex, '');
    fs.writeFileSync('index.html', content, 'utf8');
    console.log('Successfully removed Contact Form!');
} else {
    console.log('Contact form not found using regex!');
}
