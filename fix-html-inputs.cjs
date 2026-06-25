const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// For Living Room
content = content.replace(
    /(<input type="text" id="apLivImg")/,
    '<input type="file" id="apLivImgFile" accept="image/*" class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-wood-500 font-medium cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-wood-50 file:text-wood-700 hover:file:bg-wood-100 transition-all bg-white mb-2">\n                                $1'
);

// For Bedroom
content = content.replace(
    /(<input type="text" id="apBedImg")/,
    '<input type="file" id="apBedImgFile" accept="image/*" class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-wood-500 font-medium cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-wood-50 file:text-wood-700 hover:file:bg-wood-100 transition-all bg-white mb-2">\n                                $1'
);

fs.writeFileSync('index.html', content, 'utf8');
console.log('Added file inputs successfully!');
