const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

content = content.replace(/document\.addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*\{\s*const\s*apCat\s*=\s*document\.getElementById\('apCategory'\);\s*if\s*\(apCat\)\s*\{\s*apCat\.addEventListener\('change',\s*function\(e\)\s*\{\s*if\(e\.target\.value\s*===\s*'ADD_NEW'\)\s*\{\s*e\.target\.value\s*=\s*'';\s*window\.openCategoryModal\(\);\s*\}\s*\}\);\s*\}\s*\}\);/g, 
`const apCatListener = document.getElementById('apCategory');
        if (apCatListener) {
            apCatListener.addEventListener('change', function(e) {
                if(e.target.value === 'ADD_NEW') {
                    e.target.value = '';
                    window.openCategoryModal();
                }
            });
        }`);

fs.writeFileSync('index.html', content, 'utf8');
console.log('Fixed listener!');
