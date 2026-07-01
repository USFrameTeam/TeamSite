function renderHeader(config) {
    var actionBtn = config.actionButton || '';
    var header = '<header class="w-full z-50 flex justify-between items-center px-4 md:px-6 py-4 opacity-0 animate-fade-in">' +
        '<div class="flex items-center space-x-6 md:space-x-10">' +
            '<a href="index.html" class="flex items-center space-x-3 cursor-pointer">' +
                '<img src="static/pictures/USFLogo.webp" alt="Logo" class="w-8 h-8 object-contain">' +
                '<span class="text-lg md:text-xl font-semibold tracking-tighter text-white">USFrameTeam</span>' +
            '</a>' +
            '<div class="relative group">' +
                '<button id="dropdown-btn" class="flex items-center space-x-1 text-sm tracking-widest text-neutral-400 hover:text-white transition-colors duration-200" aria-label="更多项目">' +
                    '<span class="hidden md:inline">更多项目</span>' +
                    '<svg id="dropdown-arrow" class="w-4 h-4 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
                        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>' +
                    '</svg>' +
                '</button>' +
                '<div id="dropdown-menu" class="absolute left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 mt-2 w-48 bg-[#1a1a1c]/95 backdrop-blur-2xl border border-white/10 rounded-[1.5rem] p-2 opacity-0 invisible transform -translate-y-2 transition-all duration-300 z-50">' +
                    '<a href="usfv1.html" class="block px-4 py-3 text-xs text-neutral-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors">USFV1</a>' +
                    '<a href="usfv2.html" class="block px-4 py-3 text-xs text-neutral-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors">USFV2</a>' +
                    '<a href="https://github.com/USFrameTeam/Unknown-Server-Framework-V3-build" target="_blank" rel="noopener" class="block px-4 py-3 text-xs text-neutral-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors">NeoUSF（开发中）</a>' +
                    '<a href="https://github.com/USFrameTeam/USF-Manager" target="_blank" rel="noopener" class="block px-4 py-3 text-xs text-neutral-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors">USFM（开发中）</a>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<nav class="flex items-center space-x-3">' +
            actionBtn +
            '<a href="https://github.com/USFrameTeam/Unknown-Server-Framework" target="_blank" rel="noopener" class="inline-flex items-center border border-white/20 px-4 py-1.5 rounded-[2.5rem] text-xs hover:bg-white hover:text-black transition-all duration-300 font-medium">' +
                '<svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">' +
                    '<path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>' +
                '</svg>' +
                '<span>GitHub</span>' +
            '</a>' +
        '</nav>' +
    '</header>';
    document.body.insertAdjacentHTML('afterbegin', header);
}
