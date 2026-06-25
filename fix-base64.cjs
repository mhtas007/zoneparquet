const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// 1. Change type="url" to type="text" for the image inputs so they don't block Base64 URLs
content = content.replace(/<input type="url" id="apMainImg"/g, '<input type="text" id="apMainImg"');
content = content.replace(/<input type="url" id="apLivImg"/g, '<input type="text" id="apLivImg"');
content = content.replace(/<input type="url" id="apBedImg"/g, '<input type="text" id="apBedImg"');

// 2. Replace uploadImageFile to use Base64 compression instead of Firebase Storage
const oldUploadStr = `        window.uploadImageFile = async function(file) {
            if(!file) return null;
            const storageRef = ref(storage, 'products/' + Date.now() + '_' + file.name);
            await uploadBytes(storageRef, file);
            return await getDownloadURL(storageRef);
        };`;

const newUploadStr = `        window.uploadImageFile = async function(file) {
            if(!file) return null;
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = event => {
                    const img = new Image();
                    img.src = event.target.result;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const MAX_WIDTH = 800;
                        const MAX_HEIGHT = 800;
                        let width = img.width;
                        let height = img.height;
                        
                        if (width > height) {
                            if (width > MAX_WIDTH) {
                                height *= MAX_WIDTH / width;
                                width = MAX_WIDTH;
                            }
                        } else {
                            if (height > MAX_HEIGHT) {
                                width *= MAX_HEIGHT / height;
                                height = MAX_HEIGHT;
                            }
                        }
                        
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);
                        
                        // Compress to JPEG with 70% quality to ensure small size for Firestore
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                        resolve(dataUrl);
                    };
                    img.onerror = error => reject(error);
                };
                reader.onerror = error => reject(error);
            });
        };`;

if(content.includes(oldUploadStr)) {
    content = content.replace(oldUploadStr, newUploadStr);
    fs.writeFileSync('index.html', content, 'utf8');
    console.log('Successfully applied Base64 compressor!');
} else {
    console.log('Could not find uploadImageFile string exactly. Using regex...');
    content = content.replace(/window\.uploadImageFile\s*=\s*async\s*function\(file\)\s*\{[\s\S]*?getDownloadURL\(storageRef\);\s*\};/g, newUploadStr);
    fs.writeFileSync('index.html', content, 'utf8');
    console.log('Successfully applied via regex!');
}
