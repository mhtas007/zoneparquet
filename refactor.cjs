const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const wcuStart = content.indexOf('<section id="why-choose-us"');
const wcuEndStr = '</section>';
let wcuEnd = content.indexOf(wcuEndStr, wcuStart);
wcuEnd += wcuEndStr.length;

if (wcuStart !== -1 && wcuEnd !== -1) {
    content = content.substring(0, wcuStart) + content.substring(wcuEnd);
    console.log('Removed why-choose-us section.');
} else {
    console.log('Could not find why-choose-us section.');
}

const servicesStart = content.indexOf('<section id="services"');
const gridStartStr = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">';
let gridStart = content.indexOf(gridStartStr, servicesStart);
gridStart += gridStartStr.length;

const newItems = `
                        <div class="bg-wood-900 p-8 rounded-[2rem] border border-wood-800 hover:border-gold-500/50 transition-colors group">
                            <div class="w-16 h-16 bg-wood-800 text-gold-400 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform"><i class="fas fa-gift"></i></div>
                            <h3 class="text-xl font-bold mb-3 text-white">پاکێجی کامڵ</h3>
                            <p class="text-wood-400 font-medium leading-relaxed">نرخی مەترێک ئیزارە و فۆمیش لەخۆ دەگرێت، بێ خەرجی شاراوە.</p>
                        </div>
                        <div class="bg-wood-900 p-8 rounded-[2rem] border border-wood-800 hover:border-gold-500/50 transition-colors group">
                            <div class="w-16 h-16 bg-wood-800 text-gold-400 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform"><i class="fas fa-shield-alt"></i></div>
                            <h3 class="text-xl font-bold mb-3 text-white">دژە ئاو و شێ</h3>
                            <p class="text-wood-400 font-medium leading-relaxed">پاراستنی تەواوەتی تا ٢٤ کاتژمێر بۆ زۆربەی مۆدێلەکانمان.</p>
                        </div>
                        <div class="bg-wood-900 p-8 rounded-[2rem] border border-wood-800 hover:border-gold-500/50 transition-colors group">
                            <div class="w-16 h-16 bg-wood-800 text-gold-400 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform"><i class="fas fa-star"></i></div>
                            <h3 class="text-xl font-bold mb-3 text-white">هێزی ئەوروپی</h3>
                            <p class="text-wood-400 font-medium leading-relaxed">بەرگەگرتنی ئاست بەرز (AC4 & AC5) دژی ڕووشان و تێکچوون.</p>
                        </div>`;

if (gridStart !== -1 + gridStartStr.length) {
    content = content.substring(0, gridStart) + newItems + content.substring(gridStart);
    console.log('Added features to services section.');
} else {
    console.log('Could not find services grid.');
}

fs.writeFileSync('index.html', content, 'utf8');
console.log('Done.');
