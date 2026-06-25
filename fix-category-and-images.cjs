const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// 1. Remove Category field completely
const catBlockRegex = /<div class="space-y-2">\s*<label class="block text-sm font-bold text-gray-700">پۆلێن \(Category\)<\/label>[\s\S]*?<\/div>/;
content = content.replace(catBlockRegex, '<input type="hidden" id="apCategory" value="General">');

// 2. Add file inputs for Liv and Bed images
const livInputStr = `<label class="block text-xs font-bold text-gray-500 uppercase tracking-wider">وێنەی ژووری دانیشتن (Living Room)</label>
                                <input type="text" id="apLivImg" placeholder="https://..." class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-wood-500 font-mono" dir="ltr">`;
const livNewStr = `<label class="block text-xs font-bold text-gray-500 uppercase tracking-wider">وێنەی ژووری دانیشتن (Living Room)</label>
                                <input type="file" id="apLivImgFile" accept="image/*" class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-wood-500 font-medium cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-wood-50 file:text-wood-700 hover:file:bg-wood-100 transition-all bg-white mb-2">
                                <input type="text" id="apLivImg" placeholder="https://..." class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-wood-500 font-mono" dir="ltr">`;
content = content.replace(livInputStr, livNewStr);

const bedInputStr = `<label class="block text-xs font-bold text-gray-500 uppercase tracking-wider">وێنەی ژووری خەوتن (Bedroom)</label>
                                <input type="text" id="apBedImg" placeholder="https://..." class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-wood-500 font-mono" dir="ltr">`;
const bedNewStr = `<label class="block text-xs font-bold text-gray-500 uppercase tracking-wider">وێنەی ژووری خەوتن (Bedroom)</label>
                                <input type="file" id="apBedImgFile" accept="image/*" class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-wood-500 font-medium cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-wood-50 file:text-wood-700 hover:file:bg-wood-100 transition-all bg-white mb-2">
                                <input type="text" id="apBedImg" placeholder="https://..." class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-wood-500 font-mono" dir="ltr">`;
content = content.replace(bedInputStr, bedNewStr);

// 3. Add JS listeners for Liv and Bed images
const mainImgListenerRegex = /\}\);\s*\}\s*catch\(error\)\s*\{\s*console\.error\(error\);\s*\}\s*\}\);/;
const listenersToAdd = `});
            } catch(error) {
                console.error(error);
            }
        });

        document.getElementById('apLivImgFile').addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if (!file) return;
            showToast("خەریکی بەرزکردنەوەی وێنەکەین...", "info");
            try {
                window.uploadImageFile(file).then(url => {
                    if (url) {
                        const inputUrl = document.getElementById('apLivImg');
                        inputUrl.value = url;
                        showToast("وێنەکە بوو بە لینک!", "success");
                        e.target.value = ''; 
                    }
                }).catch(error => { showToast("هەڵە ڕوویدا", "error"); });
            } catch(error) { console.error(error); }
        });

        document.getElementById('apBedImgFile').addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if (!file) return;
            showToast("خەریکی بەرزکردنەوەی وێنەکەین...", "info");
            try {
                window.uploadImageFile(file).then(url => {
                    if (url) {
                        const inputUrl = document.getElementById('apBedImg');
                        inputUrl.value = url;
                        showToast("وێنەکە بوو بە لینک!", "success");
                        e.target.value = ''; 
                    }
                }).catch(error => { showToast("هەڵە ڕوویدا", "error"); });
            } catch(error) { console.error(error); }
        });`;

content = content.replace(mainImgListenerRegex, listenersToAdd);

// 4. Reset file inputs on modal open
const resetStr = `document.getElementById('apMainImgFile').value = '';`;
content = content.replace(resetStr, `document.getElementById('apMainImgFile').value = '';
            if(document.getElementById('apLivImgFile')) document.getElementById('apLivImgFile').value = '';
            if(document.getElementById('apBedImgFile')) document.getElementById('apBedImgFile').value = '';`);

fs.writeFileSync('index.html', content, 'utf8');
console.log('Category removed and images listeners added!');
