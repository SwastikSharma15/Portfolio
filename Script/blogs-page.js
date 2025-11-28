// blogs-page.js - JavaScript for the blog page

// Smooth scroll to anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Handle anchor links in URL on page load
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 100);
    }

    // Add reading progress indicator
    createReadingProgress();

    // Add fade-in animation for blog posts
    observeBlogPosts();

    // Add copy button to code blocks
    addCopyButtonsToCodeBlocks();
});

// Create reading progress bar
function createReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="reading-progress-bar"></div>';
    document.body.appendChild(progressBar);

    // Add CSS for progress bar
    const style = document.createElement('style');
    style.textContent = `
        .reading-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: rgba(0, 0, 0, 0.1);
            z-index: 1000;
        }

        .reading-progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            width: 0%;
            transition: width 0.1s ease;
        }
    `;
    document.head.appendChild(style);

    // Update progress on scroll
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;

        const progressBarElement = document.querySelector('.reading-progress-bar');
        if (progressBarElement) {
            progressBarElement.style.width = `${Math.min(progress, 100)}%`;
        }
    });
}

// Observe blog posts for fade-in animation
function observeBlogPosts() {
    const style = document.createElement('style');
    style.textContent = `
        .blog-post {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .blog-post.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    document.querySelectorAll('.blog-post').forEach(post => {
        observer.observe(post);
    });
}

// Add copy buttons to code blocks
function addCopyButtonsToCodeBlocks() {
    const style = document.createElement('style');
    style.textContent = `
        .code-block {
            position: relative;
        }

        .code-copy-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Segoe UI', sans-serif;
        }

        .code-copy-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.3);
        }

        .code-copy-btn.copied {
            background: #28a745;
            border-color: #28a745;
        }
    `;
    document.head.appendChild(style);

    document.querySelectorAll('.code-block').forEach(block => {
        const button = document.createElement('button');
        button.className = 'code-copy-btn';
        button.textContent = 'Copy';
        
        button.addEventListener('click', () => {
            const code = block.querySelector('code');
            if (code) {
                navigator.clipboard.writeText(code.textContent).then(() => {
                    button.textContent = 'Copied!';
                    button.classList.add('copied');
                    
                    setTimeout(() => {
                        button.textContent = 'Copy';
                        button.classList.remove('copied');
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy:', err);
                });
            }
        });

        block.appendChild(button);
    });
}

// Scroll to top button
(function() {
    const style = document.createElement('style');
    style.textContent = `
        .scroll-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 48px;
            height: 48px;
            background: transparent;
            color: #333;
            border: 2px solid #ddd;
            border-radius: 50%;
            font-size: 1.2rem;
            font-weight: 600;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        body.dark .scroll-to-top {
            color: #fff;
            border-color: #444;
        }

        .scroll-to-top.visible {
            opacity: 1;
            visibility: visible;
        }

        .scroll-to-top:hover {
            border-color: #0070f3;
            color: #0070f3;
            transform: translateY(-3px);
        }

        body.dark .scroll-to-top:hover {
            border-color: #0070f3;
            color: #0070f3;
        }

        @media (max-width: 768px) {
            .scroll-to-top {
                bottom: 20px;
                right: 20px;
                width: 44px;
                height: 44px;
                font-size: 1rem;
            }
        }
    `;
    document.head.appendChild(style);

    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '↑';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollBtn);

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
})();