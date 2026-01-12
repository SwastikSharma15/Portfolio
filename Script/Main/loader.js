/**
 * Page Loader Script
 * Handles the loading animation and transition to main content
 */

// Loader configuration
const LOADER_CONFIG = {
  minLoadingTime: 2500, // Minimum time to show loader (in milliseconds)
  maxLoadingTime: 5000, // Maximum time to show loader if resources are still loading
  fadeOutDuration: 500  // Duration of fade-out animation
};

class PageLoader {
  constructor() {
    this.loadStartTime = Date.now();
    this.isLoaderReady = false;
    this.areResourcesLoaded = false;
    this.init();
  }

  init() {
    // Ensure loader is visible initially
    this.showLoader();
    
    // Check if DOM is already loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.onDOMLoaded();
      });
    } else {
      this.onDOMLoaded();
    }

    // Listen for window load event (all resources loaded)
    window.addEventListener('load', () => {
      this.onResourcesLoaded();
    });

    // Fallback: Hide loader after maximum time
    setTimeout(() => {
      if (!this.isLoaderReady) {
        console.warn('Loader timeout reached, hiding loader');
        this.hideLoader();
      }
    }, LOADER_CONFIG.maxLoadingTime);
  }

  showLoader() {
    const loader = document.querySelector('.page-loader');
    if (loader) {
      loader.style.display = 'flex';
      loader.classList.remove('fade-out');
    }
    
    // Hide main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.classList.remove('loaded');
    }
    
    // Prevent scrolling
    document.body.classList.add('loading', 'page-loader-active');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  onDOMLoaded() {
    console.log('DOM loaded');
    this.checkIfReadyToHide();
  }

  onResourcesLoaded() {
    console.log('All resources loaded');
    this.areResourcesLoaded = true;
    this.checkIfReadyToHide();
  }

  checkIfReadyToHide() {
    const elapsedTime = Date.now() - this.loadStartTime;
    const minTimeReached = elapsedTime >= LOADER_CONFIG.minLoadingTime;
    
    // Hide loader when both conditions are met:
    // 1. Minimum loading time has passed
    // 2. Resources are loaded (or DOM is ready for faster hiding)
    if (minTimeReached && (this.areResourcesLoaded || document.readyState === 'complete')) {
      this.hideLoader();
    } else if (minTimeReached) {
      // If minimum time reached but resources not loaded, wait a bit more
      setTimeout(() => this.checkIfReadyToHide(), 100);
    } else {
      // Wait for minimum time to be reached
      setTimeout(() => this.checkIfReadyToHide(), LOADER_CONFIG.minLoadingTime - elapsedTime);
    }
  }

  hideLoader() {
    if (this.isLoaderReady) return; // Prevent multiple calls
    
    this.isLoaderReady = true;
    
    const loader = document.querySelector('.page-loader');
    const mainContent = document.querySelector('.main-content');
    
    if (loader) {
      // Add fade-out class to trigger CSS transition
      loader.classList.add('fade-out');
      
      // Remove loader from DOM after transition completes
      setTimeout(() => {
        loader.style.display = 'none';
      }, LOADER_CONFIG.fadeOutDuration);
    }
    
    if (mainContent) {
      // Show main content with a slight delay for smoother transition
      setTimeout(() => {
        mainContent.classList.add('loaded');
      }, LOADER_CONFIG.fadeOutDuration / 2);
    }
    
    // Enable scrolling - ensure this works on mobile
    document.body.classList.remove('loading', 'page-loader-active');
    document.body.style.overflow = '';
    document.body.style.overflowY = 'auto';
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflow = '';
    document.documentElement.style.overflowY = 'auto';
    document.documentElement.style.overflowX = 'hidden';
    
    // Force layout recalculation to ensure scrolling is enabled
    document.body.offsetHeight;
    
    console.log('Loader hidden successfully');
  }

  // Public method to manually hide loader (if needed)
  static forceHide() {
    const instance = window.pageLoaderInstance;
    if (instance && !instance.isLoaderReady) {
      instance.hideLoader();
    }
  }
}

// Initialize loader when script loads
document.addEventListener('DOMContentLoaded', () => {
  // Disable scrolling initially
  document.body.style.overflow = 'hidden';
  
  // Create and store loader instance globally for potential manual control
  window.pageLoaderInstance = new PageLoader();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PageLoader;
}
