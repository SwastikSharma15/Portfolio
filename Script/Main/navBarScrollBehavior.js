// Navbar Hide/Show on Scroll Functionality
document.addEventListener('DOMContentLoaded', function() {
    const mainNav = document.querySelector('.nav-2');
    
    if (!mainNav) {
        return;
    }
    
    let lastScrollTop = 0;
    let isScrolling = false;
    let scrollTimer = null;
    
    // Configuration
    const config = {
        scrollThreshold: 10,      // Minimum scroll distance to trigger
        hideAfterScroll: 100,     // Hide navbar after scrolling this many pixels
        showDelay: 100,           // Delay before showing navbar on scroll up
        animationDuration: 300    // CSS transition duration in ms
    };
    
    // Throttle function to limit scroll event frequency
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    // Hide navbar
    function hideNavbar() {
        if (!mainNav.classList.contains('navbar-hidden')) {
            mainNav.classList.add('navbar-hidden');
        }
    }
    
    // Show navbar
    function showNavbar() {
        if (mainNav.classList.contains('navbar-hidden')) {
            mainNav.classList.remove('navbar-hidden');
        }
    }
    
    // Main scroll handler
    function handleNavbarScroll() {
        // Try multiple ways to get scroll position
        const currentScroll = window.pageYOffset || 
                            document.documentElement.scrollTop || 
                            document.body.scrollTop || 
                            0;
        
        // Prevent negative scrolling (bounce effect on mobile)
        const scrollTop = currentScroll <= 0 ? 0 : currentScroll;
        
        // Calculate scroll direction and distance
        const scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
        const scrollDistance = Math.abs(scrollTop - lastScrollTop);
        
        // Only proceed if scroll distance meets threshold
        if (scrollDistance < config.scrollThreshold) {
            lastScrollTop = scrollTop;
            return;
        }
        
        // Don't hide navbar at the very top of the page
        if (scrollTop <= 50) {
            showNavbar();
            lastScrollTop = scrollTop;
            return;
        }
        
        // Handle scroll down - hide navbar
        if (scrollDirection === 'down' && scrollTop > config.hideAfterScroll) {
            hideNavbar();
        }
        // Handle scroll up - show navbar
        else if (scrollDirection === 'up') {
            showNavbar();
        }
        
        lastScrollTop = scrollTop;
        
        // Clear existing timer
        if (scrollTimer) {
            clearTimeout(scrollTimer);
        }
        
        // Set scrolling flag
        isScrolling = true;
        
        // Reset scrolling flag after delay
        scrollTimer = setTimeout(() => {
            isScrolling = false;
        }, config.showDelay);
    }
    
    // Enhanced scroll detection (works with your existing scroll detection)
    function initializeScrollBehavior() {
// Initialize scroll detection
        window.addEventListener('scroll', throttle(handleNavbarScroll, 16));
        document.addEventListener('scroll', throttle(handleNavbarScroll, 16));
        document.body.addEventListener('scroll', throttle(handleNavbarScroll, 16));
        
        setInterval(() => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            if (Math.abs(currentScroll - lastScrollTop) > 0) {
                handleNavbarScroll();
            }
        }, 50);
        
        const scrollContainers = [
            document.querySelector('.main-content'),
            document.querySelector('.container'),
            document.querySelector('main')
        ].filter(Boolean);
        
        scrollContainers.forEach(container => {
            container.addEventListener('scroll', throttle(handleNavbarScroll, 16));
        });
        
        window.addEventListener('resize', throttle(() => {
            showNavbar();
        }, 250));
        
        document.addEventListener('mousemove', throttle((e) => {
            if (e.clientY <= 100 && isScrolling === false) {
                showNavbar();
            }
        }, 100));
    }
    
    // Add CSS for smooth transitions if not already present
    function addScrollStyles() {
        const styleId = 'navbar-scroll-styles';
        
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                .nav-2 {
                    transition: transform ${config.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1) !important;
                }
                
                .nav-2.navbar-hidden {
                    transform: translateY(-100%) !important;
                }
                
                /* Ensure smooth transition on mobile */
                @media (max-width: 768px) {
                    .nav-2 {
                        transition: transform ${config.animationDuration}ms ease-out !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Initialize everything
    addScrollStyles();
    initializeScrollBehavior();
    
    // Expose functions for debugging
    window.navbarScrollBehavior = {
        hide: hideNavbar,
        show: showNavbar,
        config: config,
        isScrolling: () => isScrolling,
        lastScroll: () => lastScrollTop
    };
    
});
