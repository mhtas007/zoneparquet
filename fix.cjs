const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const address_input = '<input type="text" id="addressInput"';
const form_end = '</form>';

const idx1 = content.indexOf(address_input);
const idx_end_input = content.indexOf('>', idx1) + 1;
const idx2 = content.indexOf(form_end, idx_end_input);

const insert_content = `
                                    </div>
                                </div>
                                
                                <div class="space-y-2">
                                    <div class="flex justify-between items-end">
                                        <label class="block text-sm font-bold text-gray-700">دیاریکردنی شوێن لەسەر نەخشە <span class="text-red-500">*</span></label>
                                        <span class="text-xs text-gray-500 font-medium"><i class="fas fa-info-circle"></i> مارکەرەکە ڕابکێشە</span>
                                    </div>
                                    <div class="p-1.5 bg-gray-100 rounded-2xl shadow-inner border border-gray-200"><div id="map" class="rounded-xl overflow-hidden shadow-sm" style="height: 350px; width: 100%; border:none;"></div></div>
                                    <input type="hidden" id="latInput" required><input type="hidden" id="lngInput" required>
                                </div>
                                
                                <div class="pt-4">
                                    <button type="submit" id="submitBtn" class="w-full py-5 rounded-xl font-black text-white bg-gradient-to-l from-wood-600 to-wood-800 hover:from-wood-700 hover:to-wood-900 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 flex justify-center items-center gap-3 text-xl pulse-btn">
                                        <i class="fab fa-telegram-plane text-2xl"></i> ناردنی داواکاری بۆ کۆمپانیا
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;

let new_content = content.substring(0, idx_end_input) + insert_content + content.substring(idx2);

const contact_old = `            <!-- Contact & FAQ Section -->
            <section id="contact" class="py-24 bg-gray-50 relative overflow-hidden">
                <div class="absolute -top-40 -right-40 w-96 h-96 bg-wood-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-gold-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
                
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div class="text-center mb-16">
                        <div class="inline-block px-4 py-1.5 rounded-full bg-wood-100 text-wood-700 font-bold text-sm mb-6">پەیوەندی و پرسیارەکان</div>
                        <h2 class="text-4xl font-black text-gray-900 mb-4">پەیوەندیمان پێوە بکە</h2>
                        <p class="text-lg text-gray-600 font-medium max-w-2xl mx-auto">تیمە شارەزاکەمان ئامادەیە بۆ وەڵامدانەوەی پرسیارەکانت و هاوکاریکردنت لە هەڵبژاردنی باشترین جۆری پارکێت بۆ ماڵەکەت.</p>
                    </div>`;

const contact_new = `            <!-- Contact & FAQ Section -->
            <section id="contact" class="py-24 bg-wood-950 relative overflow-hidden text-white border-t border-wood-800">
                <div class="absolute inset-0 opacity-5" style="background-image: url('https://www.transparenttextures.com/patterns/wood-pattern.png');"></div>
                <div class="absolute -top-40 -right-40 w-96 h-96 bg-gold-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob"></div>
                <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-wood-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
                
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div class="text-center mb-16">
                        <div class="inline-block px-4 py-1.5 rounded-full bg-wood-800 text-gold-400 font-bold text-sm mb-6 border border-wood-700 shadow-sm">پەیوەندی و پرسیارەکان</div>
                        <h2 class="text-4xl font-black text-white mb-4 drop-shadow-md">پەیوەندیمان پێوە بکە</h2>
                        <p class="text-lg text-gray-300 font-medium max-w-2xl mx-auto drop-shadow-sm">تیمە شارەزاکەمان ئامادەیە بۆ وەڵامدانەوەی پرسیارەکانت و هاوکاریکردنت لە هەڵبژاردنی باشترین جۆری پارکێت بۆ ماڵەکەت.</p>
                    </div>`;

new_content = new_content.replace(contact_old, contact_new);

fs.writeFileSync('index.html', new_content, 'utf8');
console.log('Fixed successfully');
