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
});