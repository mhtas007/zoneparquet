import fs from 'fs';
import * as cheerio from 'cheerio';

// 1. Patch the original HTML
let html = fs.readFileSync('index_backup.html', 'utf-8');

// Patch addEventListeners
html = html.replace(/document\.getElementById\((['"][^'"]+['"])\)\.addEventListener/g, "document.getElementById($1)?.addEventListener");

// Patch populateSelectOptions
html = html.replace(/const sel = document\.getElementById\('productSelect'\);\s*sel\.innerHTML/g, "const sel = document.getElementById('productSelect');\nif(sel) sel.innerHTML");

// Patch handleRoute
html = html.replace(/const hash = window\.location\.hash;/g, "const hash = window.location.hash;\nconst pageType = window.PAGE_TYPE || '';");
html = html.replace(/if \(hash === '#admin'\)/g, "if (hash === '#admin' || pageType === 'admin')");
html = html.replace(/else if \(hash === '#whole'\)/g, "else if (hash === '#whole' || pageType === 'b2b')");

fs.writeFileSync('index.html', html); // Write patched SPA

// 2. Split logic
function createPage(name, title, mainContent, pageType = '') {
    const $ = cheerio.load(html);
    
    $('title').text(`Zone Parquet | ${title}`);
    
    if (pageType) {
        // Inject page type script
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

    // Update nav links
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
    
    // b2b modal
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

// Prepend hero to all public pages as user requested
createPage('index', 'سەرەتا', hero + whyUs);
createPage('about', 'دەربارەی ئێمە', hero + about);
createPage('services', 'خزمەتگوزارییەکان', hero + services);
createPage('projects', 'پڕۆژەکان', hero + projects);
createPage('catalog', 'کەتەلۆگ', hero + catalog);
createPage('order', 'داواکردن', hero + order);

createPage('b2b', 'جۆملە و پڕۆژەکان', '', 'b2b');
createPage('admin', 'بەڕێوەبەرایەتی', '', 'admin');

console.log('Successfully fixed JS and split the pages!');
