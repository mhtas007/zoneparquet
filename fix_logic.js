import fs from 'fs';
import * as cheerio from 'cheerio';

let html = fs.readFileSync('index_backup.html', 'utf-8');

// 3 clicks on logo -> redirect to admin.html
html = html.replace(/window\.location\.hash\s*=\s*['"]#admin['"]/g, "window.location.href = 'admin.html'");

// Fix login redirect (since the above regex already replaced the hash assignment to href assignment)
html = html.replace(/await signInWithEmailAndPassword\(auth, eVal, pVal\);\s*window\.location\.href\s*=\s*'admin\.html';/g, "await signInWithEmailAndPassword(auth, eVal, pVal);\nif (window.PAGE_TYPE !== 'admin') window.location.href = 'admin.html';");

// Fix handleRoute to explicitly manage visibility in observer
let patchHandleRoute = `
    function handleRoute() {
        const hash = window.location.hash;
        const pageType = window.PAGE_TYPE || '';
        const publicApp = document.getElementById('public-app');
        const wholesaleApp = document.getElementById('wholesale-app');
        const adminLogin = document.getElementById('admin-login-app');
        const adminDash = document.getElementById('admin-dashboard-app');
        const adminBottomNav = document.getElementById('admin-bottom-nav');

        if(publicApp) publicApp.classList.add('hidden');
        if(wholesaleApp) wholesaleApp.classList.add('hidden');
        if(adminLogin) adminLogin.classList.add('hidden');
        if(adminDash) { adminDash.classList.add('hidden'); adminDash.classList.remove('flex'); }
        if(adminBottomNav) adminBottomNav.classList.add('hidden');

        if (hash === '#admin' || pageType === 'admin') {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    if(adminLogin) adminLogin.classList.add('hidden');
                    if(adminDash) { adminDash.classList.remove('hidden'); adminDash.classList.add('flex'); }
                    if(adminBottomNav) adminBottomNav.classList.remove('hidden');
                    if(typeof loadAdminProducts === 'function') loadAdminProducts();
                } else {
                    if(adminDash) { adminDash.classList.add('hidden'); adminDash.classList.remove('flex'); }
                    if(adminBottomNav) adminBottomNav.classList.add('hidden');
                    if(adminLogin) adminLogin.classList.remove('hidden');
                }
            });
        } else if (hash === '#whole' || pageType === 'b2b') {
            if(wholesaleApp) { wholesaleApp.classList.remove('hidden'); wholesaleApp.classList.add('block'); }
            if(typeof loadWholesaleProducts === 'function') loadWholesaleProducts();
            if(window.initWholesaleMapIfNeeded && document.getElementById('wMap')) window.initWholesaleMapIfNeeded();
        } else {
            if(publicApp) { publicApp.classList.remove('hidden'); publicApp.classList.add('block'); }
            if(document.getElementById('product-grid')) {
                if(typeof loadPublicProducts === 'function') loadPublicProducts();
            }
            if(window.initMapIfNeeded && document.getElementById('map')) window.initMapIfNeeded();
        }
    }
`;

html = html.replace(/function\s+handleRoute\(\)\s*\{[\s\S]*?(?=\n\s*window\.addEventListener\('hashchange')/, patchHandleRoute + '\n');

// Guard DOM manipulations
html = html.replace(/async function loadPublicProducts\(\) \{/g, "async function loadPublicProducts() { if(!document.getElementById('catalog-loading')) return;");
html = html.replace(/function renderProductsUI\(items\) \{/g, "function renderProductsUI(items) { const grid = document.getElementById('product-grid'); if(!grid) return;");
html = html.replace(/function populateSelectOptions\(items\) \{/g, "function populateSelectOptions(items) { const sel = document.getElementById('productSelect'); if(!sel) return;");
html = html.replace(/function updateOrderPreview\(type\) \{/g, "function updateOrderPreview(type) { if(!document.getElementById('retailPricePreview')) return;");
html = html.replace(/async function loadAdminProducts\(\) \{/g, "async function loadAdminProducts() { if(!document.getElementById('admin-products-table')) return;");
html = html.replace(/async function loadAdminOrders\(\) \{/g, "async function loadAdminOrders() { if(!document.getElementById('admin-orders-table')) return;");
html = html.replace(/async function loadWholesaleProducts\(\) \{/g, "async function loadWholesaleProducts() { if(!document.getElementById('wProduct-grid')) return;");
html = html.replace(/function renderAdminProducts\(items\) \{/g, "function renderAdminProducts(items) { const tb = document.getElementById('admin-products-table'); if(!tb) return;");

// Safe event listeners
html = html.replace(/document\.getElementById\((['"][^'"]+['"])\)\.addEventListener/g, "document.getElementById($1)?.addEventListener");

// Write back to index.html (the SPA version) just in case
fs.writeFileSync('index.html', html);

function createPage(name, title, mainContent, pageType = '') {
    const $ = cheerio.load(html);
    
    $('title').text(`Zone Parquet | ${title}`);
    
    if (pageType) {
        $('head').append(`<script>window.PAGE_TYPE = '${pageType}';</script>`);
    }

    if (pageType === 'admin') {
        $('#public-app').remove();
        $('#wholesale-app').remove();
        $('#admin-login-app').removeClass('hidden'); 
    } else if (pageType === 'b2b') {
        $('#public-app').remove();
        $('#admin-login-app').remove();
        $('#admin-dashboard-app').remove();
        $('#admin-bottom-nav').remove();
        $('#wholesale-app').removeClass('hidden');
    } else {
        $('#wholesale-app').remove();
        $('#admin-login-app').remove();
        $('#admin-dashboard-app').remove();
        $('#admin-bottom-nav').remove();
        $('#public-app').removeClass('hidden');
        $('#public-app > main').html(mainContent);
    }

    // Fix navigation inside public header
    const publicNav = $('#public-app #main-nav');
    if (publicNav.length) {
        publicNav.find('a[href="#hero"]').attr('href', 'index.html');
        publicNav.find('a[href="#about"]').attr('href', 'about.html');
        publicNav.find('a[href="#services"]').attr('href', 'services.html');
        publicNav.find('a[href="#projects"]').attr('href', 'projects.html');
        publicNav.find('a[href="#catalog"]').attr('href', 'catalog.html');
        publicNav.find('a[href="#contact"]').attr('href', 'index.html#contact');
        publicNav.find('a[href="#order"]').attr('href', 'order.html');
    }
    
    $('button[onclick="window.openB2BModal()"]').removeAttr('onclick').attr('onclick', "window.location.href='b2b.html'");

    fs.writeFileSync(`${name}.html`, $.html());
    console.log(`Created ${name}.html`);
}

const $ = cheerio.load(html);
const getOuter = (selector) => $(selector).length ? cheerio.load('<div/>')('div').append($(selector).clone()).html() : '';

const hero = getOuter('#hero');
const whyUs = getOuter('#why-us');
const about = getOuter('#about');
const services = getOuter('#services');
const projects = getOuter('#projects');
const catalog = getOuter('#catalog');
const order = getOuter('#order');

createPage('index', 'سەرەتا', hero + whyUs);
createPage('about', 'دەربارەی ئێمە', hero + about);
createPage('services', 'خزمەتگوزارییەکان', hero + services);
createPage('projects', 'پڕۆژەکان', hero + projects);
createPage('catalog', 'کەتەلۆگ', hero + catalog);
createPage('order', 'داواکردن', hero + order);

createPage('b2b', 'جۆملە و پڕۆژەکان', '', 'b2b');
createPage('admin', 'بەڕێوەبەرایەتی', '', 'admin');

console.log('Successfully applied all robust fixes to admin and split pages!');
