// Scroll to top only if no hash is in the URL (to not break #section scrolling)
if (!window.location.hash) {
    window.addEventListener('load', () => {
        window.scrollTo(0, 0);
    });

    window.addEventListener('beforeunload', () => {
        window.scrollTo(0, 0);
    });

    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            window.scrollTo(0, 0);
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.scrollTo(0, 0);
        });
    } else {
        window.scrollTo(0, 0);
    }
}

// Load saved theme on page load
window.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        document.body.classList.remove('light');
        // Find the theme button and add night class
        const themeBtn = document.querySelector('[onclick*="toggleButton"]');
        if (themeBtn) {
            themeBtn.classList.add('night');
        }
    }
});

function toggleButton(btn) {
    btn.classList.toggle('night');
    document.body.classList.toggle('dark');
    document.body.classList.toggle('light');
    
    // Save theme preference
    if (document.body.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

function checkSection() {
    const homeSection = document.getElementById('home');
    if (!homeSection) return; // Skip if not on home page

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

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
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
}


// Audio Nier

const checkbox = document.querySelector('.play-btn');
const audio = document.getElementById('siteAudio');
const slider = document.querySelector('.seek-slider');

let hideSliderTimeout = null;
slider.dragging = false;

// 🔁 Make sure slider always syncs correctly
function updateSliderMax() {
  if (audio.duration && !isNaN(audio.duration)) {
    slider.max = Math.floor(audio.duration);
    slider.step = 0.1;
  } else {
    setTimeout(updateSliderMax, 500); // Retry until duration is ready
  }
}
updateSliderMax();
audio.addEventListener('loadedmetadata', updateSliderMax);

// 🎵 Resume audio state if saved
window.addEventListener('load', () => {
  const savedTime = parseFloat(localStorage.getItem('audioTime')) || 0;
  const shouldPlay = localStorage.getItem('isPlaying') === 'true';

  audio.currentTime = savedTime;
  slider.value = savedTime;

  if (shouldPlay) {
    audio.play().then(() => {
      checkbox.checked = true;
      showSliderTemporarily();
    }).catch(() => {
      // autoplay might be blocked
      checkbox.checked = false;
    });
  }
});

// 💾 Save audio state before leaving page
window.addEventListener('beforeunload', () => {
  localStorage.setItem('audioTime', audio.currentTime.toFixed(2));
  localStorage.setItem('isPlaying', !audio.paused);
});

// ▶️ Play/Pause logic
checkbox.addEventListener('change', function () {
  if (this.checked) {
    audio.play();
    showSliderTemporarily();
  } else {
    audio.pause();
    hideSlider();
  }
});

// 🔄 Sync slider with audio
audio.addEventListener('timeupdate', () => {
  if (!slider.dragging) {
    slider.value = parseFloat(audio.currentTime.toFixed(2));
  }
});

// 🖱️ Dragging
slider.addEventListener('mousedown', () => {
  slider.dragging = true;
  showSliderTemporarily();
});
slider.addEventListener('mouseup', () => {
  slider.dragging = false;
  audio.currentTime = slider.value;
  showSliderTemporarily();
});
slider.addEventListener('input', () => {
  if (slider.dragging) {
    audio.currentTime = slider.value;
    showSliderTemporarily();
  }
});

// 👆 Reset timer on interaction
slider.addEventListener('mouseenter', showSliderTemporarily);
slider.addEventListener('mousemove', showSliderTemporarily);

// 👻 Visibility logic
function showSliderTemporarily() {
  slider.classList.add('visible');
  clearTimeout(hideSliderTimeout);
  hideSliderTimeout = setTimeout(() => {
    slider.classList.remove('visible');
  }, 5000);
}
function hideSlider() {
  slider.classList.remove('visible');
  clearTimeout(hideSliderTimeout);
}