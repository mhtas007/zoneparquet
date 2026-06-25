const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

let startIdx = -1;
let endIdx = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('// Auto-upload selected file to generate link immediately')) {
        startIdx = i;
    }
    if (startIdx !== -1 && i > startIdx && lines[i].includes('});') && lines[i].includes('        });')) {
        endIdx = i;
        break;
    }
}

if (startIdx !== -1 && endIdx !== -1) {
    const newCode = `        // Auto-upload selected file to generate link immediately with professional loading state
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
        });`;
        
    lines.splice(startIdx, endIdx - startIdx + 1, newCode);
    fs.writeFileSync('index.html', lines.join('\n'), 'utf8');
    console.log('Successfully replaced file upload listener!');
} else {
    console.log('Could not find the block to replace.');
}
