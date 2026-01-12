// Projects data array
const projectsData = [
    {
        title: "TidyTasks",
        description: "Built a task management app with dynamic add/edit/delete features, smooth UI interactions, and real-time updates using React hooks.",
        image: "Assets/tidy_tasks.png",
        imageType: "img",
        tags: ["HTML", "CSS", "React JS"],
        links: {
            demo: "https://tidytasks.vercel.app/",
            github: "https://github.com/SwastikSharma15/TidyTasks"
        }
    },
    {
        title: "Movie Plex",
        description: "Built a responsive movie browsing app with React and Vite, featuring real-time search via external APIs and optimized performance using hooks and reusable components.",
        image: "Assets/movieplex.webp",
        imageType: "img", // "img" or "video"
        tags: ["HTML", "CSS", "React JS"],
        links: {
            demo: "https://movieplexapp.vercel.app/",
            github: "https://github.com/SwastikSharma15/Movie-React-App"
        }
    },
    {
        title: "ShopKar",
        description: "Full-featured e-commerce platform using React.js and Vite with dynamic cart, RESTful APIs, advanced search/filtering, and mobile-first checkout.",
        image: "Assets/ShopKar.webp",
        imageType: "img",
        tags: ["HTML", "CSS", "React JS"],
        links: {
            demo: "https://shopkar-react.vercel.app",
            github: "https://github.com/SwastikSharma15/ShopKar"
        }
    },
    {
        title: "Portfolio Website",
        description: "A responsive developer portfolio featuring interactive UI, dark mode, and project highlights.",
        image: "Assets/Portfolio.webp",
        imageType: "img",
        tags: ["HTML", "CSS", "JavaScript"],
        links: {
            demo: "https://swastiksharma15.github.io/Portfolio/index.html",
            github: "https://github.com/SwastikSharma15/Portfolio"
        }
    },
    {
        title: "Amazon Clone",
        description: "A responsive Amazon-inspired website with shopping cart, order placement, real-time tracking, and order history features.",
        image: "Assets/Amazon.webp",
        imageType: "img",
        tags: ["HTML", "CSS", "JavaScript"],
        links: {
            demo: "https://swastiksharma15.github.io/Amazon-with-HTML-CSS-JS/",
            github: "https://github.com/SwastikSharma15/Amazon-with-HTML-CSS-JS"
        }
    },
    {
        title: "Cursor Trails Animation",
        description: "Refined Shiny Cursor Animation is a stylish, interactive mouse trail effect built with HTML, CSS, and JavaScript...",
        imageType: "video",
        videoSources: [
            { src: "Assets/trail_animation.webm", type: "video/webm" },
            { src: "Assets/trail_animation.mp4", type: "video/mp4" }
        ],
        tags: ["HTML", "CSS", "JavaScript"],
        links: {
            demo: "https://swastiksharma15.github.io/Cursor-Trails-Animation/",
            github: "https://github.com/SwastikSharma15/Cursor-Trails-Animation"
        }
    },
    {
        title: "Button Animation",
        description: "Interactive button animations with smooth hover effects and modern CSS transitions. Perfect for enhancing user interface interactions.",
        image: "Assets/buttonAni.png",
        imageType: "img",
        tags: ["HTML", "CSS", "JavaScript"],
        links: {
            demo: "https://swastiksharma15.github.io/Button-Animation/",
            github: "https://github.com/SwastikSharma15/Button-Animation"
        }
    },
    {
        title: "Glossy Button Animation",
        description: "Interactive button animations with smooth hover effects and modern CSS transitions. Perfect for enhancing user interface interactions.",
        image: "Assets/glosstBtn.png",
        imageType: "img",
        tags: ["HTML", "CSS"],
        links: {
            demo: "https://swastiksharma15.github.io/Sleek-Button/",
            github: "https://github.com/SwastikSharma15/Sleek-Button"
        }
    }
];

// Function to create a project card HTML
function createProjectCard(project) {
    const mediaElement = project.imageType === "video"
    ? `
        <video class="project-placeholder-img" autoplay muted loop playsinline poster="Assets/trail_animation.webp">
        ${project.videoSources.map(
            (v) => `<source src="${v.src}" type="${v.type}">`
        ).join("\n")}Your browser does not support the video tag.</video>`
        : `<img class="project-placeholder-img" src="${project.image}" alt="${project.title}">`;
    
    const tagsHTML = project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('');
    
    return `
        <div class="project-card">
            <div class="project-image">
                <div class="project-placeholder">${mediaElement}</div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tags">
                    ${tagsHTML}
                </div>
                <div class="project-links">
                    <a href="${project.links.demo}" target="_blank" class="project-link primary">Live Demo</a>
                    <a href="${project.links.github}" target="_blank" class="project-link secondary">GitHub</a>
                </div>
            </div>
        </div>
    `;
}

// Function to render all projects
function renderProjects() {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) {
        console.error('Projects grid container not found');
        return;
    }
    
    const projectsHTML = projectsData.map(project => createProjectCard(project)).join('');
    projectsGrid.innerHTML = projectsHTML;
    
    // Add click handlers for individual links to prevent card click
    document.querySelectorAll('.project-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.stopPropagation();
            // Handle individual link clicks here if needed
        });
    });
}

// Initialize projects when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    renderProjects();
});

// Function to add a new project (for future use)
function addProject(projectData) {
    projectsData.push(projectData);
    renderProjects();
}

// Function to open project (legacy function kept for compatibility)
function openProject(url) {
    console.log('Opening project:', url);
}

// Optional: Dark mode toggle (if you have one)
function toggleDarkMode() {
    document.body.classList.toggle('light');
}
