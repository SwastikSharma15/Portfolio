// Mobile Navigation Functions
    function toggleMobileNav() {
        const mobileNav = document.getElementById('mobileNav');
        const hamburger = document.querySelector('.mobile-hamburger');
        
        mobileNav.classList.toggle('active');
        hamburger.classList.toggle('active');
    }

    function closeMobileNav() {
        const mobileNav = document.getElementById('mobileNav');
        const hamburger = document.querySelector('.mobile-hamburger');
        
        mobileNav.classList.remove('active');
        hamburger.classList.remove('active');
    }

    // Close mobile nav when clicking outside
    document.addEventListener('click', function(event) {
        const mobileNav = document.getElementById('mobileNav');
        const hamburger = document.querySelector('.mobile-hamburger');
        const mobileNavList = document.querySelector('.mobile-nav-list');
        
        // Close if menu is active and click is outside the nav list and hamburger
        if (mobileNav.classList.contains('active') && 
            !mobileNavList.contains(event.target) && 
            !hamburger.contains(event.target)) {
            closeMobileNav();
        }
    });

    // Close mobile nav on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeMobileNav();
        }
    });