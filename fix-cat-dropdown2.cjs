const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

let startIdx = -1;
let endIdx = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('window.populateCategoryDropdowns = function() {')) {
        startIdx = i;
    }
    if (startIdx !== -1 && i > startIdx && lines[i].includes('        };')) {
        endIdx = i;
        break;
    }
}

if (startIdx !== -1 && endIdx !== -1) {
    const newCode = `        window.populateCategoryDropdowns = function() {
            const apCat = document.getElementById('apCategory');
            if(apCat) {
                apCat.innerHTML = '<option value="" disabled selected>پۆلێنێک هەڵبژێرە...</option>';
                allCategories.forEach(c => {
                    const val = c.nameEn || c.name;
                    apCat.innerHTML += '<option value="' + val + '">' + c.name + '</option>';
                });
                apCat.innerHTML += '<option value="ADD_NEW" class="font-bold text-wood-600 bg-wood-50">+ زیادکردنی پۆلێنی نوێ</option>';
            }
        };
        
        document.addEventListener('DOMContentLoaded', () => {
            const apCat = document.getElementById('apCategory');
            if (apCat) {
                apCat.addEventListener('change', function(e) {
                    if(e.target.value === 'ADD_NEW') {
                        e.target.value = '';
                        window.openCategoryModal();
                    }
                });
            }
        });`;
        
    lines.splice(startIdx, endIdx - startIdx + 1, newCode);
    fs.writeFileSync('index.html', lines.join('\n'), 'utf8');
    console.log('Successfully replaced category dropdown logic!');
} else {
    console.log('Could not find the block to replace.');
}
