// Contact Section Navigation Fix
document.addEventListener('DOMContentLoaded', function() {
    // Find all contact navigation links
    const contactLinks = document.querySelectorAll('a[href="#contact"], a[data-section="contact"]');
    
    /* console.log('Contact links found:', contactLinks.length); */
    
    // Add click handlers to all contact links
    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default on desktop, allow default behavior on mobile
            if (window.innerWidth > 768) {
                e.preventDefault();
            }
            
            /* console.log('Contact link clicked'); */
            
            // Find the contact section
            const contactSection = document.getElementById('contact');
            
            if (contactSection) {
                /* console.log('Contact section found, scrolling...'); */
                
                // Scroll to contact section
                contactSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Alternative method if smooth scroll doesn't work
                setTimeout(() => {
                    window.scrollTo({
                        top: contactSection.offsetTop - 100, // 100px offset for navbar
                        behavior: 'smooth'
                    });
                }, 100);
                
            } else {
                console.error('Contact section not found!');
                // Try to find it with different selectors
                const altContact = document.querySelector('.contact-section');
                if (altContact) {
                    console.log('Found contact section with class selector');
                    altContact.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Check if contact section exists and log its properties
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        /* console.log('Contact section exists');
        console.log('Contact section visibility:', window.getComputedStyle(contactSection).visibility);
        console.log('Contact section display:', window.getComputedStyle(contactSection).display);
        console.log('Contact section height:', contactSection.offsetHeight); */
    } else {
        console.error('Contact section not found in DOM');
    }
    
    // Check for contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        /* console.log('Contact form found and ready'); */
    } else {
        console.error('Contact form not found');
    }
});

// Add manual scroll to contact function for testing
window.scrollToContact = function() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        console.log('Manual scroll to contact triggered');
    } else {
        console.error('Cannot scroll to contact - section not found');
    }
};
