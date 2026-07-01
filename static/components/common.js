function initCommon() {
    var dropdownBtn = document.getElementById('dropdown-btn');
    var dropdownMenu = document.getElementById('dropdown-menu');
    var dropdownArrow = document.getElementById('dropdown-arrow');

    function toggleDropdown(show) {
        if (show) {
            dropdownMenu.classList.remove('opacity-0', 'invisible', '-translate-y-2');
            dropdownMenu.classList.add('opacity-100', 'visible', 'translate-y-0');
            dropdownArrow.classList.add('rotate-180');
        } else {
            dropdownMenu.classList.add('opacity-0', 'invisible', '-translate-y-2');
            dropdownMenu.classList.remove('opacity-100', 'visible', 'translate-y-0');
            dropdownArrow.classList.remove('rotate-180');
        }
    }

    dropdownBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        var isVisible = dropdownMenu.classList.contains('visible');
        toggleDropdown(!isVisible);
    });

    document.addEventListener('click', function() {
        toggleDropdown(false);
    });

    dropdownMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    var revealElements = document.querySelectorAll('.reveal');
    var observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.12
    };

    var revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(function(el) { revealObserver.observe(el); });
}

function initLazyIframes() {
    var lazyIframes = document.querySelectorAll('.lazy-iframe');
    var iframeObserverOptions = {
        root: null,
        rootMargin: '200px',
        threshold: 0.01
    };

    var iframeObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var iframe = entry.target;
                var src = iframe.getAttribute('data-src');
                if (src) {
                    iframe.setAttribute('src', src);
                    iframe.removeAttribute('data-src');
                }
                observer.unobserve(iframe);
            }
        });
    }, iframeObserverOptions);

    lazyIframes.forEach(function(iframe) { iframeObserver.observe(iframe); });
}
