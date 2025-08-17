// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 平滑滚动效果 - 仅对内部锚点链接生效
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const targetUrl = this.getAttribute('href');
            // 只对内部锚点链接应用平滑滚动
            if (targetUrl.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetUrl);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
            // 外部链接保持默认跳转行为
        });
    });

    // 内容区域加载动画
    const fadeElements = document.querySelectorAll('.plugin-intro, .links-section');
    fadeElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100 + (index * 200));
    });

    // 深色模式切换功能 - 确保按钮创建
    // 首先检查是否已存在切换按钮，如果不存在则创建
    let themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) {
        themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '🌓';
        themeToggle.setAttribute('aria-label', '切换深色模式');
        document.body.appendChild(themeToggle);
    }

    // 检查保存的主题偏好，默认为浅色模式
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // 更新按钮图标
    if (savedTheme === 'dark') {
        themeToggle.innerHTML = '☀️';
    } else {
        themeToggle.innerHTML = '🌙';
    }

    // 切换主题
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // 更新按钮图标
        if (newTheme === 'dark') {
            themeToggle.innerHTML = '☀️';
        } else {
            themeToggle.innerHTML = '🌙';
        }
    });

    // 移动菜单切换功能
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
            // 切换按钮图标
            this.textContent = mobileMenu.style.display === 'block' ? '✕' : '☰';
        });
    
        // 移动版主题切换按钮
        const mobileThemeToggle = document.querySelector('.mobile-theme-toggle');
        if (mobileThemeToggle) {
            mobileThemeToggle.addEventListener('click', function() {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                updateThemeToggleIcons(newTheme);
            });
        }
    
        // 更新所有主题切换按钮图标
        function updateThemeToggleIcons(theme) {
            const themeToggle = document.querySelector('.theme-toggle');
            const mobileThemeToggle = document.querySelector('.mobile-theme-toggle');
            
            if (themeToggle) {
                themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
            }
            if (mobileThemeToggle) {
                mobileThemeToggle.innerHTML = theme === 'dark' ? '☀️ 切换浅色模式' : '🌙 切换深色模式';
            }
        }
    
        // 初始化主题图标
        updateThemeToggleIcons(savedTheme);
    }
});