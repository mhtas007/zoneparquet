const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const targetStr = `                apCat.innerHTML += '<option value="ADD_NEW" class="font-bold text-wood-600 bg-wood-50">+ زیادکردنی پۆلێنی نوێ</option>';`;
content = content.replace(targetStr, '');

const targetListenerStr = `        const apCatListener = document.getElementById('apCategory');
        if (apCatListener) {
            apCatListener.addEventListener('change', function(e) {
                if(e.target.value === 'ADD_NEW') {
                    e.target.value = '';
                    window.openCategoryModal();
                }
            });
        }`;
content = content.replace(targetListenerStr, '');

fs.writeFileSync('index.html', content, 'utf8');
console.log('Removed ADD_NEW from dropdown!');
