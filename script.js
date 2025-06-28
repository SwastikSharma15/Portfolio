function toggleButton(btn) {
  btn.classList.toggle('night');
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');
}

// Add this to your existing JavaScript files or create a new script
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