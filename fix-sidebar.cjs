const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const newButton = `                <button onclick="switchAdminTab('categories')" id="nav-categories" class="w-full text-right px-6 py-4 rounded-2xl text-wood-400 hover:text-white hover:bg-white/5 font-bold transition-all flex items-center gap-4 border border-transparent">
                    <div class="w-10 h-10 rounded-xl bg-wood-900/50 flex items-center justify-center border border-wood-800"><i class="fas fa-tags text-gray-400 text-lg"></i></div> 
                    پۆلێنەکان (Categories)
                </button>`;

content = content.replace(/<button onclick="switchAdminTab\('products'\)" id="nav-products"/g, newButton + '\n                <button onclick="switchAdminTab(\'products\')" id="nav-products"');

content = content.replace(/document\.getElementById\('tab-products'\)\.classList\.add\('hidden'\);/g, "document.getElementById('tab-products').classList.add('hidden');\n            document.getElementById('tab-categories').classList.add('hidden');");

fs.writeFileSync('index.html', content, 'utf8');
console.log('Added Category to Sidebar!');
