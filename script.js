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


// Web3Forms Contact me


const accessKey1 = '18536a8d-1f17-4f02-97b1-e5cf2b45e4fb'; // sharmaspeedx29@gmail.com
const accessKey2 = '3632924f-f67c-4571-883a-ae15e8c4ed16'; // swastik15.sharma.work@gmail.com
       
document.getElementById('contactForm').addEventListener('submit', async function(e) {
   e.preventDefault();
   
   const form = this;
   const submitBtn = document.getElementById('submitBtn');
   const formMessage = document.getElementById('formMessage');
   
   // Disable submit button and show loading state
   submitBtn.disabled = true;
   submitBtn.textContent = 'Sending...';
   formMessage.classList.remove('show');
   
   try {
       // Create form data for first email
       const formData1 = new FormData(form);
       formData1.append('access_key', accessKey1);
       
       // Create form data for second email
       const formData2 = new FormData(form);
       formData2.append('access_key', accessKey2);
       
       // Send to both emails simultaneously
       const [response1, response2] = await Promise.all([
           fetch('https://api.web3forms.com/submit', {
               method: 'POST',
               body: formData1
           }),
           fetch('https://api.web3forms.com/submit', {
               method: 'POST',
               body: formData2
           })
       ]);
       
       const data1 = await response1.json();
       const data2 = await response2.json();
       
       if (data1.success && data2.success) {
           // Both emails sent successfully
           formMessage.textContent = 'Thank you! Your message has been sent successfully to both emails.';
           formMessage.className = 'form-message success show';
           form.reset(); // Clear the form
       } else if (data1.success || data2.success) {
           // Only one email sent successfully
           formMessage.textContent = 'Message sent, but there was an issue with one of the emails.';
           formMessage.className = 'form-message success show';
           form.reset();
       } else {
           throw new Error('Failed to send to both emails');
       }
   } catch (error) {
       // Error - show error message
       formMessage.textContent = 'Sorry, there was an error sending your message. Please try again.';
       formMessage.className = 'form-message error show';
       console.error('Form submission error:', error);
   } finally {
       // Re-enable submit button
       submitBtn.disabled = false;
       submitBtn.textContent = 'Send Message';
       
       // Hide message after 5 seconds
       setTimeout(() => {
           formMessage.classList.remove('show');
       }, 5000);
   }
});