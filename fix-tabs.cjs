const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const targetStr = `                const collections = [
                    { id: '8mm', name: 'لەمینات ٨ ملم' },
                    { id: '10mm', name: 'لەمینات ١٠ ملم' },
                    { id: '12mm', name: 'لەمینات ١٢ ملم' }
                ];
                
                collections.forEach(c => {
                    html += \`<button class="${filterClass} bg-white text-gray-600 hover:bg-gray-50 px-8 py-3.5 rounded-2xl text-sm font-bold shadow-sm border border-gray-100 transition-all transform hover:-translate-y-1" data-filter="${c.id}">${c.name}</button>\`;
                });`;

const newStr = `                allCategories.forEach(c => {
                    const id = c.nameEn || c.name;
                    html += \`<button class="${filterClass} bg-white text-gray-600 hover:bg-gray-50 px-8 py-3.5 rounded-2xl text-sm font-bold shadow-sm border border-gray-100 transition-all transform hover:-translate-y-1" data-filter="${id}">${c.name}</button>\`;
                });`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, newStr);
    fs.writeFileSync('index.html', content, 'utf8');
    console.log('Fixed tabs successfully!');
} else {
    console.log('Target string not found! Checking alternative...');
    const alternativeTargetStr = `                const collections = [
                    { id: '8mm', name: '????? ? ' },
                    { id: '10mm', name: '????? ?? ' },
                    { id: '12mm', name: '????? ?? ' }
                ];`;
    if (content.includes("const collections = [")) {
        console.log("Found collections array");
    }
}
