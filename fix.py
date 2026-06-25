import io
with io.open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

address_input = '<input type="text" id="addressInput" required placeholder="‘«—° ê???ò° ò??«‰..." class="w-full pr-12 pl-5 py-4 rounded-xl border-2 border-gray-100 shadow-sm hover:border-wood-300 transition-colors focus:border-wood-500 bg-gray-50/50 font-medium transition-colors outline-none">'

form_end = '</form>'

# Find the exact address input line
idx1 = content.find('<input type="text" id="addressInput"')
idx_end_input = content.find('>', idx1) + 1

# Find the form end after it
idx2 = content.find('</form>', idx_end_input)

# The content to insert between them:
insert_content = '''
                                    </div>
                                </div>
                                
                                <div class="space-y-2">
                                    <div class="flex justify-between items-end">
                                        <label class="block text-sm font-bold text-gray-700">œÌ«—Ìò—œ‰Ì ‘Ê?‰ ·?”?— ‰?Œ‘? <span class="text-red-500">*</span></label>
                                        <span class="text-xs text-gray-500 font-medium"><i class="fas fa-info-circle"></i> „«—ò?—?ò? ?«»ò?‘?</span>
                                    </div>
                                    <div class="p-1.5 bg-gray-100 rounded-2xl shadow-inner border border-gray-200"><div id="map" class="rounded-xl overflow-hidden shadow-sm" style="height: 350px; width: 100%; border:none;"></div></div>
                                    <input type="hidden" id="latInput" required><input type="hidden" id="lngInput" required>
                                </div>
                                
                                <div class="pt-4">
                                    <button type="submit" id="submitBtn" class="w-full py-5 rounded-xl font-black text-white bg-gradient-to-l from-wood-600 to-wood-800 hover:from-wood-700 hover:to-wood-900 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 flex justify-center items-center gap-3 text-xl pulse-btn">
                                        <i class="fab fa-telegram-plane text-2xl"></i> ‰«—œ‰Ì œ«Ê«ò«—Ì »? ò?„Å«‰Ì«
                                    </button>
                                </div>
                            </div>
                        </div>
                    '''

# Now let's fix contact section too
contact_old = '''            <!-- Contact & FAQ Section -->
            <section id="contact" class="py-24 bg-gray-50 relative overflow-hidden">
                <div class="absolute -top-40 -right-40 w-96 h-96 bg-wood-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-gold-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
                
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div class="text-center mb-16">
                        <div class="inline-block px-4 py-1.5 rounded-full bg-wood-100 text-wood-700 font-bold text-sm mb-6">Å?ÌÊ?‰œÌ Ê Å—”Ì«—?ò«‰</div>
                        <h2 class="text-4xl font-black text-gray-900 mb-4">Å?ÌÊ?‰œÌ„«‰ Å?Ê? »ò?</h2>
                        <p class="text-lg text-gray-600 font-medium max-w-2xl mx-auto"> Ì„? ‘«—?“«ò?„«‰ ∆«„«œ?Ì? »? Ê??«„œ«‰?Ê?Ì Å—”Ì«—?ò«‰  Ê Â«Êò«—Ìò—œ‰  ·? Â??»é«—œ‰Ì »«‘ —Ì‰ Ã?—Ì Å«—ò?  »? „«??ò? .</p>
                    </div>'''

contact_new = '''            <!-- Contact & FAQ Section -->
            <section id="contact" class="py-24 bg-wood-950 relative overflow-hidden text-white border-t border-wood-800">
                <div class="absolute inset-0 opacity-5" style="background-image: url('https://www.transparenttextures.com/patterns/wood-pattern.png');"></div>
                <div class="absolute -top-40 -right-40 w-96 h-96 bg-gold-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob"></div>
                <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-wood-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
                
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div class="text-center mb-16">
                        <div class="inline-block px-4 py-1.5 rounded-full bg-wood-800 text-gold-400 font-bold text-sm mb-6 border border-wood-700 shadow-sm">Å?ÌÊ?‰œÌ Ê Å—”Ì«—?ò«‰</div>
                        <h2 class="text-4xl font-black text-white mb-4 drop-shadow-md">Å?ÌÊ?‰œÌ„«‰ Å?Ê? »ò?</h2>
                        <p class="text-lg text-gray-300 font-medium max-w-2xl mx-auto drop-shadow-sm"> Ì„? ‘«—?“«ò?„«‰ ∆«„«œ?Ì? »? Ê??«„œ«‰?Ê?Ì Å—”Ì«—?ò«‰  Ê Â«Êò«—Ìò—œ‰  ·? Â??»é«—œ‰Ì »«‘ —Ì‰ Ã?—Ì Å«—ò?  »? „«??ò? .</p>
                    </div>'''

new_content = content[:idx_end_input] + insert_content + content[idx2:]
new_content = new_content.replace(contact_old, contact_new)

with io.open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)
