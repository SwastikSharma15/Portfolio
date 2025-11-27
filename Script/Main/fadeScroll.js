// Fade In on Scroll Animation Script

// Configuration options
const ANIMATION_CONFIG = {
  threshold: 0.1, // How much of the element needs to be visible
  rootMargin: '0px 0px -50px 0px', // Trigger animation slightly before element is fully visible
  once: true // Only animate once
};

// Create intersection observer
const createObserver = () => {
  return new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add the visible class to trigger animation
        entry.target.classList.add('is-visible');
        
        // If configured to animate only once, stop observing this element
        if (ANIMATION_CONFIG.once) {
          observer.unobserve(entry.target);
        }
      } else if (!ANIMATION_CONFIG.once) {
        // Remove visible class if not configured to animate only once
        entry.target.classList.remove('is-visible');
      }
    });
  }, {
    threshold: ANIMATION_CONFIG.threshold,
    rootMargin: ANIMATION_CONFIG.rootMargin
  });
};

// Initialize observer
let observer;

// Function to observe elements
const observeElements = () => {
  // Get all elements that should be animated, excluding home section
  const elementsToAnimate = document.querySelectorAll(`
    .fade-in-section:not(#home .fade-in-section),
    .fade-slide-left,
    .fade-slide-right,
    .fade-scale-up,
    .fade-rotate,
    .project-card,
    .video-card,
    .timeline-item,
    .tech-flexbox img,
    .form-group,
    .submit-btn,
    .tech-stack-section,
    .projects-container,
    .videos-container,
    .fun-area-container,
    .blogs-container
  `);

  // Start observing each element
  elementsToAnimate.forEach(element => {
    observer.observe(element);
  });

  /* console.log(`Observing ${elementsToAnimate.length} elements for scroll animations`); */
};

// Function to handle tech stack icons separately for staggered effect
const observeTechIcons = () => {
  const techIcons = document.querySelectorAll('.tech-flexbox img');
  
  const techObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add a slight delay to create staggered effect
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, 50); // Small delay for stagger effect
        
        if (ANIMATION_CONFIG.once) {
          techObserver.unobserve(entry.target);
        }
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -30px 0px'
  });

  techIcons.forEach(icon => {
    techObserver.observe(icon);
  });
};

// Function to handle project cards with staggered timing
const observeProjectCards = () => {
  const projectCards = document.querySelectorAll('.project-card');
  
  const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add staggered delay based on index
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, index * 100); // 100ms delay between each card
        
        if (ANIMATION_CONFIG.once) {
          projectObserver.unobserve(entry.target);
        }
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -20px 0px'
  });

  projectCards.forEach(card => {
    projectObserver.observe(card);
  });
};

// Function to handle blog cards with staggered timing
const observeBlogCards = () => {
  const blogCards = document.querySelectorAll('.blog-card');
  
  const blogObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add staggered delay based on index
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, index * 100); // 100ms delay between each card
        
        if (ANIMATION_CONFIG.once) {
          blogObserver.unobserve(entry.target);
        }
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -20px 0px'
  });

  blogCards.forEach(card => {
    blogObserver.observe(card);
  });
};

// Function to handle timeline items
const observeTimelineItems = () => {
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, index * 150); // 150ms delay between each timeline item
        
        if (ANIMATION_CONFIG.once) {
          timelineObserver.unobserve(entry.target);
        }
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -30px 0px'
  });

  timelineItems.forEach(item => {
    timelineObserver.observe(item);
  });
};

// Function to handle form elements
const observeFormElements = () => {
  const formGroups = document.querySelectorAll('.form-group');
  const submitBtn = document.querySelector('.submit-btn');
  
  const formObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, index * 100); // 100ms delay between each form element
        
        if (ANIMATION_CONFIG.once) {
          formObserver.unobserve(entry.target);
        }
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '0px 0px -20px 0px'
  });

  formGroups.forEach(group => {
    formObserver.observe(group);
  });

  if (submitBtn) {
    formObserver.observe(submitBtn);
  }
};

// Function to add initial animation classes to elements
const addAnimationClasses = () => {
  // Add fade-in-section class to main containers that don't have it
  const experienceContainer = document.querySelector('#experience .container');
  const contactContainer = document.querySelector('#contact .contact-container');
  
  if (experienceContainer && !experienceContainer.classList.contains('fade-in-section')) {
    experienceContainer.classList.add('fade-in-section');
  }
  
  if (contactContainer && !contactContainer.classList.contains('fade-in-section')) {
    contactContainer.classList.add('fade-in-section');
  }
};

// Function to handle scroll to top on page load
const handleInitialLoad = () => {
  // Prevent the scroll jump by ensuring we start at top
  if (window.location.hash === '' || window.location.hash === '#home') {
    window.scrollTo(0, 0);
    history.replaceState(null, null, ' ');
  }
};

// Main initialization function
const initScrollAnimations = () => {
  // Check if browser supports Intersection Observer
  if (!('IntersectionObserver' in window)) {
    console.log('IntersectionObserver not supported, animations disabled');
    // Fallback: add is-visible class to all elements immediately
    document.querySelectorAll(`
      .fade-in-section,
      .fade-slide-left,
      .fade-slide-right,
      .fade-scale-up,
      .fade-rotate,
      .project-card,
      .video-card,
      .timeline-item,
      .tech-flexbox img,
      .form-group,
      .submit-btn,
      .tech-stack-section,
      .projects-container,
      .videos-container,
      .fun-area-container,
      .blogs-container,
      .blog-card
    `).forEach(el => {
      el.classList.add('is-visible');
    });
    return;
  }

  // Add animation classes to elements
  addAnimationClasses();

  // Create and start observers
  observer = createObserver();
  observeElements();
  observeTechIcons();
  observeProjectCards();
  observeBlogCards();
  observeTimelineItems();
  observeFormElements();

  /* console.log('Scroll animations initialized successfully'); */
};

// Handle page visibility change (when user switches tabs)
const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') {
    // Re-trigger animations for any elements that might have been missed
    setTimeout(() => {
      initScrollAnimations();
    }, 100);
  }
};

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Prevent auto-scroll on page load
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  
  handleInitialLoad();
  initScrollAnimations();
});

// Additional page load handler
window.addEventListener('load', () => {
  // Ensure we're at the top after everything loads
  if (window.location.hash === '' || window.location.hash === '#home') {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
  }
});

document.addEventListener('visibilitychange', handleVisibilityChange);

// Handle page refresh/reload
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

// Utility function to manually trigger animation on an element
window.triggerAnimation = (element) => {
  if (element) {
    element.classList.add('is-visible');
  }
};

// Utility function to reset animation on an element
window.resetAnimation = (element) => {
  if (element) {
    element.classList.remove('is-visible');
  }
};

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initScrollAnimations,
    triggerAnimation: window.triggerAnimation,
    resetAnimation: window.resetAnimation
  };
}
