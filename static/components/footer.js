function renderFooter() {
    var footer = '<footer class="w-full z-20 flex flex-col md:flex-row justify-between items-start md:items-center px-4 md:px-6 py-8 mt-12 text-[11px] md:text-xs tracking-wider text-neutral-500 gap-4 border-t border-white/[0.03]">' +
        '<div class="text-center md:text-left w-full md:w-auto">2023-2026 © USFrameTeam. 保留所有权利。</div>' +
        '<div class="text-center md:text-right w-full md:w-auto flex flex-col items-center md:items-end gap-1">' +
            '<span class="opacity-60">Minecraft 是 Mojang Studios 的商标。</span>' +
            '<a href="eula.html" target="_blank" rel="noopener" class="hover:text-white transition-colors underline decoration-neutral-600 hover:decoration-white">用户协议 - USFrameTeam 官方网站</a>' +
        '</div>' +
    '</footer>';
    document.body.insertAdjacentHTML('beforeend', footer);
}
