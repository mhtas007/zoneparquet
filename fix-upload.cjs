const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const targetStr = `        // Auto-upload selected file to generate link immediately
        document.getElementById('apMainImgFile').addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            showToast("وێنەکە بەرەوکرێتەوە دەکەین...", "info");
            try {
                const url = await window.uploadImageFile(file);
                if (url) {
                    const inputUrl = document.getElementById('apMainImg');
                    inputUrl.value = url;
                    // Trigger input event to update preview
                    inputUrl.dispatchEvent(new Event('input'));
                    showToast("وێنەکە بە سەرکەوتوویی بەرزکرایەوە!", "success");
                    e.target.value = ''; // Clear file input since we have the URL now
                }
            } catch(error) {
                showToast("هەڵە لە بەرزکردنەوەی وێنەکە", "error");
            }
        });`;

const newStr = `        // Local preview for selected file without auto-uploading
        document.getElementById('apMainImgFile').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const localUrl = URL.createObjectURL(file);
            const img = document.getElementById('liveImagePreview');
            const icon = document.getElementById('previewPlaceholderIcon');
            img.src = localUrl;
            img.onload = () => { img.style.opacity = 1; icon.style.opacity = 0; };
            img.onerror = () => { img.style.opacity = 0; icon.style.opacity = 1; };
            
            // Clear the URL input to ensure the form knows we are using a local file
            document.getElementById('apMainImg').value = '';
        });`;

content = content.replace(targetStr, newStr);

fs.writeFileSync('index.html', content, 'utf8');
console.log('Fixed upload preview!');
