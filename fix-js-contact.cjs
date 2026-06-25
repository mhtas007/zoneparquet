const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const jsBlock = `        // TELEGRAM CONTACT FORM SUBMISSION
        document.getElementById('telegramContactForm').addEventListener('submit', async function(e) {`;

const newJsBlock = `        // TELEGRAM CONTACT FORM SUBMISSION
        const contactFormElem = document.getElementById('telegramContactForm');
        if(contactFormElem) contactFormElem.addEventListener('submit', async function(e) {`;

content = content.replace(jsBlock, newJsBlock);
fs.writeFileSync('index.html', content, 'utf8');
console.log('Fixed JS listener for Contact Form!');
