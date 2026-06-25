const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

content = content.replace(/closeCategoryModal\(\);/g, 'window.closeCategoryModal();');
content = content.replace(/loadAdminCategories\(\);/g, 'window.loadAdminCategories();');
content = content.replace(/refreshCatalogCategories\(\);/g, 'window.refreshCatalogCategories();');

// Also make refreshCatalogCategories global just in case it's called from HTML or somewhere else
content = content.replace(/async function refreshCatalogCategories\(\) \{/g, 'window.refreshCatalogCategories = async function() {');

fs.writeFileSync('index.html', content, 'utf8');
console.log('Fixed window functions!');
