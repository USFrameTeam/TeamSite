function renderFooter() {
    var footer = '<footer class="w-full z-20 px-4 md:px-6 py-8 mt-12 text-[11px] md:text-xs tracking-wider text-neutral-500 border-t border-white/[0.03]">' +
        '<div class="flex flex-col md:flex-row justify-between items-start gap-6">' +
            '<div class="flex flex-col gap-1">' +
                '<div>2023-2026 © USFrameTeam. 保留所有权利。</div>' +
                '<a href="eula.html" target="_blank" rel="noopener" class="hover:text-white transition-colors underline decoration-neutral-600 hover:decoration-white">用户协议</a>' +
            '</div>' +
            '<div class="flex flex-col items-start md:items-end gap-1">' +
                '<span class="opacity-60">Minecraft 是 Mojang Studios 的商标。</span>' +
                '<div>' +
                    '<span>友情链接：</span>' +
                    '<a href="https://zuyst.top/" target="_blank" rel="noopener" class="hover:text-white transition-colors underline decoration-neutral-600 hover:decoration-white">ZUY Studio</a>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</footer>';
    document.body.insertAdjacentHTML('beforeend', footer);
}
