const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const targetStr = `        document.getElementById('apMainImgFile').addEventListener('change', async function(e) {
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
                    inputUrl.dispatchEvent(new Event('input'));
                    
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
        });`;

const newStr = `        document.getElementById('apMainImgFile').addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            // Show local preview immediately
            const localUrl = URL.createObjectURL(file);
            const img = document.getElementById('liveImagePreview');
            const icon = document.getElementById('previewPlaceholderIcon');
            img.src = localUrl;
            img.onload = () => { img.style.opacity = 0.5; icon.style.opacity = 0; };
            img.onerror = () => { img.style.opacity = 0; icon.style.opacity = 1; };
            
            showToast("خەریکی بەرزکردنەوەی وێنەکەین...", "info");
            
            try {
                // Background upload without locking UI
                window.uploadImageFile(file).then(url => {
                    if (url) {
                        const inputUrl = document.getElementById('apMainImg');
                        inputUrl.value = url;
                        inputUrl.dispatchEvent(new Event('input'));
                        showToast("وێنەکە بە سەرکەوتوویی بوو بە لینک!", "success");
                        e.target.value = ''; // Clear file input since we have the URL now
                    }
                }).catch(error => {
                    showToast("هەڵە لە بەرزکردنەوەی وێنەکە، بەڵام دەتوانیت پاشەکەوت بکەیت و دووبارە هەوڵدەداتەوە", "error");
                });
            } catch(error) {
                console.error(error);
            }
        });`;

content = content.replace(targetStr, newStr);

fs.writeFileSync('index.html', content, 'utf8');
console.log('Fixed upload disable!');
