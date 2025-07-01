function openProject(url) {
        // You can customize this function to handle project clicks
        console.log('Opening project:', url);
    }

    // Optional: Add click handlers for individual links to prevent card click
    document.querySelectorAll('.project-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.stopPropagation();
            // Handle individual link clicks here
        });
    });

// Optional: Dark mode toggle (if you have one)
// This assumes you have a dark mode toggle elsewhere
function toggleDarkMode() {
    document.body.classList.toggle('light');
}