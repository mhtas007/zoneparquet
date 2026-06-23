import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('index.html', 'utf-8');

function createPage(name, title, mainContent, isWholesale = false, isAdmin = false) {
    const $ = cheerio.load(html);
    
    $('title').text(`Zone Parquet | ${title}`);
    
    if (isAdmin) {
        $('#public-app').remove();
        $('#wholesale-app').remove();
        // admin apps stay
        $('#admin-login-app').removeClass('hidden'); // though router handles it, better to show it by default or let router handle it
    } else if (isWholesale) {
        $('#public-app').remove();
        $('#admin-login-app').remove();
        $('#admin-dashboard-app').remove();
        $('#admin-bottom-nav').remove();
        // wholesale stays
        $('#wholesale-app').removeClass('hidden');
    } else {
        $('#wholesale-app').remove();
        $('#admin-login-app').remove();
        $('#admin-dashboard-app').remove();
        $('#admin-bottom-nav').remove();
        $('#public-app').removeClass('hidden');
        
        // Replace main content
        $('#public-app > main').html(mainContent);
    }

    // Since we are changing to multi-page, we should update the nav links in the header
    // In public-app header:
    const publicNav = $('#public-app #main-nav');
    if (publicNav.length) {
        publicNav.find('a[href="#hero"]').attr('href', 'index.html');
        publicNav.find('a[href="#about"]').attr('href', 'about.html');
        publicNav.find('a[href="#services"]').attr('href', 'services.html');
        publicNav.find('a[href="#projects"]').attr('href', 'projects.html');
        publicNav.find('a[href="#catalog"]').attr('href', 'catalog.html');
        publicNav.find('a[href="#contact"]').attr('href', 'index.html#contact'); // if we have a contact section
        publicNav.find('a[href="#order"]').attr('href', 'order.html');
    }
    
    // Also the modal open for B2B should navigate to b2b.html
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

// Create index.html (landing) - Note: I am writing to a new file index_new.html to avoid overwriting the original until I am sure
createPage('index_new', 'سەرەتا', hero + whyUs);

// Create about.html
createPage('about', 'دەربارەی ئێمە', about);

// Create services.html
createPage('services', 'خزمەتگوزارییەکان', services);

// Create projects.html
createPage('projects', 'پڕۆژەکان', projects);

// Create catalog.html
createPage('catalog', 'کەتەلۆگ', catalog);

// Create order.html
createPage('order', 'داواکردن', order);

// Create b2b.html
createPage('b2b', 'جۆملە و پڕۆژەکان', '', true, false);

// Create admin.html
createPage('admin', 'بەڕێوەبەرایەتی', '', false, true);

console.log('Successfully split the single page into multiple pages!');
