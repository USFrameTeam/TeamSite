// 完全重写main.js文件，整合主题切换功能，修复产品下拉菜单问题

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

    // 统一的主题切换功能 - 合并原有的两个实现
    function initThemeToggle() {
        // 首先检查是否已存在切换按钮，如果不存在则创建
        let themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) {
            themeToggle = document.createElement('button');
            themeToggle.className = 'theme-toggle';
            themeToggle.innerHTML = '🌓';
            themeToggle.setAttribute('aria-label', '切换深色模式');
            document.body.appendChild(themeToggle);
        }

        // 检查保存的主题偏好，默认使用系统主题
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        
        // 设置初始主题
        document.documentElement.setAttribute('data-theme', initialTheme);
        
        // 更新所有主题切换按钮图标
        updateThemeToggleIcons(initialTheme);

        // 切换主题的通用函数
        function toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeToggleIcons(newTheme);
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

        // 绑定主题切换事件
        if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
        const mobileThemeToggle = document.querySelector('.mobile-theme-toggle');
        if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);
    }

    // 初始化主题切换功能
    initThemeToggle();

    // 产品下拉菜单功能 - 完全重写为更简单可靠的实现
    // 产品下拉菜单功能
    // 全新的简化下拉菜单功能
    function initSimpleDropdown() {
        console.log('开始初始化简化版下拉菜单');
        
        const dropdownBtn = document.getElementById('simple-dropdown-btn');
        const dropdownContent = document.getElementById('simple-dropdown-content');
        const dropdown = document.querySelector('.simple-dropdown');
        
        // 检查元素是否存在
        if (!dropdownBtn || !dropdownContent || !dropdown) {
            console.log('下拉菜单元素未找到');
            return;
        }
        
        console.log('下拉菜单元素已找到，准备绑定事件');
        
        // 点击按钮切换显示状态
        dropdownBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('按钮被点击，切换下拉菜单显示状态');
            dropdownContent.classList.toggle('show');
            
            // 强制重绘
            void dropdownContent.offsetWidth;
        });
        
        // 点击页面其他地方关闭下拉菜单
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                dropdownContent.classList.remove('show');
            }
        });
        
        // ESC键关闭下拉菜单
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                dropdownContent.classList.remove('show');
            }
        });
        
        console.log('简化版下拉菜单初始化完成');
    }
    
    // 确保页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSimpleDropdown);
    } else {
        initSimpleDropdown();
    }

    // 移动菜单切换功能
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuToggle && mobileMenuClose && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    
        mobileMenuClose.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    
        // 点击移动菜单外部关闭菜单
        document.addEventListener('click', function(event) {
            if (mobileMenu && mobileMenu.classList.contains('active') && 
                !mobileMenu.contains(event.target) && 
                !mobileMenuToggle.contains(event.target)) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // 添加滚动动画效果
    const sections = document.querySelectorAll('.section-transition');
    
    function checkVisibility() {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const isVisible = (rect.top <= window.innerHeight * 0.75 && rect.bottom >= 0);
            
            if (isVisible) {
                section.classList.add('visible');
            }
        });
    }
    
    // 初始检查
    checkVisibility();
    
    // 滚动时检查
    window.addEventListener('scroll', checkVisibility);
});