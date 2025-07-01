// Force scroll to absolute top (0,0) on page load - Multiple approaches for reliability
window.addEventListener('load', function() {
    // Method 1: Immediate scroll to top
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
     });

// Also handle page refresh and browser back/forward
window.addEventListener('beforeunload', function() {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
});

// Handle browser back/forward navigation
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        // Page was loaded from cache
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }
});

// Immediate execution when script loads (before DOM is ready)
window.scrollTo(0, 0);
document.documentElement.scrollTop = 0;
document.body.scrollTop = 0;

// DOM ready state check and immediate scroll
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    });
} else {
    // DOM is already loaded
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
}

function toggleButton(btn) {
  btn.classList.toggle('night');
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');
}

function checkSection() {
  const homeSection = document.getElementById('home');
  const rect = homeSection.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  
  // Check if home section is visible in viewport
  const isInHome = rect.top < windowHeight && rect.bottom > 0;
  
  if (isInHome) {
    document.body.classList.add('in-home');
  } else {
    document.body.classList.remove('in-home');
  }
}

// Check on scroll and page load
window.addEventListener('scroll', checkSection);
window.addEventListener('load', checkSection);
checkSection(); // Initial check