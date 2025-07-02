// Tech Stack Animation JavaScript - Fixed Version
const logos = document.querySelectorAll(".tech-flexbox img");
const techName = document.querySelector("#techName");
const animationBox = document.querySelector(".tech-animation-box");

// Simplified state management
let isHovered = false;
let currentTech = "";

// Clear any existing timeouts to prevent conflicts
let hoverTimeout;

const showTechName = (name) => {
  clearTimeout(hoverTimeout);
  currentTech = name;
  techName.innerHTML = name;
  animationBox.classList.add("tech-hovered");
  isHovered = true;
};

const hideTechName = () => {
  clearTimeout(hoverTimeout);
  isHovered = false;
  
  // Small delay to prevent flickering on fast movements
  hoverTimeout = setTimeout(() => {
    if (!isHovered) {
      animationBox.classList.remove("tech-hovered");
      techName.innerHTML = "Tech Stack";
    }
  }, 50);
};

// Handling mouse enter event on technology icon
const handleMouseEnter = (e) => {
  const techName = e.target.getAttribute('name');
  showTechName(techName);
};

// Handling mouse leave event from technology icon
const handleMouseLeave = () => {
  hideTechName();
};

// Add event listeners to each technology icon
logos.forEach((logo) => {
  logo.addEventListener("mouseenter", handleMouseEnter);
  logo.addEventListener("mouseleave", handleMouseLeave);
});

// Reset to default state when mouse leaves the entire container
const techWrapper = document.querySelector(".tech-wrapper");
if (techWrapper) {
  techWrapper.addEventListener("mouseleave", () => {
    clearTimeout(hoverTimeout);
    isHovered = false;
    animationBox.classList.remove("tech-hovered");
    techName.innerHTML = "Tech Stack";
  });
}