

        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        wood: {
                            50: '#fdf8f6', 100: '#f2e8e5', 200: '#eaddd7', 300: '#e0cec7',
                            400: '#d2bab0', 500: '#a37c6c', 600: '#8b6456', 700: '#6b4d42',
                            800: '#4c372f', 900: '#2d211c', 950: '#1a1310'
                        },
                        gold: {
                            400: '#E6C96B', 500: '#D4AF37', 600: '#AA8C2C',
                        }
                    },
                    fontFamily: {
                        'kurdish': ['Franklin Gothic Book', 'Speda Bold', 'Speda', 'sans-serif'],
                    },
                    boxShadow: {
                        'premium': '0 25px 50px -12px rgba(139, 100, 86, 0.25)',
                        'glow': '0 0 15px rgba(212, 175, 55, 0.5)',
                        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
                    }
                }
            }
        }
    



      const ONESIGNAL_APP_ID = "7188fc71-50a7-4d0d-8b3d-3b11d5c1880e"; // App ID added
      const ONESIGNAL_REST_API_KEY = "os_v2_app_ogepy4kqu5gq3cz5hmi5lqmibztxvhulm2dep652mg5ef32ong2lyvz5fcz3gvzhowqdks6m4ctojij2sp4o54674rpy4fpq26fhuoy"; // API Key added

      window.OneSignalDeferred = window.OneSignalDeferred || [];
      OneSignalDeferred.push(async function(OneSignal) {
        await OneSignal.init({
          appId: ONESIGNAL_APP_ID,
          notifyButton: {
            enable: true,
            colors: {
                'circle.background': '#a37c6c',
                'circle.foreground': 'white',
            }
          },
        });
      });
      
      // Function to send push notification to Admins
        window.sendAdminPushNotification = function(title, message) {
            fetch("/api/notify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title,
                    message: message
                })
            }).catch(err => console.error("OneSignal proxy push error:", err));
        };
    

        const TELEGRAM_BOT_TOKEN = '7905473054:AAFVXdYAeI2kzjP-j2WrqQH5_njuE-i4Ghc'; 
        const TELEGRAM_CHAT_ID = '-5280233277';
    

        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
        import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
        import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
        import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-storage.js";

        // User's provided Firebase config
        const firebaseConfig = {
            apiKey: "AIzaSyAOtmYUkTG2a4fANLjB2Dthmml9qeSsCas",
            authDomain: "zoneparquet.firebaseapp.com",
            projectId: "zoneparquet",
            storageBucket: "zoneparquet.firebasestorage.app",
            messagingSenderId: "951503893378",
            appId: "1:951503893378:web:efbc5bffdb21ac4559959b"
        };

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);
        const storage = getStorage(app);

        // Global State
        let allProducts = [];
        let allCategories = [];
        let invoiceItems = [];

        async function loadAdminB2b() {
            try {
                const querySnapshot = await getDocs(collection(db, "b2b_partners"));
                let b2bReqs = [];
                querySnapshot.forEach((doc) => { b2bReqs.push({ docId: doc.id, ...doc.data() }); });
                
                b2bReqs.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
                
                const tbody = document.getElementById('adminB2bTable');
                tbody.innerHTML = '';
                if(b2bReqs.length === 0){
                    tbody.innerHTML = '<tr><td colspan="6" class="p-8 text-center text-gray-400 font-bold text-lg"><i class="fas fa-handshake block text-3xl mb-2 text-gray-300"></i> هیچ داواکارییەکی B2B نییە.</td></tr>';
                    return;
                }
                b2bReqs.forEach(req => {
                    tbody.innerHTML += `
                        <tr class="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                            <td class="p-5 text-gray-900 font-bold">${req.companyName || ''}</td>
                            <td class="p-5 text-gray-600">${req.contactName || ''}</td>
                            <td class="p-5"><a href="tel:${req.phone}" class="text-blue-500 hover:text-blue-700 font-mono font-bold" dir="ltr">${req.phone || ''}</a></td>
                            <td class="p-5 text-gray-600">${req.projectType || ''}</td>
                            <td class="p-5 text-gray-600 font-mono font-bold">${req.area || 0} m²</td>
                            <td class="p-5 text-gray-500 text-sm font-mono">${req.createdAt ? new Date(req.createdAt).toLocaleString('en-GB') : ''}</td>
                        </tr>
                    `;
                });
            } catch(e) {
                console.error("Error loading b2b: ", e);
                document.getElementById('adminB2bTable').innerHTML = '<tr><td colspan="6" class="p-8 text-center text-red-400 font-bold text-lg">هەڵەیەک ڕوویدا لە هێنانەوەی داتا.</td></tr>';
            }
        }

        window.switchAdminTab = function(tabName) {
            document.querySelectorAll('[id^="tab-"]').forEach(t => t.classList.add('hidden'));
            document.getElementById('tab-' + tabName).classList.remove('hidden');
            if(tabName === 'b2b') loadAdminB2b();
        }

        // UI Utility: Show Toast
        window.uploadImageFile = async function(file) {
            if(!file) return null;
            const storageRef = ref(storage, 'products/' + Date.now() + '_' + file.name);
            await uploadBytes(storageRef, file);
            return await getDownloadURL(storageRef);
        };

        window.showToast = function(message, type = 'success') {
            const toast = document.getElementById('toast');
            const msgSpan = document.getElementById('toastMsg');
            const titleSpan = document.getElementById('toastTitle');
            const icon = toast.querySelector('i');
            msgSpan.textContent = message;
            
            if(type === 'error') { 
                icon.className = 'fas fa-exclamation-circle text-5xl text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.6)]';
                titleSpan.textContent = "هەڵە ڕوویدا";
                titleSpan.classList.replace('text-gray-400', 'text-red-300');
            } else { 
                icon.className = 'fas fa-check-circle text-5xl text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.6)]';
                titleSpan.textContent = "سەرکەوتوو بوو";
                titleSpan.classList.replace('text-red-300', 'text-gray-400');
            }
            
            toast.classList.add('show');
            setTimeout(() => { toast.classList.remove('show'); }, 5000);
        }

        // UI Utility: Confirm Modal
        window.showConfirmModal = function(text, onYesCallback) {
            document.getElementById('confirmModalText').innerText = text;
            const modal = document.getElementById('confirmModal');
            const content = document.getElementById('confirmModalContent');
            
            modal.classList.remove('hidden');
            setTimeout(() => { modal.classList.remove('opacity-0'); content.classList.remove('scale-95'); content.classList.add('scale-100'); }, 10);

            const btnYes = document.getElementById('confirmBtnYes');
            const btnNo = document.getElementById('confirmBtnNo');
            
            const newBtnYes = btnYes.cloneNode(true);
            const newBtnNo = btnNo.cloneNode(true);
            btnYes.parentNode.replaceChild(newBtnYes, btnYes);
            btnNo.parentNode.replaceChild(newBtnNo, btnNo);

            const closeIt = () => {
                modal.classList.add('opacity-0');
                content.classList.remove('scale-100');
                content.classList.add('scale-95');
                setTimeout(() => modal.classList.add('hidden'), 300);
            };

            newBtnNo.addEventListener('click', closeIt);
            newBtnYes.addEventListener('click', () => { closeIt(); onYesCallback(); });
        }

        // Display current date in admin
        const today = new Date();
        document.getElementById('currentDateDisplay').innerText = today.toLocaleDateString('ku-IQ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        // === PROFESSIONAL FEATURES SYSTEM ===
        const featureColorMap = {
            blue:    { bg: 'bg-blue-50',    border: 'border-blue-200',    text: 'text-blue-700',    iconBg: 'bg-blue-100',    ring: 'ring-blue-200' },
            wood:    { bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700',   iconBg: 'bg-amber-100',   ring: 'ring-amber-200' },
            orange:  { bg: 'bg-orange-50',  border: 'border-orange-200',  text: 'text-orange-700',  iconBg: 'bg-orange-100',  ring: 'ring-orange-200' },
            green:   { bg: 'bg-green-50',   border: 'border-green-200',   text: 'text-green-700',   iconBg: 'bg-green-100',   ring: 'ring-green-200' },
            purple:  { bg: 'bg-purple-50',  border: 'border-purple-200',  text: 'text-purple-700',  iconBg: 'bg-purple-100',   ring: 'ring-purple-200' },
            pink:    { bg: 'bg-pink-50',    border: 'border-pink-200',    text: 'text-pink-700',    iconBg: 'bg-pink-100',    ring: 'ring-pink-200' },
            indigo:  { bg: 'bg-indigo-50',  border: 'border-indigo-200',  text: 'text-indigo-700',  iconBg: 'bg-indigo-100',   ring: 'ring-indigo-200' },
            yellow:  { bg: 'bg-yellow-50',  border: 'border-yellow-200',  text: 'text-yellow-700',  iconBg: 'bg-yellow-100',   ring: 'ring-yellow-200' },
            teal:    { bg: 'bg-teal-50',    border: 'border-teal-200',    text: 'text-teal-700',    iconBg: 'bg-teal-100',    ring: 'ring-teal-200' },
            gold:    { bg: 'bg-amber-50',   border: 'border-amber-300',   text: 'text-amber-700',   iconBg: 'bg-amber-100',   ring: 'ring-amber-200' },
            cyan:    { bg: 'bg-cyan-50',    border: 'border-cyan-200',    text: 'text-cyan-700',    iconBg: 'bg-cyan-100',    ring: 'ring-cyan-200' },
            slate:   { bg: 'bg-slate-50',   border: 'border-slate-200',   text: 'text-slate-700',   iconBg: 'bg-slate-100',   ring: 'ring-slate-200' },
        };

        window.addFeatureRow = function(icon, color, value) {
            const list = document.getElementById('featuresList');
            const colors = featureColorMap[color] || featureColorMap['blue'];
            const rowId = 'feat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
            const row = document.createElement('div');
            row.id = rowId;
            row.className = `flex items-center gap-3 ${colors.bg} p-3 rounded-xl border ${colors.border} animate-[fadeInUp_0.3s_ease-out]`;
            row.innerHTML = `
                <div class="w-10 h-10 ${colors.iconBg} rounded-lg flex items-center justify-center flex-shrink-0">
                    <i class="fas ${icon} ${colors.text} text-lg"></i>
                </div>
                <input type="text" class="feature-value flex-grow px-3 py-2 bg-white rounded-lg border ${colors.border} font-bold text-sm outline-none focus:ring-2 ${colors.ring} transition" placeholder="نرخی تایبەتمەندی بنووسە..." value="${value || ''}" dir="rtl">
                <input type="hidden" class="feature-icon" value="${icon}">
                <input type="hidden" class="feature-color" value="${color}">
                <button type="button" onclick="document.getElementById('${rowId}').remove()" class="w-9 h-9 bg-white hover:bg-red-50 text-red-400 hover:text-red-600 rounded-lg flex items-center justify-center flex-shrink-0 border ${colors.border} hover:border-red-200 transition">
                    <i class="fas fa-times"></i>
                </button>
            `;
            list.appendChild(row);
        };

        window.getFeaturesFromForm = function() {
            const rows = document.querySelectorAll('#featuresList > div');
            const features = [];
            rows.forEach(row => {
                const val = row.querySelector('.feature-value').value.trim();
                if (val) {
                    features.push({
                        icon: row.querySelector('.feature-icon').value,
                        color: row.querySelector('.feature-color').value,
                        value: val
                    });
                }
            });
            return features;
        };

        window.loadFeaturesIntoForm = function(features) {
            document.getElementById('featuresList').innerHTML = '';
            if (features && features.length > 0) {
                features.forEach(f => {
                    window.addFeatureRow(f.icon, f.color, f.value);
                });
            }
        };

        window.renderFeaturesInModal = function(features) {
            const container = document.getElementById('modalFeatures');
            const grid = document.getElementById('modalFeaturesGrid');
            if (!features || features.length === 0) {
                container.classList.add('hidden');
                return;
            }
            container.classList.remove('hidden');
            grid.innerHTML = '';
            features.forEach(f => {
                const colors = featureColorMap[f.color] || featureColorMap['blue'];
                grid.innerHTML += `
                    <div class="${colors.bg} rounded-xl p-3 border ${colors.border} flex items-center gap-3 transition-transform hover:scale-[1.03]">
                        <div class="w-9 h-9 ${colors.iconBg} rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                            <i class="fas ${f.icon} ${colors.text} text-base"></i>
                        </div>
                        <span class="${colors.text} font-bold text-sm leading-tight">${f.value}</span>
                    </div>
                `;
            });
        };

        window.renderFeatureBadgesOnCard = function(features) {

            if (!features || features.length === 0) return '';
            // Show max 3 feature mini-badges on card
            const maxShow = features.slice(0, 3);
            let html = '<div class="flex flex-wrap gap-1.5 mt-3">';
            maxShow.forEach(f => {
                const colors = featureColorMap[f.color] || featureColorMap['blue'];
                html += `<span class="${colors.bg} ${colors.text} px-2 py-1 rounded-md text-[11px] font-bold border ${colors.border} flex items-center gap-1"><i class="fas ${f.icon} text-[10px]"></i> ${f.value}</span>`;
            });
            if (features.length > 3) {
                html += `<span class="bg-gray-100 text-gray-500 px-2 py-1 rounded-md text-[11px] font-bold border border-gray-200">+${features.length - 3}</span>`;
            }
            html += '</div>';
            return html;
        };
        // === END FEATURES SYSTEM ===

        // Helper: render feature badges for admin table
        window.renderAdminTableFeatures = function(features, waterproof) {
            let html = '';
            if (waterproof) html += '<span class="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100 inline-flex items-center gap-1 mb-1"><i class="fas fa-shield-alt"></i> دژە ئاو</span>';
            if (features && features.length > 0) {
                html += '<div class="flex flex-wrap gap-1 mt-1">';
                const show = features.slice(0, 2);
                for (const f of show) {
                    const c = featureColorMap[f.color] || featureColorMap['blue'];
                    html += '<span class="' + c.bg + ' ' + c.text + ' px-2 py-0.5 rounded text-[10px] font-bold border ' + c.border + '"><i class="fas ' + f.icon + ' text-[9px]"></i> ' + f.value + '</span>';
                }
                if (features.length > 2) html += '<span class="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[10px] font-bold">+' + (features.length - 2) + '</span>';
                html += '</div>';
            }
            if (!waterproof && (!features || features.length === 0)) html = '-';
            return html;
        };

        // Routing Logic
        function handleRoute() {
            const hash = window.location.hash;
            const publicApp = document.getElementById('public-app');
            const wholesaleApp = document.getElementById('wholesale-app');
            const adminLogin = document.getElementById('admin-login-app');
            const adminDash = document.getElementById('admin-dashboard-app');
            const adminBottomNav = document.getElementById('admin-bottom-nav');

            if(publicApp) publicApp.classList.add('hidden');
            if(wholesaleApp) wholesaleApp.classList.add('hidden');
            if(adminLogin) adminLogin.classList.add('hidden');
            if(adminDash) {
                adminDash.classList.add('hidden');
                adminDash.classList.remove('flex');
            }
            if(adminBottomNav) adminBottomNav.classList.add('hidden');

            if (hash === '#admin') {
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        adminDash.classList.remove('hidden');
                        adminDash.classList.add('flex');
                        if(adminBottomNav) adminBottomNav.classList.remove('hidden');
                        loadAdminProducts(); 
                    } else {
                        adminLogin.classList.remove('hidden');
                        if(adminBottomNav) adminBottomNav.classList.add('hidden');
                    }
                });
            } else if (hash === '#whole') {
                if(wholesaleApp) {
                    wholesaleApp.classList.remove('hidden');
                    wholesaleApp.classList.add('block');
                }
                loadWholesaleProducts();
                if(window.initWholesaleMapIfNeeded) window.initWholesaleMapIfNeeded();
            } else {
                if(publicApp) {
                    publicApp.classList.remove('hidden');
                    publicApp.classList.add('block');
                    
                    const sections = ['hero', 'about', 'services', 'projects', 'catalog', 'order', 'contact'];
                    const targetSection = hash ? hash.substring(1) : 'hero';
                    
                    let found = false;
                    sections.forEach(secId => {
                        const sec = publicApp.querySelector('#' + secId);
                        if(sec) {
                            if(secId === targetSection || (targetSection === '' && secId === 'hero')) {
                                sec.classList.remove('hidden');
                                found = true;
                            } else {
                                sec.classList.add('hidden');
                            }
                        }
                    });
                    
                    if(!found) {
                        const hero = publicApp.querySelector('#hero');
                        if(hero) hero.classList.remove('hidden');
                    }
                    
                    const wcu = document.getElementById('why-choose-us');
                    if (wcu) {
                        if (targetSection === 'hero' || targetSection === '') {
                            wcu.className = "py-20 bg-wood-950 relative -mt-10 z-20 mx-4 md:mx-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-wood-800 transition-all duration-500 origin-top";
                        } else {
                            wcu.className = "py-4 bg-wood-950 relative z-20 mx-4 md:mx-8 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] border border-wood-800 transition-all duration-500 origin-top scale-75 opacity-90 -mb-10";
                        }
                    }
                    
                    window.scrollTo({top: 0, behavior: 'instant'});
                }
                loadPublicProducts();
                if(window.initMapIfNeeded) window.initMapIfNeeded();
            }
        }
        window.addEventListener('hashchange', handleRoute);
        
        // Fetch Data from Firestore
        async function fetchProducts() {
            try {
                const querySnapshot = await getDocs(collection(db, "products"));
                let items = [];
                querySnapshot.forEach((doc) => { items.push({ docId: doc.id, ...doc.data() }); });
                return items;
            } catch (error) {
                console.error("Firebase Read Error:", error);
                if (error.code === 'permission-denied') {
                    showToast("هەڵە! تکایە ڕێگەپێدانەکانی فایەربەیس (Rules) چاک بکە بەپێی ڕێنماییەکان", "error");
                } else {
                    showToast("کێشە لە پەیوەندی داتابەیس هەیە", "error");
                }
                return [];
            }
        }

        async function fetchCategories() {
            try {
                const querySnapshot = await getDocs(collection(db, "categories"));
                let items = [];
                querySnapshot.forEach((doc) => { items.push({ docId: doc.id, ...doc.data() }); });
                // Sort categories
                items.sort((a,b) => (a.name > b.name) ? 1 : -1);
                return items;
            } catch (error) {
                console.error("Firebase Read Categories Error:", error);
                return [];
            }
        }
        
        window.loadAdminCategories = async function() {
            try {
                allCategories = await fetchCategories();
                const tbody = document.getElementById('adminCategoriesTable');
                if(!tbody) return;
                tbody.innerHTML = '';
                if(allCategories.length === 0){
                    tbody.innerHTML = '<tr><td colspan="3" class="p-8 text-center text-gray-400 font-bold text-lg"><i class="fas fa-folder-open block text-3xl mb-2 text-gray-300"></i> هیچ پۆلێنێک نییە</td></tr>';
                    return;
                }
                
                allCategories.forEach(c => {
                    tbody.innerHTML += `
                        <tr class="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                            <td class="p-4 font-bold text-gray-800 text-lg">${c.name}</td>
                            <td class="p-4 font-medium text-gray-500 font-mono text-sm" dir="ltr">${c.nameEn || '-'}</td>
                            <td class="p-4 text-center space-x-2 space-x-reverse">
                                <button onclick="window.editCategory('${c.docId}')" class="text-blue-500 hover:bg-blue-50 w-12 h-12 rounded-xl transition-colors inline-flex items-center justify-center border border-transparent hover:border-blue-100"><i class="fas fa-pen text-lg"></i></button>
                                <button onclick="window.deleteCategory('${c.docId}')" class="text-red-500 hover:bg-red-50 w-12 h-12 rounded-xl transition-colors inline-flex items-center justify-center border border-transparent hover:border-red-100"><i class="fas fa-trash-alt text-lg"></i></button>
                            </td>
                        </tr>
                    `;
                });
            } catch (error) {
                console.error(error);
            }
        };

        window.openCategoryModal = function() {
            document.getElementById('catDocId').value = '';
            document.getElementById('categoryForm').reset();
            document.getElementById('categoryModal').classList.remove('hidden');
            document.getElementById('categoryModal').classList.add('flex');
        };

        window.closeCategoryModal = function() {
            document.getElementById('categoryModal').classList.add('hidden');
            document.getElementById('categoryModal').classList.remove('flex');
        };

        window.editCategory = function(docId) {
            const cat = allCategories.find(c => c.docId === docId);
            if(cat) {
                document.getElementById('catDocId').value = cat.docId;
                document.getElementById('catName').value = cat.name || '';
                document.getElementById('catNameEn').value = cat.nameEn || '';
                document.getElementById('categoryModal').classList.remove('hidden');
                document.getElementById('categoryModal').classList.add('flex');
            }
        };

        window.deleteCategory = async function(docId) {
            if(confirm('دڵنیایت لە سڕینەوەی ئەم پۆلێنە؟')) {
                try {
                    await deleteDoc(doc(db, "categories", docId));
                    showToast("پۆلێن سڕایەوە", "success");
                    loadAdminCategories();
                    refreshCatalogCategories(); // To update products Add form UI
                } catch(e) {
                    console.error(e);
                    showToast("هەڵە لە سڕینەوە", "error");
                }
            }
        };

        document.getElementById('categoryForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('saveCategoryBtn');
            btn.innerHTML = '<i class="fas fa-spinner fa-spin text-xl"></i> سەیڤ دەکرێت...';
            btn.disabled = true;

            const docId = document.getElementById('catDocId').value;
            const data = {
                name: document.getElementById('catName').value,
                nameEn: document.getElementById('catNameEn').value
            };

            try {
                if(docId) { 
                    await updateDoc(doc(db, "categories", docId), data);
                    showToast("پۆلێن نوێکرایەوە", "success");
                } else { 
                    data.createdAt = new Date().toISOString();
                    await addDoc(collection(db, "categories"), data);
                    showToast("پۆلێنی نوێ زیادکرا", "success");
                }
                closeCategoryModal();
                loadAdminCategories();
                refreshCatalogCategories();
            } catch (error) {
                console.error("Write Category Error:", error);
                if (error.code === 'permission-denied') showToast("هەڵە! تکایە ڕێگەپێدانەکانی فایەربەیس (Rules) چاک بکە", "error");
                else showToast("هەڵە لە سەیڤکردن", "error");
            }
            btn.innerHTML = 'سەیڤ بکە <i class="fas fa-save ml-2"></i>';
            btn.disabled = false;
        });

        async function refreshCatalogCategories() {
            // Need to update the arrays and re-render
            allCategories = await fetchCategories();
            populateCategoryDropdowns();
            renderCategoryTabs();
        }

        window.populateCategoryDropdowns = function() {
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
        });

        window.renderCategoryTabs = function() {
            const renderTabs = (containerId, filterClass) => {
                const container = document.getElementById(containerId);
                if(!container) return;
                
                let html = `<button class="${filterClass} active bg-gradient-to-r from-wood-600 to-wood-800 text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-md transition-all transform hover:-translate-y-1" data-filter="all">هەمووی</button>`;
                
                const collections = [
                    { id: '8mm', name: 'کۆلێکشنی ٨ ملم' },
                    { id: '10mm', name: 'کۆلێکشنی ١٠ ملم' },
                    { id: '12mm', name: 'کۆلێکشنی ١٢ ملم' }
                ];
                
                collections.forEach(c => {
                    html += `<button class="${filterClass} bg-white text-gray-600 hover:bg-gray-50 px-8 py-3.5 rounded-2xl text-sm font-bold shadow-sm border border-gray-100 transition-all transform hover:-translate-y-1" data-filter="${c.id}">${c.name}</button>`;
                });
                
                container.innerHTML = html;
            };

            renderTabs('retailCategoryTabs', 'filter-btn-retail');
            renderTabs('wholesaleCategoryTabs', 'filter-btn-whole');

            // Re-bind listeners
            setupFilterButtons('.filter-btn-retail', 'retail', (val) => currentRetailCategory = val, () => window.applyRetailFilters());
            setupFilterButtons('.filter-btn-whole', 'wholesale', (val) => currentWholeCategory = val, () => window.applyWholesaleFilters());
        };
        

        async function loadPublicProducts() {
            document.getElementById('catalog-loading').classList.remove('hidden');
            document.getElementById('product-grid').classList.add('hidden');
            document.getElementById('empty-state').classList.add('hidden');
            
            allProducts = await fetchProducts();
            populateCountryFilters();
            const retailProducts = allProducts.filter(p => !p.sellType || p.sellType === 'retail' || p.sellType === 'both');
            document.getElementById('catalog-loading').classList.add('hidden');
            renderProductsUI(retailProducts);
            populateSelectOptions(retailProducts);
        }

        function populateCountryFilters() {
            const countries = [...new Set(allProducts.map(p => p.country).filter(Boolean))].sort();
            const retailSel = document.getElementById('filterCountryRetail');
            const wholeSel = document.getElementById('filterCountryWhole');
            
            let options = '<option value="">هەموو وڵاتێک</option>';
            countries.forEach(c => {
                options += `<option value="${c}">${c}</option>`;
            });
            
            if(retailSel) retailSel.innerHTML = options;
            if(wholeSel) wholeSel.innerHTML = options;
        }

        async function loadWholesaleProducts() {
            // using the same empty state/loading state structure if possible or just rely on fetch speed
            const grid = document.getElementById('wholesale-products-grid');
            if(grid) grid.innerHTML = '<div class="col-span-full text-center py-20 text-gray-500 font-bold text-xl"><i class="fas fa-spinner fa-spin block text-4xl mb-4 text-gold-400"></i> خەریکی هێنانە...</div>';
            
            allProducts = await fetchProducts();
            const wholesaleProducts = allProducts.filter(p => p.sellType === 'wholesale' || p.sellType === 'both');
            renderWholesaleProductsUI(wholesaleProducts);
            populateWholesaleSelectOptions(wholesaleProducts);
        }

        function populateWholesaleSelectOptions(items) {
            const sel = document.getElementById('wProductSelect');
            if(!sel) return;
            sel.innerHTML = '<option value="" disabled selected>تکایە جۆری پارکێت هەڵبژێرە (جۆملە)...</option>';
            items.forEach(p => { sel.innerHTML += `<option value="${p.id}">${p.id} | ${p.name} - $${p.wholesalePrice || p.price}</option>`; });
        }

        function renderProductsUI(items) {
            const grid = document.getElementById('product-grid');
            const empty = document.getElementById('empty-state');
            grid.innerHTML = '';
            
            if(items.length === 0) {
                empty.classList.remove('hidden');
                grid.classList.add('hidden');
                return;
            }
            empty.classList.add('hidden');
            grid.classList.remove('hidden');

            items.forEach((p, i) => {
                let badge = `<span class="bg-green-500/90 backdrop-blur text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md flex items-center gap-1"><i class="fas fa-check-circle"></i> پاکێجی کامڵ</span>`;
                let featureBadges = window.renderFeatureBadgesOnCard(p.features);
                grid.innerHTML += `
                    <div class="product-card bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm flex flex-col h-full fade-in-up group hover:shadow-2xl transition-all duration-300" style="animation-delay: ${0.1 * (i%3)}s;">
                        <div class="relative h-72 cursor-pointer overflow-hidden product-img-wrapper" onclick="window.openModal('${p.docId}')">
                            <img src="${p.mainImage}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80"></div>
                            <div class="absolute top-4 right-4 flex flex-col gap-2 z-10">
                                ${p.category && p.category !== 'Other' ? `<span class="bg-wood-900/90 backdrop-blur text-gold-400 border border-gold-500/30 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md">${p.category}</span>` : ''}
                                ${badge}
                            </div>
                            <div class="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md text-wood-900 px-4 py-1.5 rounded-xl text-sm font-black shadow-lg font-mono border border-gray-200">${p.id}</div>
                            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                <span class="bg-black/40 backdrop-blur-md text-white px-6 py-3 rounded-2xl font-bold border border-white/20 flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"><i class="fas fa-eye text-xl"></i> وردەکارییەکان ببینە</span>
                            </div>
                        </div>
                        <div class="p-8 flex flex-col flex-grow relative bg-white">
                            <h3 class="text-2xl font-black mb-2 text-gray-900 group-hover:text-wood-600 transition-colors">${p.name}</h3>
                            <p class="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed font-medium">${p.description}</p>
                            ${featureBadges}
                            <div class="mt-auto flex justify-end items-end border-t border-gray-100 pt-6">
                                <button onclick="window.selectForOrder('${p.docId}')" class="w-14 h-14 bg-gray-50 hover:bg-gradient-to-tr hover:from-wood-600 hover:to-wood-500 text-wood-600 hover:text-white rounded-2xl border-2 border-gray-100 shadow-sm hover:border-wood-400 transition-all flex items-center justify-center transform hover:rotate-12 hover:scale-110" title="زیادکردن بۆ داواکاری">
                                    <i class="fas fa-cart-plus text-xl"></i>
                                </button>
                            </div>
                        </div>
                    </div>`;
            });
        }

        function renderWholesaleProductsUI(items) {
            const grid = document.getElementById('wholesale-products-grid');
            if(!grid) return;
            grid.innerHTML = '';
            
            if(items.length === 0) {
                grid.innerHTML = '<div class="col-span-full text-center py-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem]"><div class="w-24 h-24 bg-gray-100 text-gray-300 rounded-full flex items-center justify-center text-4xl mx-auto mb-6"><i class="fas fa-box-open"></i></div><h3 class="text-2xl font-black text-gray-900 mb-2">هیچ بەرهەمێکی جۆملە نییە</h3></div>';
                return;
            }

            items.forEach((p, i) => {
                let badge = p.waterproof ? `<span class="bg-blue-500/90 backdrop-blur text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md flex items-center gap-1"><i class="fas fa-shield-alt"></i> دژە ئاو</span>` : '';
                let featureBadges = window.renderFeatureBadgesOnCard(p.features);
                grid.innerHTML += `
                    <div class="product-card bg-gray-900 rounded-[2rem] overflow-hidden shadow-xl flex flex-col h-full fade-in-up group border border-gray-800 hover:shadow-2xl transition-all duration-300 hover:border-gold-500/30" style="animation-delay: ${0.1 * (i%3)}s;">
                        <div class="relative h-72 cursor-pointer overflow-hidden product-img-wrapper" onclick="window.openModal('${p.docId}')">
                            <img src="${p.mainImage}" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-transform duration-700 group-hover:scale-110">
                            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
                            <div class="absolute top-4 right-4 flex flex-col gap-2 z-10">
                                ${p.category && p.category !== 'Other' ? `<span class="bg-gold-500/90 backdrop-blur text-black px-3 py-1.5 rounded-lg text-xs font-bold shadow-md">${p.category}</span>` : ''}
                                ${badge}
                            </div>
                            <div class="absolute bottom-4 left-4 bg-gold-500/90 backdrop-blur-sm text-black px-4 py-1.5 rounded-xl text-sm font-black shadow-lg font-mono">${p.id}</div>
                            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                <span class="bg-black/60 backdrop-blur-md text-gold-400 px-6 py-3 rounded-2xl font-bold border border-gold-500/30 flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"><i class="fas fa-eye text-xl"></i> بینینی زیاتر</span>
                            </div>
                        </div>
                        <div class="p-8 flex flex-col flex-grow relative bg-gray-900">
                            <h3 class="text-2xl font-black mb-2 text-gold-50 group-hover:text-gold-400 transition-colors">${p.name}</h3>
                            <p class="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed font-medium">${p.description}</p>
                            ${featureBadges}
                            <div class="mt-auto flex justify-between items-end border-t border-gray-800 pt-6">
                                <div class="flex flex-col">
                                    <div class="flex items-center gap-2">
                                        <span class="text-3xl font-black text-gold-500">$${p.wholesalePrice || p.price}</span> 
                                        <span class="text-xs text-gray-500 font-bold">/ مەتری دووجا (جۆملە)</span>
                                    </div>
                                    <div class="text-sm font-black text-gray-400 mt-1" dir="ltr">${window.formatIQD(p.wholesalePrice || p.price)}</div>
                                </div>
                                <button onclick="window.selectForWholesaleOrder('${p.docId}')" class="w-14 h-14 bg-gray-800 hover:bg-gold-500 text-gold-500 hover:text-black rounded-2xl border-2 border-gray-700 shadow-sm transition-all flex items-center justify-center transform hover:rotate-12 hover:scale-110 shadow-sm" title="زیادکردن بۆ داواکاری جۆملە">
                                    <i class="fas fa-dolly text-xl"></i>
                                </button>
                            </div>
                        </div>
                    </div>`;
            });
        }

        function populateSelectOptions(items) {
            const sel = document.getElementById('productSelect');
            sel.innerHTML = '<option value="" disabled selected>تکایە جۆری پارکێت هەڵبژێرە...</option>';
            items.forEach(p => { sel.innerHTML += `<option value="${p.id}">${p.id} | ${p.name} - $${p.price}</option>`; });
        }

        // Secret Admin Access (3 Clicks on Logo)
        let logoClicks = 0;
        let logoTimer;
        document.getElementById('brand-logo').addEventListener('click', (e) => {
            e.preventDefault();
            logoClicks++;
            if(logoClicks === 1) { logoTimer = setTimeout(() => logoClicks = 0, 1000); }
            if(logoClicks >= 3) {
                clearTimeout(logoTimer);
                logoClicks = 0;
                window.location.hash = '#admin';
            }
        });

        // Toggle Login / Sign Up Mode
        // Auth Submit
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const eVal = document.getElementById('loginEmail').value;
            const pVal = document.getElementById('loginPassword').value;
            const btn = document.getElementById('loginBtn');
            const originalText = document.getElementById('loginBtnText').innerText;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin text-2xl"></i>';
            try {
                await signInWithEmailAndPassword(auth, eVal, pVal);
                window.location.hash = '#admin';
                if(window.OneSignal) window.OneSignal.login("admin_user"); // Tag admin device
            } catch (error) {
                showToast("ئیمەیڵ یان پاسۆرد هەڵەیە", "error");
            }
            btn.innerHTML = `<span id="loginBtnText">${originalText}</span> <i class="fas fa-sign-in-alt"></i>`;
        });

        document.getElementById('logoutBtn').addEventListener('click', async () => {
            await signOut(auth);
            window.location.hash = '';
        });

        async function loadAdminProducts() {
            allProducts = await fetchProducts(true);
            
            // Update Stats
            document.getElementById('statTotalProducts').innerText = allProducts.length;
            const waterproofCount = allProducts.filter(p => p.waterproof).length;
            document.getElementById('statWaterproof').innerText = waterproofCount;

            renderAdminTable(allProducts);
            populateInvoiceSelect(allProducts);
            
            loadAdminOrders();
            if(window.loadAdminCategories) window.loadAdminCategories();
            if(window.loadAdminExpenses) window.loadAdminExpenses();
            loadAdminUsers();
        }

        window.allAdminOrders = [];
        window.currentInvoiceOrderId = null;

        async function loadAdminOrders() {
            try {
                const querySnapshot = await getDocs(collection(db, "orders"));
                let orders = [];
                let totalOrders = 0;
                let completedOrders = 0;
                let pendingOrders = 0;
                let totalRevenue = 0;
                let totalProfit = 0;

                querySnapshot.forEach((doc) => { 
                    const data = doc.data();
                    orders.push({ docId: doc.id, ...data }); 
                    
                    totalOrders++;
                    
                    // Profit Calculation
                    let orderProfit = 0;
                    const productObj = window.allProducts ? window.allProducts.find(p => p.id === data.productId || p.name === data.productName) : null;
                    if(productObj) {
                        const cost = productObj.costPrice || 0;
                        const defaultPrice = data.orderType === 'wholesale' ? (productObj.wholesalePrice || productObj.price || 0) : (productObj.price || 0);
                        const sellPricePerMeter = (data.totalPrice && data.area) ? (data.totalPrice / data.area) : defaultPrice;
                        orderProfit = (sellPricePerMeter - cost) * (data.area || 0);
                    }

                    if(data.status === 'completed') {
                        completedOrders++;
                        totalRevenue += data.totalPrice || 0;
                        totalProfit += orderProfit;
                    } else {
                        pendingOrders++;
                    }
                    
                    // Temporarily store profit for rendering in table
                    orders[orders.length-1].calculatedProfit = orderProfit;
                });
                orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                window.allAdminOrders = orders;
                
                // Update Dashboard Stats
                document.getElementById('dashTotalOrders').innerText = totalOrders;
                document.getElementById('dashCompletedOrders').innerText = completedOrders;
                document.getElementById('dashPendingOrders').innerText = pendingOrders;
                document.getElementById('dashTotalRevenue').innerText = '$' + totalRevenue.toFixed(2);
                
                window.globalGrossProfit = totalProfit;
                if(typeof window.updateDashboardNetProfit === 'function') window.updateDashboardNetProfit();
                
                const tbody = document.getElementById('adminOrdersTable');
                tbody.innerHTML = '';
                if(orders.length === 0){
                    tbody.innerHTML = '<tr><td colspan="6" class="p-8 text-center text-gray-400 font-bold text-lg"><i class="fas fa-box-open block text-3xl mb-2 text-gray-300"></i> هیچ داواکارییەک نییە</td></tr>';
                    return;
                }
                orders.forEach(o => {
                    const dateObj = o.createdAt ? new Date(o.createdAt) : new Date();
                    const formattedDate = dateObj.toLocaleDateString('ku-IQ') + ' ' + dateObj.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'});
                    
                    const statusBadge = o.status === 'completed' 
                        ? `<span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200"><i class="fas fa-check-circle"></i> تەواوکراو</span>` 
                        : `<span class="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold border border-orange-200"><i class="fas fa-clock"></i> چاوەڕوانکراو</span>`;

                    const invoiceBtn = o.status !== 'completed' 
                        ? `<button onclick="window.createInvoiceFromOrder('${o.docId}')" class="text-green-600 hover:bg-green-50 w-10 h-10 rounded-xl transition-colors inline-flex items-center justify-center border border-transparent hover:border-green-100 shadow-sm" title="دروستکردنی وەسڵ"><i class="fas fa-file-invoice-dollar"></i></button>`
                        : '';

                    const profitBadge = o.calculatedProfit > 0 
                        ? `<span class="bg-green-100 text-green-700 px-3 py-1.5 rounded-xl font-black text-sm border border-green-200 shadow-sm block text-center">$${o.calculatedProfit.toFixed(2)}</span>`
                        : `<span class="text-gray-400 font-bold text-sm block text-center">-</span>`;

                    const typeBadge = o.orderType === 'wholesale'
                        ? `<span class="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[10px] font-black border border-purple-200 uppercase tracking-widest mt-1 inline-block"><i class="fas fa-building"></i> B2B (جۆملە)</span>`
                        : `<span class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-black border border-blue-200 uppercase tracking-widest mt-1 inline-block"><i class="fas fa-user"></i> Retail</span>`;

                    tbody.innerHTML += `
                        <tr class="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                            <td class="p-4 font-bold text-gray-800">${o.customerName}<br>${typeBadge}</td>
                            <td class="p-4 text-gray-600 font-mono" dir="ltr">${o.phone}</td>
                            <td class="p-4"><span class="bg-wood-100 text-wood-800 px-2 py-1 rounded text-xs font-bold border border-wood-200">${o.productName}</span><br><span class="text-xs text-gray-500 font-bold mt-1 inline-block">${o.area} m²</span></td>
                            <td class="p-4 text-xs text-gray-500 max-w-[200px] truncate" title="${o.address}">${o.address}</td>
                            <td class="p-4 text-xs font-bold text-gray-500" dir="ltr">${formattedDate}</td>
                            <td class="p-4 bg-green-50/20 align-middle">
                                ${profitBadge}
                                ${o.status !== 'completed' ? `<span class="text-[10px] text-green-600/70 block text-center mt-1 font-bold">مەزەندە</span>` : ''}
                            </td>
                            <td class="p-4 text-center">
                                ${statusBadge}
                                <div class="flex justify-center gap-1 mt-2">
                                    ${invoiceBtn}
                                    <a href="https://www.google.com/maps?q=${o.lat},${o.lng}" target="_blank" class="text-blue-500 hover:bg-blue-50 w-10 h-10 rounded-xl transition-colors inline-flex items-center justify-center border border-transparent hover:border-blue-100 shadow-sm"><i class="fas fa-map-marker-alt"></i></a>
                                    <button onclick="window.deleteOrder('${o.docId}')" class="text-red-500 hover:bg-red-50 w-10 h-10 rounded-xl transition-colors inline-flex items-center justify-center border border-transparent hover:border-red-100 shadow-sm"><i class="fas fa-trash-alt"></i></button>
                                </div>
                            </td>
                        </tr>`;
                });
            } catch (e) {
                document.getElementById('adminOrdersTable').innerHTML = '<tr><td colspan="6" class="p-8 text-center text-gray-400 font-bold text-lg"><i class="fas fa-database block text-3xl mb-2 text-gray-300"></i> ناتوانرێت داواکارییەکان دەربهێنرێن. (Firebase Rules بپشکنە)</td></tr>';
            }
        }


        async function loadAdminUsers() {
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                let users = [];
                querySnapshot.forEach((doc) => { users.push({ docId: doc.id, ...doc.data() }); });
                
                const tbody = document.getElementById('adminUsersTable');
                tbody.innerHTML = '';
                if(users.length === 0){
                    tbody.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-gray-400 font-bold text-lg"><i class="fas fa-users block text-3xl mb-2 text-gray-300"></i> هیچ بەکارهێنەرێک نییە</td></tr>';
                    return;
                }
                users.forEach(u => {
                    const rClass = u.role === 'admin' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-gray-100 text-gray-600 border-gray-200';
                    tbody.innerHTML += `
                        <tr class="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                            <td class="p-4 font-bold text-gray-800" dir="ltr">${u.email}</td>
                            <td class="p-4"><span class="px-3 py-1 rounded-lg text-xs font-bold border ${rClass}">${u.role}</span></td>
                            <td class="p-4 text-xs font-bold text-gray-500" dir="ltr">-</td>
                            <td class="p-4 text-center">
                                <button disabled class="text-gray-300 w-10 h-10 rounded-xl transition-colors inline-flex items-center justify-center border border-transparent"><i class="fas fa-ban"></i></button>
                            </td>
                        </tr>`;
                });
            } catch (e) {
                document.getElementById('adminUsersTable').innerHTML = '<tr><td colspan="4" class="p-8 text-center text-gray-400 font-bold text-lg"><i class="fas fa-users block text-3xl mb-2 text-gray-300"></i> ناتوانرێت بەکارهێنەران دەربهێنرێن. (Firebase Rules بپشکنە)</td></tr>';
            }
        }
        
        window.deleteOrder = function(docId) {
            showConfirmModal("ئایا دڵنیایت لە سڕینەوەی ئەم داواکارییە؟", async () => {
                try {
                    await deleteDoc(doc(db, "orders", docId));
                    showToast("داواکارییەکە سڕایەوە");
                    loadAdminOrders();
                } catch (error) {
                    showToast("هەڵە لە سڕینەوە", "error");
                }
            });
        }


        function renderAdminTable(items) {
            const tbody = document.getElementById('adminProductsTable');
            tbody.innerHTML = '';
            if(items.length===0){
                tbody.innerHTML = '<tr><td colspan="6" class="p-8 text-center text-gray-400 font-bold text-lg"><i class="fas fa-folder-open block text-3xl mb-2"></i> هیچ بەرهەمێک نییە</td></tr>';
                return;
            }
            items.forEach(p => {
                tbody.innerHTML += `
                    <tr class="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                        <td class="p-4"><img src="${p.mainImage}" class="w-16 h-16 rounded-xl object-cover border border-gray-200 shadow-sm"></td>
                        <td class="p-4"><span class="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-lg font-black font-mono text-sm border border-gray-200">${p.id}</span></td>
                        <td class="p-4 font-bold text-gray-800">
                            <div class="mb-1 text-lg">${p.name}</div>
                            <div class="flex flex-wrap gap-1">
                                ${p.category ? `<span class="bg-gray-800 text-gold-400 px-2 py-0.5 rounded-md text-[11px] font-bold border border-gray-700">${p.category}</span>` : ''}
                                ${p.sellType === 'wholesale' ? '<span class="bg-gold-50 text-gold-600 px-2 py-0.5 rounded-md text-[11px] font-bold border border-gold-100">جۆملە</span>' : 
                                  p.sellType === 'retail' ? '<span class="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-[11px] font-bold border border-blue-100">تاک</span>' :
                                  '<span class="bg-purple-50 text-purple-600 px-2 py-0.5 rounded-md text-[11px] font-bold border border-purple-100">هەردووکیان</span>'}
                            </div>
                        </td>
                        <td class="p-4">
                            <div class="flex flex-col gap-2">
                                <div>
                                    <div class="font-black text-wood-600 text-lg" dir="ltr"><span class="text-xs text-gray-400 font-bold ml-1">تاک:</span>$${p.price}</div>
                                    <div class="text-[11px] font-black text-gray-400 mt-0.5" dir="ltr">${window.formatIQD(p.price)}</div>
                                </div>
                                ${p.sellType !== 'retail' && p.wholesalePrice ? `
                                <div>
                                    <div class="font-black text-gold-600 text-sm mt-1" dir="ltr"><span class="text-xs text-gray-400 font-bold ml-1">جۆملە:</span>$${p.wholesalePrice}</div>
                                    <div class="text-[11px] font-black text-gray-400 mt-0.5" dir="ltr">${window.formatIQD(p.wholesalePrice)}</div>
                                </div>` : ''}
                            </div>
                        </td>
                        <td class="p-4">${window.renderAdminTableFeatures(p.features, p.waterproof)}</td>
                        <td class="p-4 text-center space-x-2 space-x-reverse">
                            <button onclick="window.editAdminProduct('${p.docId}')" class="text-blue-500 hover:bg-blue-50 w-12 h-12 rounded-xl transition-colors inline-flex items-center justify-center border border-transparent hover:border-blue-100"><i class="fas fa-pen text-lg"></i></button>
                            <button onclick="window.deleteAdminProduct('${p.docId}')" class="text-red-500 hover:bg-red-50 w-12 h-12 rounded-xl transition-colors inline-flex items-center justify-center border border-transparent hover:border-red-100"><i class="fas fa-trash-alt text-lg"></i></button>
                        </td>
                    </tr>`;
            });
        }

        // Auto-upload selected file to generate link immediately with professional loading state
        document.getElementById('apMainImgFile').addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const btn = document.getElementById('saveProductBtn');
            const originalBtnHtml = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin text-2xl"></i> تکایە چاوەڕێ بکە...';
            
            // Show local preview immediately
            const localUrl = URL.createObjectURL(file);
            const img = document.getElementById('liveImagePreview');
            const icon = document.getElementById('previewPlaceholderIcon');
            img.src = localUrl;
            img.onload = () => { img.style.opacity = 0.5; icon.style.opacity = 0; };
            img.onerror = () => { img.style.opacity = 0; icon.style.opacity = 1; };
            
            showToast("خەریکی بەرزکردنەوەی وێنەکەین...", "info");
            
            try {
                const url = await window.uploadImageFile(file);
                if (url) {
                    const inputUrl = document.getElementById('apMainImg');
                    inputUrl.value = url;
                    
                    img.style.opacity = 1;
                    
                    showToast("وێنەکە بە سەرکەوتوویی بوو بە لینک!", "success");
                    e.target.value = ''; // Clear file input since we have the URL now
                } else {
                    throw new Error("No URL returned");
                }
            } catch(error) {
                showToast("هەڵە لە بەرزکردنەوەی وێنەکە، تکایە دووبارە هەوڵبدەرەوە", "error");
                img.style.opacity = 0;
                icon.style.opacity = 1;
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalBtnHtml;
            }
        });

        // Live Image Preview for Admin Modal
        document.getElementById('apMainImg').addEventListener('input', function(e) {
            const img = document.getElementById('liveImagePreview');
            const icon = document.getElementById('previewPlaceholderIcon');
            if(e.target.value) {
                img.src = e.target.value;
                img.onload = () => { img.style.opacity = 1; icon.style.opacity = 0; };
                img.onerror = () => { img.style.opacity = 0; icon.style.opacity = 1; };
            } else {
                img.style.opacity = 0; icon.style.opacity = 1;
            }
        });

        document.getElementById('adminProductForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('saveProductBtn');
            btn.innerHTML = '<i class="fas fa-spinner fa-spin text-2xl"></i> پاشەکەوت دەکرێت...';
            btn.disabled = true;
            
            const docId = document.getElementById('apDocId').value;
            const features = window.getFeaturesFromForm();
            
            const fileInput = document.getElementById('apMainImgFile');
            let mainImageUrl = document.getElementById('apMainImg').value;
            if (fileInput && fileInput.files.length > 0) {
                try {
                    mainImageUrl = await window.uploadImageFile(fileInput.files[0]);
                } catch(e) {
                    showToast("هەڵە لە ئەپڵۆدکردنی وێنەکە", "error");
                    btn.innerHTML = '<i class="fas fa-save text-2xl"></i> پاشەکەوتکردن';
                    btn.disabled = false;
                    return;
                }
            }
            
            if(!mainImageUrl) {
                showToast("پێویستە وێنە ئەپڵۆد بکەیت یان لینک دابنێیت", "error");
                btn.innerHTML = '<i class="fas fa-save text-2xl"></i> پاشەکەوتکردن';
                btn.disabled = false;
                return;
            }

            const data = {
                id: document.getElementById('apId').value,
                name: document.getElementById('apName').value,
                sellType: document.getElementById('apSellType').value,
                category: document.getElementById('apCategory') ? document.getElementById('apCategory').value : 'Laminate',
                price: parseFloat(document.getElementById('apPrice').value) || 0,
                wholesalePrice: parseFloat(document.getElementById('apWholesalePrice').value) || 0,
                costPrice: parseFloat(document.getElementById('apCostPrice').value) || 0,
                thickness: document.getElementById('apThickness').value,
                color: document.getElementById('apColor').value,
                quality: document.getElementById('apQuality').value,
                country: document.getElementById('apCountry').value,
                description: document.getElementById('apDesc').value,
                waterproof: document.getElementById('apWaterproof').checked,
                mainImage: mainImageUrl,
                previewLiving: document.getElementById('apLivImg').value,
                previewBedroom: document.getElementById('apBedImg').value,
                features: features,
                updatedAt: new Date().toISOString(),
            };

            // Save defaults for next time
            localStorage.setItem('defaultProductCountry', data.country);
            localStorage.setItem('defaultProductThickness', data.thickness);
            localStorage.setItem('defaultProductColor', data.color);
            localStorage.setItem('defaultProductQuality', data.quality);

            try {
                if(docId) { 
                    await updateDoc(doc(db, "products", docId), data);
                    showToast("بەرهەمەکە بە سەرکەوتوویی نوێکرایەوە");
                } else { 
                    data.createdAt = new Date().toISOString();
                    await addDoc(collection(db, "products"), data);
                    showToast("بەرهەمی نوێ زیادکرا بە سەرکەوتوویی");
                }
                closeAdminModal();
                loadAdminProducts(); // Refresh Table
            } catch (error) {
                console.error("Write Error:", error);
                console.error("Error code:", error.code);
                console.error("Error message:", error.message);
                if (error.code === 'permission-denied') {
                    showToast("❌ ڕێگەپێنەدراوە! یاساکانی فایەربەیس (Security Rules) چاک بکە. لە کونسوڵ بڕوانە.", "error");
                    console.log("%c=== FIRESTORE RULES FIX ===", "color: red; font-size: 16px; font-weight: bold;");
                    console.log("Go to Firebase Console > Firestore > Rules, and set:");
                    console.log(`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}`);
                } else if (error.code === 'unauthenticated') {
                    showToast("❌ تکایە سەرەتا بچۆرە ژوورەوە (Login)", "error");
                } else if (error.code === 'unavailable') {
                    showToast("❌ ئینتەرنێت بەردەست نییە! تکایە پشکنی.", "error");
                } else {
                    showToast("❌ کێشەیەک ڕوویدا: " + (error.message || "نەزانراو"), "error");
                }
            }
            btn.innerHTML = '<i class="fas fa-cloud-upload-alt text-2xl"></i> پاشەکەوتکردن لە فایەربەیس';
            btn.disabled = false;
        });

        // Admin Modal Controls
        window.openProductModal = function() {
            document.getElementById('adminProductForm').reset();
            document.getElementById('apDocId').value = '';
            document.getElementById('apSellType').value = 'both';
            if(document.getElementById('apCategory')) document.getElementById('apCategory').value = 'Laminate';
            document.getElementById('apWholesalePrice').value = '';
            document.getElementById('featuresList').innerHTML = '';
            document.getElementById('modalAdminTitle').innerHTML = '<i class="fas fa-layer-group text-wood-500"></i> زیادکردنی بەرهەمی نوێ';
            
            // Restore defaults
            const defCountry = localStorage.getItem('defaultProductCountry');
            const defThickness = localStorage.getItem('defaultProductThickness');
            const defColor = localStorage.getItem('defaultProductColor');
            const defQuality = localStorage.getItem('defaultProductQuality');
            if(defCountry) document.getElementById('apCountry').value = defCountry;
            if(defThickness) document.getElementById('apThickness').value = defThickness;
            if(defColor) document.getElementById('apColor').value = defColor;
            if(defQuality) document.getElementById('apQuality').value = defQuality;
            
            // Reset Preview
            document.getElementById('liveImagePreview').style.opacity = 0;
            document.getElementById('previewPlaceholderIcon').style.opacity = 1;

            const modal = document.getElementById('adminProductModal');
            const content = document.getElementById('adminModalContent');
            modal.classList.remove('hidden');
            setTimeout(() => { modal.classList.remove('opacity-0'); content.classList.remove('scale-95'); content.classList.add('scale-100'); }, 10);
        }
        
        window.closeAdminModal = function() {
            const modal = document.getElementById('adminProductModal');
            const content = document.getElementById('adminModalContent');
            modal.classList.add('opacity-0');
            content.classList.remove('scale-100');
            content.classList.add('scale-95');
            setTimeout(() => modal.classList.add('hidden'), 400);
        }

        window.switchAdminTab = function(tab) {
            document.getElementById('tab-dashboard').classList.add('hidden');
            document.getElementById('tab-products').classList.add('hidden');
            document.getElementById('tab-invoice').classList.add('hidden');
            document.getElementById('tab-orders').classList.add('hidden');
            document.getElementById('tab-users').classList.add('hidden');
            if(document.getElementById('tab-categories')) document.getElementById('tab-categories').classList.add('hidden');
            if(document.getElementById('tab-expenses')) document.getElementById('tab-expenses').classList.add('hidden');
            if(document.getElementById('tab-settings')) document.getElementById('tab-settings').classList.add('hidden');
            
            // Reset nav styles
            const navs = ['dashboard', 'products', 'categories', 'invoice', 'orders', 'users', 'expenses', 'settings'];
            navs.forEach(n => {
                const el = document.getElementById('nav-' + n);
                if(el) {
                    el.className = "w-full text-right px-6 py-4 rounded-2xl text-wood-400 hover:text-white hover:bg-white/5 font-bold transition-all flex items-center gap-4 border border-transparent";
                    el.children[0].className = "w-10 h-10 rounded-xl bg-wood-900/50 flex items-center justify-center border border-wood-800";
                    el.children[0].children[0].classList.replace('text-gold-400', 'text-gray-400');
                }
            });

            document.getElementById('tab-' + tab).classList.remove('hidden');
            document.getElementById('tab-' + tab).classList.add('block');
            const activeNav = document.getElementById('nav-' + tab);
            if(activeNav) {
                activeNav.className = "w-full text-right px-6 py-4 rounded-2xl bg-white/10 text-white border border-white/10 font-bold transition-all flex items-center gap-4 shadow-glass hover:bg-white/15";
                activeNav.children[0].className = "w-10 h-10 rounded-xl bg-wood-800 flex items-center justify-center";
                activeNav.children[0].children[0].classList.replace('text-gray-400', 'text-gold-400');
            }
        }

        window.editAdminProduct = function(docId) {
            const p = allProducts.find(x => x.docId === docId);
            if(!p) return;
            document.getElementById('apDocId').value = p.docId;
            document.getElementById('apId').value = p.id || '';
            document.getElementById('apName').value = p.name || '';
            document.getElementById('apSellType').value = p.sellType || 'both';
            if(document.getElementById('apCategory')) document.getElementById('apCategory').value = p.category || 'Laminate';
            document.getElementById('apPrice').value = p.price || '';
            document.getElementById('apWholesalePrice').value = p.wholesalePrice || '';
            document.getElementById('apCostPrice').value = p.costPrice || '';
            document.getElementById('apThickness').value = p.thickness || '8mm';
            document.getElementById('apColor').value = p.color || 'کاڵ';
            document.getElementById('apQuality').value = p.quality || 'AC3';
            document.getElementById('apCountry').value = p.country || '';
            document.getElementById('apDesc').value = p.description || '';
            document.getElementById('apWaterproof').checked = p.waterproof || false;
            document.getElementById('apMainImg').value = p.mainImage || '';
            document.getElementById('apMainImgFile').value = '';
            document.getElementById('apLivImg').value = p.previewLiving || '';
            document.getElementById('apBedImg').value = p.previewBedroom || '';
            
            // Load Features into Form
            window.loadFeaturesIntoForm(p.features || []);

            // Trigger Preview
            document.getElementById('apMainImg').dispatchEvent(new Event('input'));

            document.getElementById('modalAdminTitle').innerHTML = '<i class="fas fa-pen-square text-blue-500"></i> دەستکاریکردنی بەرهەم';
            const modal = document.getElementById('adminProductModal');
            const content = document.getElementById('adminModalContent');
            modal.classList.remove('hidden');
            setTimeout(() => { modal.classList.remove('opacity-0'); content.classList.remove('scale-95'); content.classList.add('scale-100'); }, 10);
        }

        window.deleteAdminProduct = function(docId) {
            showConfirmModal("ئایا دڵنیایت لە سڕینەوەی ئەم بەرهەمە لە داتابەیس؟", async () => {
                try {
                    await deleteDoc(doc(db, "products", docId));
                    showToast("بەرهەمەکە بە تەواوی سڕایەوە");
                    loadAdminProducts();
                } catch (error) {
                    if (error.code === 'permission-denied') {
                        showToast("ڕێگەپێنەدراوە بۆ سڕینەوە! یاساکان چاک بکە.", "error");
                    } else {
                        showToast("هەڵە لە سڕینەوە", "error");
                    }
                }
            });
        }

        function populateInvoiceSelect(items) {
            const sel = document.getElementById('invProduct');
            sel.innerHTML = '';
            items.forEach(p => {
                sel.innerHTML += `<option value="${p.id}" data-price="${p.price}" data-name="${p.name}">${p.id} - ${p.name}</option>`;
            });
            sel.addEventListener('change', function() {
                const opt = this.options[this.selectedIndex];
                document.getElementById('invPrice').value = opt.getAttribute('data-price');
            });
            if(sel.options.length > 0) { document.getElementById('invPrice').value = sel.options[0].getAttribute('data-price'); }
        }

        window.addInvoiceItem = function() {
            const sel = document.getElementById('invProduct');
            if(sel.selectedIndex === -1) return;
            const opt = sel.options[sel.selectedIndex];
            
            const code = sel.value;
            const name = opt.getAttribute('data-name');
            const qty = parseFloat(document.getElementById('invQty').value) || 0;
            const price = parseFloat(document.getElementById('invPrice').value) || 0;
            const total = qty * price;

            if(qty <= 0) return showToast("تکایە ڕووبەر بە دروستی داخڵ بکە", "error");

            invoiceItems.push({ code, name, qty, price, total: parseFloat(total.toFixed(2)), id: Date.now() });
            renderInvoiceItems();
        }

        window.removeInvoiceItem = function(id) {
            invoiceItems = invoiceItems.filter(x => x.id !== id);
            renderInvoiceItems();
        }

        function renderInvoiceItems() {
            const tbody = document.getElementById('invItemsTable');
            tbody.innerHTML = '';
            let grandTotal = 0;

            if(invoiceItems.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-gray-400 font-bold text-lg"><i class="fas fa-box-open block text-3xl mb-2 text-gray-300"></i> هیچ کاڵایەک زیاد نەکراوە</td></tr>';
                document.getElementById('invTotal').innerText = '$0.00';
                return;
            }

            invoiceItems.forEach(item => {
                grandTotal += item.total;
                tbody.innerHTML += `
                    <tr class="border-b hover:bg-gray-50 transition-colors">
                        <td class="p-5"><span class="font-bold text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg text-sm border border-gray-200">${item.code}</span> <span class="text-gray-500 mr-3 font-bold">${item.name}</span></td>
                        <td class="p-5 text-center font-black text-lg">${item.qty}</td>
                        <td class="p-5 text-center text-gray-500 font-bold text-lg">$${item.price}</td>
                        <td class="p-5 text-center font-black text-wood-600 text-xl">$${item.total}</td>
                        <td class="p-5 text-center"><button type="button" onclick="window.removeInvoiceItem(${item.id})" class="text-red-400 hover:text-red-600 hover:bg-red-50 w-10 h-10 rounded-xl transition-colors border border-transparent hover:border-red-100"><i class="fas fa-trash text-lg"></i></button></td>
                    </tr>`;
            });
            document.getElementById('invTotal').innerText = '$' + grandTotal.toFixed(2);
        }

        window.createInvoiceFromOrder = function(orderId) {
            const order = window.allAdminOrders.find(o => o.docId === orderId);
            if(!order) return;

            window.currentInvoiceOrderId = orderId;

            document.getElementById('invName').value = order.customerName;
            document.getElementById('invPhone').value = order.phone;
            
            // Find product in allProducts
            const product = allProducts.find(p => p.id === order.productId || p.name === order.productName);
            const isWholesale = order.orderType === 'wholesale';
            const pPrice = product ? (isWholesale ? parseFloat(product.wholesalePrice || product.price || 0) : parseFloat(product.price || 0)) : 0;
            const pName = product ? product.name : order.productName;
            const pId = product ? product.id : 'N/A';

            invoiceItems = [];
            
            // Add the item
            const itemTotal = parseFloat(order.area) * pPrice;
            invoiceItems.push({
                code: pId,
                name: pName,
                qty: parseFloat(order.area),
                price: pPrice,
                total: itemTotal
            });

            window.updateInvoiceTable();
            window.switchAdminTab('invoice');
            showToast("وەسڵەکە ئامادەکرا، تەنها نرخی گشتی پشتڕاست بکەرەوە", "success");
        }

        window.generateAndPrintInvoice = async function() {
            const name = document.getElementById('invName').value;
            const phone = document.getElementById('invPhone').value || '-';
            const date = document.getElementById('invDate').value;
            const invNo = document.getElementById('invNumber').value;

            if(!name || !date || invoiceItems.length === 0) {
                showToast("تکایە زانیاری کڕیار و بەلایەنی کەمەوە یەک کاڵا داخڵ بکە", "error");
                return;
            }

            document.getElementById('printInvName').innerText = name;
            document.getElementById('printInvPhone').innerText = phone;
            document.getElementById('printInvDate').innerText = date;
            document.getElementById('printInvNo').innerText = invNo;
            
            const pTbody = document.getElementById('printInvTbody');
            pTbody.innerHTML = '';
            let grandTotal = 0;

            invoiceItems.forEach(item => {
                grandTotal += item.total;
                pTbody.innerHTML += `
                    <tr style="border-bottom: 1px solid #eaddd7;">
                        <td style="padding: 16px; border-bottom: 1px solid #eaddd7;"><span style="font-weight: 900; color: #2d211c;">${item.code}</span> &nbsp;&nbsp;<span style="color: #666;">${item.name}</span></td>
                        <td style="padding: 16px; text-align: center; border-bottom: 1px solid #eaddd7;">${item.qty}</td>
                        <td style="padding: 16px; text-align: center; border-bottom: 1px solid #eaddd7;">$${item.price}</td>
                        <td style="padding: 16px; text-align: center; font-weight: 900; border-bottom: 1px solid #eaddd7; color: #6b4d42;">$${item.total}</td>
                    </tr>`;
            });
            document.getElementById('printInvTotal').innerText = '$' + grandTotal.toFixed(2);

            window.print();

            // Mark order as completed if it was generated from one
            if(window.currentInvoiceOrderId) {
                try {
                    await updateDoc(doc(db, "orders", window.currentInvoiceOrderId), {
                        status: 'completed',
                        totalPrice: grandTotal
                    });
                    window.currentInvoiceOrderId = null;
                    loadAdminOrders(); // Refresh to update dashboard
                } catch(e) {
                    console.error("Error updating order status: ", e);
                }
            }
        }
        document.getElementById('invDate').valueAsDate = new Date();


        // Filters
        let currentRetailCategory = 'all';
        let currentWholeCategory = 'all';

        function setupFilterButtons(selector, targetType, updateCategoryFn, applyFiltersFn) {
            document.querySelectorAll(selector).forEach(btn => {
                btn.addEventListener('click', (e) => {
                    document.querySelectorAll(selector).forEach(b => {
                        b.classList.remove('active', 'bg-gradient-to-r', 'from-wood-600', 'to-wood-800', 'text-white', 'shadow-md');
                        b.classList.add('text-gray-600', 'hover:bg-gray-50');
                    });
                    const target = e.currentTarget;
                    target.classList.remove('text-gray-600', 'hover:bg-gray-50');
                    target.classList.add('active', 'bg-gradient-to-r', 'from-wood-600', 'to-wood-800', 'text-white', 'shadow-md');
                    updateCategoryFn(target.getAttribute('data-filter'));
                    applyFiltersFn();
                });
            });
        }

        setupFilterButtons('.filter-btn-retail', 'retail', (val) => currentRetailCategory = val, () => window.applyRetailFilters());
        setupFilterButtons('.filter-btn-whole', 'wholesale', (val) => currentWholeCategory = val, () => window.applyWholesaleFilters());

        window.applyRetailFilters = function() {
            const sort = document.getElementById('sortPriceRetail') ? document.getElementById('sortPriceRetail').value : '';
            const color = document.getElementById('filterColorRetail') ? document.getElementById('filterColorRetail').value : '';
            const quality = document.getElementById('filterQualityRetail') ? document.getElementById('filterQualityRetail').value : '';
            const minP = parseFloat(document.getElementById('minPriceRetail') ? document.getElementById('minPriceRetail').value : '');
            const maxP = parseFloat(document.getElementById('maxPriceRetail') ? document.getElementById('maxPriceRetail').value : '');
            
            let filtered = allProducts.filter(p => p.sellType === 'retail' || p.sellType === 'both');
            
            if (currentRetailCategory && currentRetailCategory !== 'all') {
                filtered = filtered.filter(p => (p.thickness === currentRetailCategory) || (p.category === currentRetailCategory));
            }
            if (color) filtered = filtered.filter(p => p.color === color);
            if (quality) filtered = filtered.filter(p => p.quality === quality);
            if (!isNaN(minP)) filtered = filtered.filter(p => p.price >= minP);
            if (!isNaN(maxP)) filtered = filtered.filter(p => p.price <= maxP);
            
            if (sort === 'asc') filtered.sort((a, b) => a.price - b.price);
            else if (sort === 'desc') filtered.sort((a, b) => b.price - a.price);
            
            const grid = document.getElementById('product-grid');
            grid.style.opacity = 0;
            setTimeout(() => { renderProductsUI(filtered); grid.style.opacity = 1; }, 300);
        };

        window.applyWholesaleFilters = function() {
            const sort = document.getElementById('sortPriceWhole').value;
            const country = document.getElementById('filterCountryWhole').value;
            const minP = parseFloat(document.getElementById('minPriceWhole').value);
            const maxP = parseFloat(document.getElementById('maxPriceWhole').value);
            
            let filtered = allProducts.filter(p => p.sellType === 'wholesale' || p.sellType === 'both');
            
            if (currentWholeCategory === 'waterproof') {
                filtered = filtered.filter(p => p.waterproof);
            } else if (currentWholeCategory && currentWholeCategory !== 'all') {
                filtered = filtered.filter(p => p.category === currentWholeCategory);
            }
            if (country) filtered = filtered.filter(p => p.country === country);
            
            // Note: Wholesale price might fall back to retail price if not set
            const getPrice = (p) => parseFloat(p.wholesalePrice || p.price);
            
            if (!isNaN(minP)) filtered = filtered.filter(p => getPrice(p) >= minP);
            if (!isNaN(maxP)) filtered = filtered.filter(p => getPrice(p) <= maxP);
            
            if (sort === 'asc') filtered.sort((a, b) => getPrice(a) - getPrice(b));
            else if (sort === 'desc') filtered.sort((a, b) => getPrice(b) - getPrice(a));
            
            const grid = document.getElementById('wholesale-products-grid');
            grid.style.opacity = 0;
            setTimeout(() => { renderWholesaleProductsUI(filtered); grid.style.opacity = 1; }, 300);
        };

        // Public Modal Logic
        let currentModalProduct = null;
        window.openModal = function(docId) {
            const p = allProducts.find(x => x.docId === docId);
            if(!p) return;
            currentModalProduct = p;
            
            document.getElementById('modalTitle').innerText = p.name;
            document.getElementById('modalCode').innerText = `کۆد: ${p.id}`;
            document.getElementById('modalDesc').innerText = p.description;
            document.getElementById('modalThickness').innerText = p.thickness || '-';
            document.getElementById('modalPrice').innerText = '$' + p.price;
            if(document.getElementById('modalPriceIQD')) {
                document.getElementById('modalPriceIQD').innerText = window.formatIQD(p.price);
            }
            document.getElementById('modalCountryBadge').innerHTML = `<i class="fas fa-globe text-wood-500"></i> بەرهەمی: ${p.country}`;
            
            if(p.waterproof) document.getElementById('modalWaterBadge').classList.remove('hidden');
            else document.getElementById('modalWaterBadge').classList.add('hidden');
            
            // Render Features in Modal
            window.renderFeaturesInModal(p.features || []);

            document.getElementById('tabLiving').style.display = p.previewLiving ? 'block' : 'none';
            document.getElementById('tabBedroom').style.display = p.previewBedroom ? 'block' : 'none';
            
            changePreviewTab('main'); 

            document.getElementById('modalOrderBtn').onclick = () => { selectForOrder(docId); closeModal(); };
            
            const modal = document.getElementById('productModal');
            const content = document.getElementById('publicModalContent');
            modal.classList.remove('hidden');
            document.body.classList.add('modal-open');
            setTimeout(() => { modal.classList.remove('opacity-0'); content.classList.remove('scale-95'); content.classList.add('scale-100'); }, 10);
        }
        
        window.closeModal = function() {
            const modal = document.getElementById('productModal');
            const content = document.getElementById('publicModalContent');
            modal.classList.add('opacity-0');
            content.classList.remove('scale-100');
            content.classList.add('scale-95');
            setTimeout(() => { modal.classList.add('hidden'); document.body.classList.remove('modal-open'); }, 400);
        }

        window.changePreviewTab = function(type) {
            if(!currentModalProduct) return;
            document.querySelectorAll('.preview-tab').forEach(t => {
                t.classList.remove('border-wood-500', 'bg-white', 'shadow-sm');
                t.classList.add('border-transparent', 'bg-gray-100');
            });
            
            let imgUrl = currentModalProduct.mainImage;
            let activeTab = document.getElementById('tabMain');

            if(type === 'living' && currentModalProduct.previewLiving) { imgUrl = currentModalProduct.previewLiving; activeTab = document.getElementById('tabLiving'); }
            else if(type === 'bedroom' && currentModalProduct.previewBedroom) { imgUrl = currentModalProduct.previewBedroom; activeTab = document.getElementById('tabBedroom'); }
            
            activeTab.classList.remove('border-transparent', 'bg-gray-100');
            activeTab.classList.add('border-wood-500', 'bg-white', 'shadow-sm');

            const img = document.getElementById('modalPreviewImg');
            img.style.opacity = 0;
            setTimeout(() => { img.src = imgUrl; img.style.opacity = 1; }, 200);
        }

        window.selectForOrder = function(docId) {
            const p = allProducts.find(x => x.docId === docId);
            if(!p) return;
            document.getElementById('productSelect').value = p.id;
            updateOrderPreview('retail');
            window.location.hash = '#order';
            setTimeout(() => document.getElementById('areaInput').focus(), 800);
            showToast('پارکێتەکە چووە فۆڕمی داواکارییەوە');
        }
        // Dynamic Order Previews
        function updateOrderPreview(type) {
            const prefix = type === 'retail' ? '' : 'w';
            const priceEl = document.getElementById(type === 'retail' ? 'retailPricePreview' : 'wholePricePreview');
            const areaEl = document.getElementById(type === 'retail' ? 'retailAreaPreview' : 'wholeAreaPreview');
            const totalEl = document.getElementById(type === 'retail' ? 'retailTotalPreview' : 'wholeTotalPreview');
            
            const prodId = document.getElementById(prefix === 'w' ? 'wProductSelect' : 'productSelect').value;
            const areaVal = parseFloat(document.getElementById(prefix === 'w' ? 'wAreaInput' : 'areaInput').value) || 0;
            
            let price = 0;
            if(prodId && allProducts) {
                const prod = allProducts.find(p => p.id === prodId);
                if(prod) {
                    price = type === 'retail' ? parseFloat(prod.price || 0) : parseFloat(prod.wholesalePrice || prod.price || 0);
                }
            }
            
            if(priceEl) priceEl.textContent = price > 0 ? price.toFixed(2) + '$' : '0.00$';
            if(areaEl) areaEl.textContent = areaVal > 0 ? areaVal + ' m²' : '0 m²';
            if(totalEl) totalEl.textContent = (price * areaVal).toFixed(2) + '$';
        }

        ['productSelect', 'areaInput'].forEach(id => {
            const el = document.getElementById(id);
            if(el) {
                el.addEventListener('change', () => updateOrderPreview('retail'));
                el.addEventListener('input', () => updateOrderPreview('retail'));
            }
        });

        ['wProductSelect', 'wAreaInput'].forEach(id => {
            const el = document.getElementById(id);
            if(el) {
                el.addEventListener('change', () => updateOrderPreview('wholesale'));
                el.addEventListener('input', () => updateOrderPreview('wholesale'));
            }
        });

        // TELEGRAM CONTACT FORM SUBMISSION
        document.getElementById('telegramContactForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = document.getElementById('contactSubmitBtn');
            btn.innerHTML = '<i class="fas fa-spinner fa-spin text-xl"></i> تکایە چاوەڕێبە...';
            btn.disabled = true;

            const name = document.getElementById('contactName').value;
            const phone = document.getElementById('contactPhone').value;
            const msg = document.getElementById('contactMessage').value;

            const message = `
<b>📩 پەیوەندی نوێ (Zone Parquet)</b>
👤 <b>ناو:</b> ${name}
📱 <b>تەلەفۆن:</b> ${phone}
📝 <b>نامە:</b> ${msg}
            `;

            try {
                const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: 'HTML', disable_web_page_preview: true })
                });
                const result = await res.json();
                if(result.ok) {
                    showToast('نامەکەت بە سەرکەوتوویی نێردرا، بە زووترین کات وەڵامت دەدەینەوە', 'success');
                    document.getElementById('telegramContactForm').reset();
                } else {
                    showToast('هەڵەیەک ڕوویدا لە ناردنی نامەکە', 'error');
                }
            } catch (error) {
                showToast('هەڵەیەک ڕوویدا لە ناردنی نامەکە', 'error');
            }
            btn.innerHTML = '<i class="fab fa-telegram-plane text-xl"></i> ناردنی نامە';
            btn.disabled = false;
        });

        // TELEGRAM FORM SUBMISSION
        document.getElementById('orderForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = document.getElementById('submitBtn');
            btn.innerHTML = '<i class="fas fa-spinner fa-spin text-2xl"></i> خەریکی ناردنە...';
            btn.disabled = true;

            const pId = document.getElementById('productSelect').value;
            const pName = document.getElementById('productSelect').options[document.getElementById('productSelect').selectedIndex].text;
            const area = document.getElementById('areaInput').value;
            const name = document.getElementById('nameInput').value;
            const phone = document.getElementById('phoneInput').value;
            const addr = document.getElementById('addressInput').value;
            const lat = document.getElementById('latInput').value;
            const lng = document.getElementById('lngInput').value;

            // Save to Firestore
            let firestoreSuccess = false;
            try {
                await addDoc(collection(db, "orders"), {
                    productId: pId,
                    productName: pName,
                    area: area,
                    customerName: name,
                    phone: phone,
                    address: addr,
                    lat: lat,
                    lng: lng,
                    createdAt: new Date().toISOString(),
                    status: 'pending'
                });
                
                // Send background push notification
                if(window.sendAdminPushNotification) {
                    window.sendAdminPushNotification("زۆن پارکێت | داواکاری نوێ", `داواکارییەکی نوێ هاتووە لەلایەن: ${name}`);
                }
                firestoreSuccess = true;
            } catch (error) {
                console.error("Failed to save order to firestore", error);
            }

            const message = `🌟 <b>داواکارییەکی نوێی پڕۆفیشناڵ</b> 🌟\n\n🛒 <b>پارکێت:</b> ${pName}\n▪️ ڕووبەر: <b>${area} m²</b>\n\n👤 <b>کڕیار:</b> ${name}\n▪️ مۆبایل: <code>${phone}</code>\n\n📍 <b>ناونیشان:</b> ${addr}\n▪️ نەخشە: <a href="https://www.google.com/maps?q=${lat},${lng}">ببینە لە نەخشە</a>\n\n${firestoreSuccess ? "✅ نێردرا بۆ پانێڵی بەڕێوەبەر" : "❌ نەتوانرا لە داتابەیس پاشەکەوت بکرێت"}`;

            try {
                const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: 'HTML', disable_web_page_preview: true })
                });
                const result = await res.json();
                if(result.ok) { 
                    showToast('داواکارییەکەت سەرکەوتووانە نێردرا!'); 
                    this.reset(); 
                } else { 
                    showToast('کێشە لە ناردن هەبوو، دووبارە هەوڵبدەرەوە', 'error'); 
                }
            } catch(e) { 
                showToast('کێشەی ئینتەرنێت هەیە', 'error'); 
            }
            
            btn.innerHTML = '<i class="fab fa-telegram-plane text-xl"></i> ناردنی داواکاری بۆ کۆمپانیا';
            btn.disabled = false;
        });

        // --- Expenses & Net Profit Module ---
        window.globalTotalExpenses = 0;
        window.globalGrossProfit = 0;
        
        window.updateDashboardNetProfit = function() {
            const netProfit = window.globalGrossProfit - window.globalTotalExpenses;
            if(document.getElementById('dashTotalProfit')) document.getElementById('dashTotalProfit').innerText = '$' + netProfit.toFixed(2);
            if(document.getElementById('dashGrossProfit')) document.getElementById('dashGrossProfit').innerText = '$' + window.globalGrossProfit.toFixed(2);
            if(document.getElementById('dashTotalExpensesCard')) document.getElementById('dashTotalExpensesCard').innerText = '$' + window.globalTotalExpenses.toFixed(2);
        };

        window.loadAdminExpenses = async function() {
            try {
                const q = query(collection(db, "expenses"), orderBy("date", "desc"));
                const querySnapshot = await getDocs(q);
                
                let totalExpenses = 0;
                let expensesHtml = '';
                
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const amount = parseFloat(data.amount) || 0;
                    totalExpenses += amount;
                    
                    expensesHtml += `
                        <tr class="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                            <td class="p-4 font-bold text-gray-800">${data.title}</td>
                            <td class="p-4 text-red-600 font-black" dir="ltr">$${amount.toFixed(2)}</td>
                            <td class="p-4 text-gray-500 font-bold" dir="ltr">${data.date}</td>
                            <td class="p-4 text-center">
                                <button onclick="window.deleteExpense('${doc.id}')" class="text-red-500 hover:bg-red-50 w-10 h-10 rounded-xl transition-colors inline-flex items-center justify-center border border-transparent hover:border-red-100 shadow-sm"><i class="fas fa-trash-alt"></i></button>
                            </td>
                        </tr>
                    `;
                });
                
                document.getElementById('adminExpensesTable').innerHTML = expensesHtml || `<tr><td colspan="4" class="p-8 text-center text-gray-400 font-bold text-lg">هیچ خەرجییەک نەدۆزرایەوە.</td></tr>`;
                window.globalTotalExpenses = totalExpenses;
                window.updateDashboardNetProfit();
            } catch (error) {
                console.error("Error loading expenses:", error);
            }
        };

        document.getElementById('addExpenseForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('saveExpenseBtn');
            btn.innerHTML = '<i class="fas fa-spinner fa-spin text-xl"></i> پاشەکەوت دەکرێت...';
            btn.disabled = true;

            try {
                await addDoc(collection(db, "expenses"), {
                    title: document.getElementById('expenseName').value,
                    amount: parseFloat(document.getElementById('expenseAmount').value) || 0,
                    date: document.getElementById('expenseDate').value,
                    createdAt: new Date().toISOString()
                });
                
                showToast("خەرجییەکە بە سەرکەوتوویی تۆمارکرا", "success");
                document.getElementById('addExpenseForm').reset();
                document.getElementById('addExpenseModal').classList.add('hidden');
                window.loadAdminExpenses();
            } catch (error) {
                showToast("هەڵە لە تۆمارکردنی خەرجی", "error");
            } finally {
                btn.innerHTML = '<i class="fas fa-save text-xl"></i> پاشەکەوتکردن';
                btn.disabled = false;
            }
        });

        window.deleteExpense = async function(id) {
            if(confirm("ئایا دڵنیای لە سڕینەوەی ئەم خەرجییە؟")) {
                try {
                    await deleteDoc(doc(db, "expenses", id));
                    showToast("خەرجییەکە سڕایەوە", "success");
                    window.loadAdminExpenses();
                } catch(e) {
                    showToast("هەڵە لە سڕینەوە", "error");
                }
            }
        };

        // --- Settings & Backup Module ---
        window.currentExchangeRate = 150000; // default 100$ = 150,000 IQD

        window.loadExchangeRate = async function() {
            try {
                const docSnap = await getDoc(doc(db, "settings", "general"));
                if (docSnap.exists() && docSnap.data().exchangeRate) {
                    window.currentExchangeRate = docSnap.data().exchangeRate;
                }
                const input = document.getElementById('exchangeRateInput');
                if(input) input.value = window.currentExchangeRate;
            } catch(e) {
                console.error("Error loading exchange rate:", e);
            }
        };

        window.saveExchangeRate = async function() {
            const input = document.getElementById('exchangeRateInput');
            if(!input || !input.value) return;
            const rate = parseFloat(input.value);
            try {
                await setDoc(doc(db, "settings", "general"), { exchangeRate: rate }, { merge: true });
                window.currentExchangeRate = rate;
                showToast("نرخی دۆلار بە سەرکەوتوویی نوێکرایەوە", "success");
                
                // Re-render UIs with new rate
                if(typeof allProducts !== 'undefined') {
                    renderProductsUI(allProducts.filter(p => p.sellType === 'retail' || p.sellType === 'both'));
                }
                if(window.location.hash === '#admin') {
                    loadAdminProducts();
                    loadOrders();
                }
            } catch(e) {
                console.error(e);
                showToast("هەڵە لە نوێکردنەوەی نرخی دۆلار", "error");
            }
        };

        window.formatIQD = function(usdAmount) {
            if(!usdAmount || isNaN(usdAmount)) return "٠ دینار";
            const iqd = (usdAmount * (window.currentExchangeRate / 100));
            return new Intl.NumberFormat('ar-IQ').format(iqd) + " دینار";
        };

        window.exportDataAsJSON = async function() {
            showToast("خەریکی کۆکردنەوەی داتاکانە، تکایە چاوەڕێبە...", "success");
            try {
                const data = { products: [], orders: [], expenses: [] };
                
                const pSnap = await getDocs(collection(db, "products"));
                pSnap.forEach(doc => data.products.push({id: doc.id, ...doc.data()}));
                
                const oSnap = await getDocs(collection(db, "orders"));
                oSnap.forEach(doc => data.orders.push({id: doc.id, ...doc.data()}));
                
                const eSnap = await getDocs(collection(db, "expenses"));
                eSnap.forEach(doc => data.expenses.push({id: doc.id, ...doc.data()}));

                const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `zone-parquet-backup-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                showToast("داتاکان بە سەرکەوتوویی داونلۆد کران", "success");
            } catch(e) {
                console.error("Backup Error: ", e);
                showToast("هەڵە لە داونلۆدکردنی داتاکان", "error");
            }
        };

        window.confirmAndDeleteCollection = async function(collectionName, title) {
            if(confirm(`ئاگادارکەرەوەی توند!\n\nئایا بە تەواوی دڵنیای کە دەتەوێت هەموو (${title}) بسڕیتەوە؟\nئەم کارە ناگەڕێتەوە!`)) {
                const verify = prompt(`بۆ دڵنیابوونەوە، تکایە بنووسە: DELETE`);
                if(verify === "DELETE") {
                    showToast(`خەریکی سڕینەوەی ${title}...`, "success");
                    try {
                        const snap = await getDocs(collection(db, collectionName));
                        for(let document of snap.docs) {
                            await deleteDoc(document.ref);
                        }
                        
                        showToast(`سەرجەم (${title}) سڕانەوە`, "success");
                        if(collectionName === 'products') window.loadAdminProducts();
                        if(collectionName === 'orders') window.loadAdminOrders();
                        if(collectionName === 'expenses') window.loadAdminExpenses();
                    } catch(e) {
                        console.error(e);
                        showToast(`هەڵە لە سڕینەوەی ${title}`, "error");
                    }
                } else {
                    showToast("سڕینەوە هەڵوەشایەوە، چونکە وشەی دروست نەنووسرا.", "error");
                }
            }
        };
        window.selectForWholesaleOrder = function(docId) {
            const p = allProducts.find(x => x.docId === docId);
            if(!p) return;
            document.getElementById('wProductSelect').value = p.id;
            document.getElementById('wOrder').scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => document.getElementById('wAreaInput').focus(), 800);
            showToast('ڕاکێشرا بۆ فۆڕمی داواکاری جۆملە');
        }

        document.getElementById('wholesaleOrderForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = document.getElementById('wSubmitBtn');
            btn.innerHTML = '<i class="fas fa-spinner fa-spin text-2xl"></i> خەریکی ناردنە...';
            btn.disabled = true;

            const pId = document.getElementById('wProductSelect').value;
            const pName = document.getElementById('wProductSelect').options[document.getElementById('wProductSelect').selectedIndex].text;
            const area = document.getElementById('wAreaInput').value;
            const name = document.getElementById('wNameInput').value;
            const phone = document.getElementById('wPhoneInput').value;
            const addr = document.getElementById('wAddressInput').value;
            const lat = document.getElementById('wLatInput').value;
            const lng = document.getElementById('wLngInput').value;

            // Save to Firestore with orderType: 'wholesale'
            let firestoreSuccess = false;
            try {
                await addDoc(collection(db, "orders"), {
                    productId: pId,
                    productName: pName,
                    area: area,
                    customerName: name,
                    phone: phone,
                    address: addr,
                    lat: lat,
                    lng: lng,
                    orderType: 'wholesale',
                    createdAt: new Date().toISOString(),
                    status: 'pending'
                });
                
                // Send background push notification
                if(window.sendAdminPushNotification) {
                    window.sendAdminPushNotification("زۆن پارکێت جۆملە | داواکاری نوێ", `داواکارییەکی جۆملە هاتووە لەلایەن: ${name}`);
                }
                firestoreSuccess = true;
            } catch (error) {
                console.error("Failed to save wholesale order", error);
            }

            const message = `🏢 <b>داواکارییەکی نوێی جۆملە (B2B)</b> 🏢\n\n📦 <b>پارکێت:</b> ${pName}\n▪️ ڕووبەر: <b>${area} m²</b>\n\n🛒 <b>دوکان:</b> ${name}\n▪️ مۆبایل: <code>${phone}</code>\n\n📍 <b>ناونیشان:</b> ${addr}\n▪️ نەخشە: <a href="https://www.google.com/maps?q=${lat},${lng}">ببینە لە نەخشە</a>\n\n${firestoreSuccess ? "✅ نێردرا بۆ پانێڵی بەڕێوەبەر" : "❌ نەتوانرا پاشەکەوت بکرێت"}`;

            try {
                const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: 'HTML', disable_web_page_preview: true })
                });
                const result = await res.json();
                if(result.ok) { 
                    showToast('داواکارییەکەت سەرکەوتووانە نێردرا!'); 
                    this.reset(); 
                } else { 
                    showToast('کێشە لە ناردن هەبوو، دووبارە هەوڵبدەرەوە', 'error'); 
                }
            } catch(e) { 
                showToast('کێشەی ئینتەرنێت هەیە', 'error'); 
            }
            
            btn.innerHTML = '<i class="fab fa-telegram-plane text-xl"></i> ناردنی داواکاری بۆ کۆمپانیا';
            btn.disabled = false;
        });

        // Professional Notification System
        window.requestNotificationPermission = function() {
            if (!("Notification" in window)) {
                showToast("وێبگەڕەکەت پشتگیری نۆتیفیکەیشن ناکات", "error");
                return;
            }
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    showToast("مۆڵەتی نۆتیفیکەیشن بە سەرکەوتوویی درا");
                    const icon = document.getElementById('bellIcon');
                    if(icon) {
                        icon.classList.remove('text-gray-600');
                        icon.classList.add('text-gold-500', 'animate-pulse');
                        setTimeout(() => icon.classList.remove('animate-pulse'), 2000);
                    }
                } else {
                    showToast("مۆڵەتی نۆتیفیکەیشن ڕەتکرایەوە", "error");
                }
            });
        }

        // Listen for new orders/notifications (Live Controller Feature)
        let isInitialLoad = true;
        onSnapshot(collection(db, "orders"), (snapshot) => {
            if (isInitialLoad) {
                isInitialLoad = false;
                return;
            }
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const data = change.doc.data();
                    const msg = `داواکارییەکی نوێ هاتووە لەلایەن: ${data.customerName || 'کڕیارێکی نوێ'}`;
                    
                    // Show Toast
                    showToast(msg, "success");
                    
                    // Show Badge on Bell
                    const badge = document.getElementById('notificationBadge');
                    if(badge) badge.classList.remove('hidden');

                    // Play sound
                    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                    audio.play().catch(e => console.log('Audio play blocked:', e));

                    // Show System Notification
                    if ("Notification" in window && Notification.permission === "granted") {
                        new Notification("زۆن پارکێت | داواکاری نوێ", {
                            body: msg,
                            icon: "/icon-192.png",
                            badge: "/icon-192.png",
                            dir: "rtl"
                        });
                    }
                }
            });
        });

        // Service Worker for PWA
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').then(registration => {
                    console.log('PWA ServiceWorker registered with scope:', registration.scope);
                }).catch(err => {
                    console.log('PWA ServiceWorker registration failed:', err);
                });
            });
        }

        // Initialize Router
        window.loadExchangeRate().then(() => {
            handleRoute();
        });
    

        let mapInitialized = false;
        window.initMapIfNeeded = function() {
            if(mapInitialized) return;
            const defaultLat = 36.1901; 
            const defaultLng = 43.9930;
            
            const map = L.map('map', { scrollWheelZoom: false }).setView([defaultLat, defaultLng], 12);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap'
            }).addTo(map);
            
            const customIcon = L.divIcon({
                className: 'custom-div-icon',
                html: "<div style='background-color:#8b6456; width:28px; height:28px; border-radius:50%; border:4px solid white; box-shadow:0 5px 15px rgba(139,100,86,0.6);'></div>",
                iconSize: [28, 28],
                iconAnchor: [14, 14]
            });

            const marker = L.marker([defaultLat, defaultLng], {draggable: true, icon: customIcon}).addTo(map);
            document.getElementById('latInput').value = defaultLat;
            document.getElementById('lngInput').value = defaultLng;
            
            marker.on('dragend', function() {
                const pos = marker.getLatLng();
                document.getElementById('latInput').value = pos.lat; document.getElementById('lngInput').value = pos.lng;
            });
            map.on('click', function(e) {
                marker.setLatLng(e.latlng);
                document.getElementById('latInput').value = e.latlng.lat; document.getElementById('lngInput').value = e.latlng.lng;
            });

            setTimeout(() => map.invalidateSize(), 800);
            mapInitialized = true;
        }

        let wMapInitialized = false;
        window.initWholesaleMapIfNeeded = function() {
            if(wMapInitialized) return;
            const defaultLat = 36.1901; 
            const defaultLng = 43.9930;
            
            const map = L.map('wMap', { scrollWheelZoom: false }).setView([defaultLat, defaultLng], 12);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap'
            }).addTo(map);
            
            const customIcon = L.divIcon({
                className: 'custom-div-icon',
                html: "<div style='background-color:#000000; width:28px; height:28px; border-radius:50%; border:4px solid #eab308; box-shadow:0 5px 15px rgba(234,179,8,0.6);'></div>",
                iconSize: [28, 28],
                iconAnchor: [14, 14]
            });

            const marker = L.marker([defaultLat, defaultLng], {draggable: true, icon: customIcon}).addTo(map);
            document.getElementById('wLatInput').value = defaultLat;
            document.getElementById('wLngInput').value = defaultLng;
            
            marker.on('dragend', function() {
                const pos = marker.getLatLng();
                document.getElementById('wLatInput').value = pos.lat; document.getElementById('wLngInput').value = pos.lng;
            });
            map.on('click', function(e) {
                marker.setLatLng(e.latlng);
                document.getElementById('wLatInput').value = e.latlng.lat; document.getElementById('wLngInput').value = e.latlng.lng;
            });

            setTimeout(() => map.invalidateSize(), 800);
            wMapInitialized = true;
        }
    

        const translations = {
            ku: {
                nav_catalog: "کەتەلۆگ",
                nav_order: "داواکردن",
                hero_badge: "بەرزترین کوالیتی پارکێت لە کوردستان",
                hero_title_1: "جوانی و سروشت بۆ",
                hero_title_2: "ناوەوەی ماڵەکەت",
                hero_desc: "بەرزترین ئاستی پارکێت، دژە ئاو، ڕەنگی نەگۆڕ و ستایلی سەردەمیانە. ئێستا جۆرەکان ببینە و ڕاستەوخۆ داوای بکە بۆ گەیاندن.",
                hero_btn: "بینینی کەتەلۆگ",
                cat_title: "کەتەلۆگی بەرهەمەکان",
                cat_desc: "جۆرە جیاوازەکانی پارکێت بە قیاس و ڕەنگی جیاواز",
                cat_all: "هەمووی",
                cat_water: "دژە ئاو",
                cat_loading: "خەریکی هێنانی زانیارییەکان...",
                cat_empty: "هیچ بەرهەمێک لە کەتەلۆگدا نییە.",
                order_title: "فۆڕمی داواکاری پڕۆفیشناڵ",
                order_desc: "زانیارییەکانت بە وردی پڕبکەرەوە، تیمی ئێمە لە کەمترین کاتدا پەیوەندیت پێوە دەکەن.",
                order_product: "جۆری پارکێت",
                order_area: "ڕووبەر (مەتر دووجا)",
                order_name: "ناوی تەواو",
                order_phone: "مۆبایل",
                order_address: "ناونیشانی تەواو",
                order_map: "دیاریکردنی شوێن لەسەر نەخشە",
                order_map_desc: "مارکەرەکە ڕابکێشە بۆ سەر ماڵەکەت یان شوێنی کارەکەت.",
                order_submit: "ناردنی داواکاری بۆ کۆمپانیا",
                footer_desc: "باشترین جۆرەکانی پارکێت بە گەرەنتی و کوالیتی بەرز بۆ ماڵ و شوێنی کارەکەت.",
                footer_copy: "&copy; 2026 گشت مافەکانی پارێزراوە بۆ زۆن پارکێت.",
                // Invoice
                inv_title: "دروستکردنی وەسڵی پڕۆفیشناڵ",
                inv_desc: "زانیارییەکانی کڕیار و بەرهەمەکان پڕبکەرەوە بۆ دەرکردنی وەسڵ.",
                inv_name: "ناوی کڕیار",
                inv_phone: "مۆبایل",
                inv_date: "بەروار",
                inv_no: "ژمارەی وەسڵ",
                inv_add_item: "زیادکردنی پارکێت بۆ ناو وەسڵەکە",
                inv_select: "هەڵبژاردنی پارکێت لە کەتەلۆگ",
                inv_area: "ڕووبەر (مەتر چوارگۆشە)",
                inv_price: "نرخی مەتر ($)",
                inv_tbl_desc: "وەسفی کاڵا",
                inv_tbl_area: "ڕووبەر (m²)",
                inv_tbl_price: "نرخ ($)",
                inv_tbl_total: "کۆ ($)",
                inv_tbl_del: "سڕینەوە",
                inv_grand_total: "کۆی گشتی پێویست (Total)",
                inv_print_btn: "دەرکردن و چاپکردنی وەسڵ",
                inv_name_val: "ناوی کڕیار",
                inv_phone_lbl: "مۆبایل:",
                inv_date_val: "بەروار",
                inv_ptbl_desc: "وەسفی کاڵا",
                inv_ptbl_qty: "بڕ (m²)",
                inv_ptbl_price: "نرخ ($)",
                inv_ptbl_total: "کۆ ($)",
                inv_pgrand_total: "کۆی گشتی"
            },
            en: {
                nav_catalog: "Catalog",
                nav_order: "Order Now",
                hero_badge: "Highest Quality Parquet in Kurdistan",
                hero_title_1: "Beauty & Nature for",
                hero_title_2: "Your Home Interior",
                hero_desc: "Premium grade parquet, waterproof, colorfast, and modern styles. View our selection now and order directly for delivery.",
                hero_btn: "View Catalog",
                cat_title: "Product Catalog",
                cat_desc: "Different types of parquet in various sizes and colors",
                cat_all: "All",
                cat_water: "Waterproof",
                cat_loading: "Loading information...",
                cat_empty: "No products in the catalog.",
                order_title: "Professional Order Form",
                order_desc: "Fill in your details accurately, and our team will contact you shortly.",
                order_product: "Parquet Type",
                order_area: "Area (sq meters)",
                order_name: "Full Name",
                order_phone: "Phone Number",
                order_address: "Full Address",
                order_map: "Location on Map",
                order_map_desc: "Drag the marker to your home or workplace.",
                order_submit: "Send Order to Company",
                footer_desc: "The best types of parquet with high quality and guarantee for your home and workplace.",
                footer_copy: "&copy; 2026 All rights reserved for Zone Parquet.",
                // Invoice
                inv_title: "Create Professional Invoice",
                inv_desc: "Fill in the customer details and products to generate the invoice.",
                inv_name: "Customer Name",
                inv_phone: "Phone Number",
                inv_date: "Date",
                inv_no: "Invoice Number",
                inv_add_item: "Add Parquet to Invoice",
                inv_select: "Select Parquet from Catalog",
                inv_area: "Area (sqm)",
                inv_price: "Price per sqm ($)",
                inv_tbl_desc: "Description",
                inv_tbl_area: "Area (m²)",
                inv_tbl_price: "Price ($)",
                inv_tbl_total: "Total ($)",
                inv_tbl_del: "Delete",
                inv_grand_total: "Grand Total",
                inv_print_btn: "Generate and Print Invoice",
                inv_name_val: "Customer Name",
                inv_phone_lbl: "Phone:",
                inv_date_val: "Date",
                inv_ptbl_desc: "Description",
                inv_ptbl_qty: "Qty (m²)",
                inv_ptbl_price: "Price ($)",
                inv_ptbl_total: "Total ($)",
                inv_pgrand_total: "Grand Total"
            },
            ar: {
                nav_catalog: "الكتالوج",
                nav_order: "اطلب الآن",
                hero_badge: "أعلى جودة باركيه في كردستان",
                hero_title_1: "الجمال والطبيعة لـ",
                hero_title_2: "ديكور منزلك",
                hero_desc: "باركيه عالي الجودة، مقاوم للماء، ألوان ثابتة وتصاميم عصرية. تصفح الأنواع الآن واطلب مباشرة للتوصيل.",
                hero_btn: "عرض الكتالوج",
                cat_title: "كتالوج المنتجات",
                cat_desc: "أنواع مختلفة من الباركيه بمقاسات وألوان متنوعة",
                cat_all: "الكل",
                cat_water: "مقاوم للماء",
                cat_loading: "جاري تحميل المعلومات...",
                cat_empty: "لا توجد منتجات في الكتالوج.",
                order_title: "نموذج طلب احترافي",
                order_desc: "يرجى ملء بياناتك بدقة، وسيقوم فريقنا بالاتصال بك في أقرب وقت.",
                order_product: "نوع الباركيه",
                order_area: "المساحة (متر مربع)",
                order_name: "الاسم الكامل",
                order_phone: "رقم الهاتف",
                order_address: "العنوان الكامل",
                order_map: "تحديد الموقع على الخريطة",
                order_map_desc: "اسحب العلامة إلى منزلك أو مكان عملك.",
                order_submit: "إرسال الطلب للشركة",
                footer_desc: "أفضل أنواع الباركيه بجودة عالية وضمان لمنزلك ومكان عملك.",
                footer_copy: "&copy; 2026 جميع الحقوق محفوظة لزون باركيه.",
                // Invoice
                inv_title: "إنشاء فاتورة احترافية",
                inv_desc: "قم بتعبئة بيانات العميل والمنتجات لإصدار الفاتورة.",
                inv_name: "اسم العميل",
                inv_phone: "رقم الهاتف",
                inv_date: "التاريخ",
                inv_no: "رقم الفاتورة",
                inv_add_item: "إضافة باركيه إلى الفاتورة",
                inv_select: "اختر الباركيه من الكتالوج",
                inv_area: "المساحة (متر مربع)",
                inv_price: "سعر المتر ($)",
                inv_tbl_desc: "وصف المنتج",
                inv_tbl_area: "المساحة (m²)",
                inv_tbl_price: "السعر ($)",
                inv_tbl_total: "المجموع ($)",
                inv_tbl_del: "حذف",
                inv_grand_total: "المجموع الكلي",
                inv_print_btn: "إصدار وطباعة الفاتورة",
                inv_name_val: "اسم العميل",
                inv_phone_lbl: "الهاتف:",
                inv_date_val: "التاريخ",
                inv_ptbl_desc: "وصف المنتج",
                inv_ptbl_qty: "الكمية (m²)",
                inv_ptbl_price: "السعر ($)",
                inv_ptbl_total: "المجموع ($)",
                inv_pgrand_total: "المجموع الكلي"
            }
        };

        window.changeLanguage = function(lang) {
            document.documentElement.lang = lang;
            document.documentElement.dir = (lang === 'en') ? 'ltr' : 'rtl';
            
            const nav = document.getElementById('main-nav');
            if(nav) {
                if(lang === 'en') {
                    nav.classList.remove('space-x-reverse');
                } else {
                    nav.classList.add('space-x-reverse');
                }
            }

            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if(translations[lang] && translations[lang][key]) {
                    el.innerHTML = translations[lang][key];
                }
            });
            
            // Re-render select placeholder if possible
            const sel = document.getElementById('productSelect');
            if(sel && sel.options[0].disabled) {
                sel.options[0].text = (lang === 'en') ? "Please select..." : (lang === 'ar') ? "يرجى التحديد..." : "تکایە هەڵبژێرە...";
            }

            localStorage.setItem('prefLang', lang);
        };

        // Initialize language
        document.addEventListener('DOMContentLoaded', () => {
            const savedLang = localStorage.getItem('prefLang') || 'ku';
            const switcher = document.getElementById('langSwitcher');
            if(switcher) switcher.value = savedLang;
            window.changeLanguage(savedLang);
        });
    

        document.addEventListener('DOMContentLoaded', () => {
            const faqBtns = document.querySelectorAll('.faq-btn');
            faqBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const content = btn.nextElementSibling;
                    const icon = btn.querySelector('i');
                    const isActive = !content.classList.contains('hidden');
                    
                    // Close all others
                    document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
                    document.querySelectorAll('.faq-btn i').forEach(i => i.style.transform = 'rotate(0deg)');
                    
                    if (!isActive) {
                        content.classList.remove('hidden');
                        icon.style.transform = 'rotate(180deg)';
                    }
                });
            });
        });
    

        (function() {
            let currentEtag = null;
            let currentLastModified = null;
            
            async function checkForUpdate() {
                try {
                    const response = await fetch(window.location.href, { method: 'HEAD', cache: 'no-store' });
                    const etag = response.headers.get('Etag');
                    const lastModified = response.headers.get('Last-Modified');
                    
                    if (!currentEtag && !currentLastModified) {
                        currentEtag = etag;
                        currentLastModified = lastModified;
                        return;
                    }

                    if ((etag && currentEtag && etag !== currentEtag) || 
                        (lastModified && currentLastModified && lastModified !== currentLastModified)) {
                        showUpdateToast();
                    }
                } catch (e) {
                    console.log('Update check failed', e);
                }
            }

            function showUpdateToast() {
                if(document.getElementById('update-toast')) return;
                
                const toast = document.createElement('div');
                toast.id = 'update-toast';
                toast.className = 'fixed top-6 left-1/2 transform -translate-x-1/2 z-[99999] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gold-200 p-4 flex items-center gap-4 fade-in-up w-[90%] max-w-md';
                toast.innerHTML = `
                    <div class="w-12 h-12 bg-gold-50 text-gold-500 rounded-full flex items-center justify-center text-xl shadow-inner border border-gold-100 flex-shrink-0">
                        <i class="fas fa-sync-alt animate-spin"></i>
                    </div>
                    <div class="flex-grow">
                        <h4 class="font-black text-wood-900 text-sm md:text-base">وەشانێکی نوێ بەردەستە 🚀</h4>
                        <p class="text-xs md:text-sm text-wood-500 font-medium mt-0.5">زانیارییەکان نوێکرانەوە، تکایە ڕیفرێش بکە.</p>
                    </div>
                    <button onclick="window.location.reload(true)" class="bg-gradient-to-r from-wood-800 to-wood-950 hover:from-wood-950 hover:to-black text-gold-400 font-bold py-2.5 px-5 rounded-xl transition-all shadow-md hover:shadow-lg text-sm flex-shrink-0 pulse-btn border border-wood-700">
                        ڕیفرێش
                    </button>
                    <button onclick="this.parentElement.remove()" class="absolute -top-2 -right-2 w-7 h-7 bg-white text-gray-400 hover:text-red-500 rounded-full flex items-center justify-center shadow-sm border border-gray-200 transition-colors">
                        <i class="fas fa-times text-xs"></i>
                    </button>
                `;
                document.body.appendChild(toast);
            }

            setTimeout(checkForUpdate, 3000); // Initial check
            setInterval(checkForUpdate, 5 * 60 * 1000); // Check every 5 minutes
            
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible') checkForUpdate();
            });
        })();
    <!-- B2B Partner Form Modal -->
    <div id="b2bModal" class="hidden fixed inset-0 z-[100] flex items-center justify-center p-4 bg-wood-950/80 backdrop-blur-md">
        <div class="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden transform transition-all scale-95 opacity-0 border border-white/20" id="b2bModalContent">
            <!-- Modal Header -->
            <div class="bg-gradient-to-l from-wood-800 to-wood-950 p-6 flex justify-between items-center text-white relative overflow-hidden">
                <div class="absolute inset-0 opacity-10" style="background-image: url('https://www.transparenttextures.com/patterns/wood-pattern.png');"></div>
                <div class="relative z-10">
                    <h3 class="text-2xl font-black mb-1 text-gold-400" id="b2bModalTitle"><i class="fas fa-handshake text-wood-300"></i> فۆڕمی هاوبەشی (B2B)</h3>
                    <p class="text-wood-200 text-sm font-medium">داواکاری تایبەت بۆ کۆمپانیاکان و پڕۆژە گەورەکان</p>
                </div>
                <button onclick="window.closeB2bModal()" class="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors relative z-10 backdrop-blur-sm">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <form id="b2bForm" class="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label class="block text-sm font-bold text-gray-700">ناوی کۆمپانیا یان پڕۆژە *</label>
                        <div class="relative group">
                            <i class="fas fa-building absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-wood-600 transition-colors"></i>
                            <input type="text" id="b2bCompany" required placeholder="ناوی پڕۆژەکەت..." class="w-full pr-12 pl-4 py-3 border-2 border-gray-100 shadow-sm hover:border-wood-300 transition-colors rounded-xl focus:border-wood-500 bg-gray-50 outline-none font-bold">
                        </div>
                    </div>
                    <div class="space-y-2">
                        <label class="block text-sm font-bold text-gray-700">ناوی کەسی پەیوەندیگر *</label>
                        <div class="relative group">
                            <i class="fas fa-user absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-wood-600 transition-colors"></i>
                            <input type="text" id="b2bName" required placeholder="ناوی تەواوت..." class="w-full pr-12 pl-4 py-3 border-2 border-gray-100 shadow-sm hover:border-wood-300 transition-colors rounded-xl focus:border-wood-500 bg-gray-50 outline-none font-bold">
                        </div>
                    </div>
                    <div class="space-y-2">
                        <label class="block text-sm font-bold text-gray-700">ژمارە تەلەفۆن *</label>
                        <div class="relative group">
                            <i class="fas fa-phone absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-wood-600 transition-colors"></i>
                            <input type="text" id="b2bPhone" required placeholder="0770..." dir="ltr" class="w-full pr-12 pl-4 py-3 border-2 border-gray-100 shadow-sm hover:border-wood-300 transition-colors rounded-xl focus:border-wood-500 bg-gray-50 outline-none font-bold font-mono text-left">
                        </div>
                    </div>
                    <div class="space-y-2">
                        <label class="block text-sm font-bold text-gray-700">ڕووبەری مەزەندەکراو (مەتر دووجا) *</label>
                        <div class="relative group">
                            <i class="fas fa-ruler-combined absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-wood-600 transition-colors"></i>
                            <input type="number" id="b2bArea" required placeholder="1500" dir="ltr" class="w-full pr-12 pl-4 py-3 border-2 border-gray-100 shadow-sm hover:border-wood-300 transition-colors rounded-xl focus:border-wood-500 bg-gray-50 outline-none font-bold font-mono text-left">
                        </div>
                    </div>
                </div>
                
                <div class="space-y-2">
                    <label class="block text-sm font-bold text-gray-700">جۆری پڕۆژە *</label>
                    <div class="relative group">
                        <i class="fas fa-project-diagram absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-wood-600 transition-colors"></i>
                        <select id="b2bType" required class="w-full pr-12 pl-4 py-3 border-2 border-gray-100 shadow-sm hover:border-wood-300 transition-colors rounded-xl focus:border-wood-500 bg-gray-50 outline-none font-bold appearance-none">
                            <option value="" disabled selected>جۆری پڕۆژەکەت هەڵبژێرە...</option>
                            <option value="residential">یەکەی نیشتەجێبوون (Residential)</option>
                            <option value="commercial">بازرگانی و ئۆفیس (Commercial)</option>
                            <option value="hotel">ئوتێل و ڕێستۆرانت (Hospitality)</option>
                            <option value="other">تر</option>
                        </select>
                        <i class="fas fa-chevron-down absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="block text-sm font-bold text-gray-700">تێبینی یان داواکاری تایبەت</label>
                    <textarea id="b2bNotes" rows="3" placeholder="هەر زانیارییەکی زیاتر کە پێویست بێت..." class="w-full p-4 border-2 border-gray-100 shadow-sm hover:border-wood-300 transition-colors rounded-xl focus:border-wood-500 bg-gray-50 outline-none font-medium leading-relaxed"></textarea>
                </div>

                <div class="pt-4 border-t border-gray-100">
                    <button type="submit" id="submitB2bBtn" class="w-full py-4 rounded-xl font-black text-white bg-gradient-to-l from-wood-600 to-wood-800 hover:from-wood-700 hover:to-wood-900 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3">
                        <i class="fas fa-paper-plane text-xl"></i> ناردنی داواکاری
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Floating WhatsApp Widget -->
    <a href="https://wa.me/9647701234567" target="_blank" rel="noopener noreferrer" class="fixed bottom-6 left-6 z-50 w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center text-4xl shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.23)] hover:-translate-y-1 transition-all duration-300 tooltip-trigger">
        <i class="fab fa-whatsapp"></i>
        <div class="tooltip-content absolute left-full bottom-1/2 translate-y-1/2 ml-4 bg-gray-900 text-white text-sm font-bold py-2 px-4 rounded-lg opacity-0 pointer-events-none transition-opacity whitespace-nowrap shadow-lg">
            لە وەتسئەپ نامە بنێرە
            <div class="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-900"></div>
        </div>
    </a>
    
    <style>
        .tooltip-trigger:hover .tooltip-content { opacity: 1; }
    </style>

    <!-- B2B Logic -->
    
        import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
        const db = getFirestore();

        window.openB2bModal = function() {
            const modal = document.getElementById('b2bModal');
            const content = document.getElementById('b2bModalContent');
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                content.classList.remove('scale-95', 'opacity-0');
                content.classList.add('scale-100', 'opacity-100');
            }, 10);
            document.body.classList.add('modal-open');
        };

        window.closeB2bModal = function() {
            const modal = document.getElementById('b2bModal');
            const content = document.getElementById('b2bModalContent');
            content.classList.remove('scale-100', 'opacity-100');
            content.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                modal.classList.add('hidden');
                document.body.classList.remove('modal-open');
            }, 300);
        };

        document.getElementById('b2bForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('submitB2bBtn');
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> دەنێردرێت...';
            btn.disabled = true;

            const data = {
                companyName: document.getElementById('b2bCompany').value,
                contactName: document.getElementById('b2bName').value,
                phone: document.getElementById('b2bPhone').value,
                area: parseFloat(document.getElementById('b2bArea').value),
                projectType: document.getElementById('b2bType').value,
                notes: document.getElementById('b2bNotes').value,
                createdAt: new Date().toISOString(),
                status: 'pending'
            };

            try {
                await addDoc(collection(db, "b2b_partners"), data);
                if(window.showToast) window.showToast('داواکارییەکەت بە سەرکەوتوویی نێردرا. بەمزووانە پەیوەندیت پێوە دەکەین.', 'success');
                document.getElementById('b2bForm').reset();
                window.closeB2bModal();
            } catch (error) {
                console.error("Error adding B2B partner: ", error);
                if(window.showToast) window.showToast('هەڵەیەک ڕوویدا. تکایە دووبارە هەوڵبدەرەوە.', 'error');
            } finally {
                btn.innerHTML = '<i class="fas fa-paper-plane text-xl"></i> ناردنی داواکاری';
                btn.disabled = false;
            }
        });
    