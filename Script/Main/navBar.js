// Glassmorphism Navigation Bar Functionality
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.navbar-glass .nav-link-glass');
    const animation = document.querySelector('.navbar-glass .nav-animation');
    const navbar = document.querySelector('.navbar-glass');
    const mainNav = document.querySelector('.nav-2');
    
    console.log('Nav elements found:', {
        navLinks: navLinks.length,
        animation: !!animation,
        navbar: !!navbar,
        mainNav: !!mainNav
    });
    
    if (!navLinks.length || !animation || !navbar) return;
    
    let currentSection = 'home';
    let lastScrollTop = 0;
    
    // Initialize navigation
    function initializeNavigation() {
        // Set initial active state to home
        animation.classList.add('start-home');
        
        // Add click handlers to navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavClick);
            link.addEventListener('mouseenter', handleMouseEnter);
        });
        
        // Add mouse leave handler to navbar
        navbar.addEventListener('mouseleave', handleMouseLeave);
        
        // Set up scroll detection for active section highlighting
        window.addEventListener('scroll', throttle(handleScroll, 100));
        
        // Initial check for active section
        updateActiveSection();
    }
    
    // Handle scroll to show/hide navbar
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scroll Down
            mainNav.classList.add('navbar-hidden');
        } else {
            // Scroll Up
            mainNav.classList.remove('navbar-hidden');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        
        updateActiveSection();
    }
    
    // Handle navigation link clicks
    function handleNavClick(e) {
        e.preventDefault();
        
        const section = this.getAttribute('data-section');
        if (!section) return;
        
        currentSection = section;
        
        // Update animation position
        updateAnimationPosition(section);
        
        // Smooth scroll to section
        const targetElement = document.getElementById(section);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    // Handle mouse enter on navigation links
    function handleMouseEnter() {
        const section = this.getAttribute('data-section');
        if (section) {
            updateAnimationPosition(section);
        }
    }
    
    // Handle mouse leave from navbar
    function handleMouseLeave() {
        updateAnimationPosition(currentSection);
    }
    
    // Update animation position
    function updateAnimationPosition(section) {
        // Remove all start classes
        animation.classList.remove('start-home', 'start-experience', 'start-projects', 'start-contact');
        
        // Add the new start class
        animation.classList.add(`start-${section}`);
    }
    
    // Update active section based on scroll position
    function updateActiveSection() {
        const sections = ['home', 'experience', 'projects', 'contact'];
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        let activeSection = 'home';
        let minDistance = Infinity;
        
        sections.forEach(sectionId => {
            const element = document.getElementById(sectionId);
            if (element) {
                const rect = element.getBoundingClientRect();
                const elementTop = window.scrollY + rect.top;
                const elementCenter = elementTop + element.offsetHeight / 2;
                const distance = Math.abs(scrollPosition - elementCenter);
                
                if (distance < minDistance) {
                    minDistance = distance;
                    activeSection = sectionId;
                }
            }
        });
        
        // Only update if section changed
        if (activeSection !== currentSection) {
            currentSection = activeSection;
            updateAnimationPosition(currentSection);
        }
    }
    
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
    
    // Initialize the navigation
    initializeNavigation();
    
    // Handle window resize to update responsive behavior
    window.addEventListener('resize', throttle(function() {
        updateAnimationPosition(currentSection);
    }, 250));
});
